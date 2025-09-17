import { useState, useRef, useCallback } from 'react';

export type FieldType = 'text' | 'email' | 'password' | 'number' | 'checkbox' | 'select' | 'radio' | 'textarea';

export type ValidatorFn = (value: any, values: Record<string, any>) => string | null | Promise<string | null>;

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  validator?: ValidatorFn | ValidatorFn[];
  initialValue?: any;
  options?: Array<{ label: string; value: any }>; // for select/radio
  validateOnChangeOf?: string[]; // names of fields that should trigger this field's validation
}

export type UpdateFieldsArg =
  | { field: FieldConfig; mode: 'add' | 'update' }
  | { name: string; mode: 'remove' };

export interface UseFormReturn {
  values: Record<string, any>;
  errors: Record<string, string | null>;
  loading: Record<string, boolean>;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleSubmit: (e: React.FormEvent, onValid: (values: Record<string, any>) => void) => void;
  reset: () => void;
  setValue: (name: string, value: any) => void;
  updateFields: (arg: UpdateFieldsArg) => void;
}

export const validators = {
  required: (msg = 'Required') => (value: any) => {
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) return msg;
    return null;
  },
  email: (msg = 'Invalid email') => (value: any) => {
    if (!value) return null;
    return /\S+@\S+\.\S+/.test(value) ? null : msg;
  },
  number: (msg = 'Must be a number') => (value: any) => {
    if (!value && value !== 0) return null;
    return isNaN(Number(value)) ? msg : null;
  },
  maxLength: (max: number, msg?: string) => (value: any) => {
    if (!value) return null;
    return value.length > max ? (msg || `Max length is ${max}`) : null;
  },
  minLength: (min: number, msg?: string) => (value: any) => {
    if (!value) return null;
    return value.length < min ? (msg || `Min length is ${min}`) : null;
  },
};

async function runValidators(
  validator: ValidatorFn | ValidatorFn[] | undefined,
  value: any,
  values: Record<string, any>
): Promise<string | null> {
  if (!validator) return null;
  const validatorsArr = Array.isArray(validator) ? validator : [validator];
  for (const v of validatorsArr) {
    const result = await v(value, values);
    if (result) return result;
  }
  return null;
}

const DEBOUNCE_MS = 400;

export function useForm(fieldsConfig: FieldConfig[] | (() => FieldConfig[])): UseFormReturn {
  // Only use updateFields to change fields at runtime. Do not change fieldsConfig prop after mount.
  const getFields = () => (typeof fieldsConfig === 'function' ? fieldsConfig() : fieldsConfig);
  const [fields, setFields] = useState<FieldConfig[]>(getFields());

  const updateFields = useCallback((arg: UpdateFieldsArg) => {
    setFields(prevFields => {
      if (arg.mode === 'remove') {
        const newFields = prevFields.filter(f => f.name !== arg.name);
        setValues(prev => {
          const { [arg.name]: _, ...rest } = prev;
          return rest;
        });
        setErrors(prev => {
          const { [arg.name]: _, ...rest } = prev;
          return rest;
        });
        setLoading(prev => {
          const { [arg.name]: _, ...rest } = prev;
          return rest;
        });
        return newFields;
      } else if (arg.mode === 'add') {
        // Only add if not present
        if (prevFields.some(f => f.name === arg.field.name)) return prevFields;
        setValues(prev => ({ ...prev, [arg.field.name]: arg.field.type === 'checkbox' ? arg.field.initialValue ?? false : arg.field.initialValue ?? '' }));
        setErrors(prev => ({ ...prev, [arg.field.name]: null }));
        setLoading(prev => ({ ...prev, [arg.field.name]: false }));
        return [...prevFields, arg.field];
      } else if (arg.mode === 'update') {
        // Update field config, preserve value/error/loading
        return prevFields.map(f => f.name === arg.field.name ? arg.field : f);
      }
      return prevFields;
    });
    Object.values(debounceTimers.current).forEach(clearTimeout);
    debounceTimers.current = {};
  }, []);

  const computeInitialValues = (fields: FieldConfig[]) => {
    const initialValues: Record<string, any> = {};
    fields.forEach(f => {
      if (f.type === 'checkbox') {
        initialValues[f.name] = f.initialValue ?? false;
      } else {
        initialValues[f.name] = f.initialValue ?? '';
      }
    });
    return initialValues;
  };

  const [values, setValues] = useState<Record<string, any>>(computeInitialValues(fields));
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, type, value, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    if (submitted) {
      // Find all fields that should be re-validated
      const toValidate = new Set<string>();
      toValidate.add(name); // always validate the changed field
      fields.forEach(f => {
        if (f.validateOnChangeOf && f.validateOnChangeOf.includes(name)) {
          toValidate.add(f.name);
        }
      });
      toValidate.forEach(fieldName => {
        const field = fields.find(f => f.name === fieldName);
        if (field) {
          setLoading(prev => ({ ...prev, [fieldName]: true }));
          if (debounceTimers.current[fieldName]) clearTimeout(debounceTimers.current[fieldName]);
          debounceTimers.current[fieldName] = setTimeout(() => {
            runValidators(field.validator, fieldName === name ? newValue : values[fieldName], { ...values, [name]: newValue }).then((err) => {
              setErrors(prev => ({ ...prev, [fieldName]: err }));
              setLoading(prev => ({ ...prev, [fieldName]: false }));
            });
          }, DEBOUNCE_MS);
        }
      });
    }
  };

  const validate = async (vals: Record<string, any>) => {
    // Clear all debounce timers before validating
    Object.values(debounceTimers.current).forEach(clearTimeout);
    debounceTimers.current = {};
    const newErrors: Record<string, string | null> = {};
    const newLoading: Record<string, boolean> = {};
    await Promise.all(
      fields.map(async (f) => {
        newLoading[f.name] = true;
        newErrors[f.name] = await runValidators(f.validator, vals[f.name], vals);
        newLoading[f.name] = false;
      })
    );
    setErrors(newErrors);
    setLoading(newLoading);
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent, onValid: (values: Record<string, any>) => void) => {
    e.preventDefault();
    setSubmitted(true);
    const newErrors = await validate(values);
    const hasError = Object.values(newErrors).some(Boolean);
    if (!hasError) {
      onValid(values);
    }
  };

  const reset = () => {
    setValues(computeInitialValues(fields));
    setErrors({});
    setLoading({});
    setSubmitted(false);
    Object.values(debounceTimers.current).forEach(clearTimeout);
    debounceTimers.current = {};
  };

  const setValue = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (submitted) {
      // Find all fields that should be re-validated
      const toValidate = new Set<string>();
      toValidate.add(name);
      fields.forEach(f => {
        if (f.validateOnChangeOf && f.validateOnChangeOf.includes(name)) {
          toValidate.add(f.name);
        }
      });
      toValidate.forEach(fieldName => {
        const field = fields.find(f => f.name === fieldName);
        if (field) {
          setLoading(prev => ({ ...prev, [fieldName]: true }));
          if (debounceTimers.current[fieldName]) clearTimeout(debounceTimers.current[fieldName]);
          debounceTimers.current[fieldName] = setTimeout(() => {
            runValidators(field.validator, fieldName === name ? value : values[fieldName], { ...values, [name]: value }).then((err) => {
              setErrors(prev => ({ ...prev, [fieldName]: err }));
              setLoading(prev => ({ ...prev, [fieldName]: false }));
            });
          }, DEBOUNCE_MS);
        }
      });
    }
  };

  return { values, errors, loading, handleChange, handleSubmit, reset, setValue, updateFields };
}
