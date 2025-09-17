import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useForm, validators, FieldConfig } from './useForm';
import { debounceValidator } from './debounceValidator';
import AsyncTextField from './AsyncTextField';

const meta: Meta = {
  title: 'Hooks/useForm',
};
export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => {
    const fields: FieldConfig[] = [
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        validator: [validators.required(), validators.email()],
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        validator: [validators.required(), validators.minLength(6)],
      },
      {
        name: 'role',
        label: 'Role',
        type: 'select',
        options: [
          { label: 'Select role', value: '' },
          { label: 'Admin', value: 'admin' },
          { label: 'User', value: 'user' },
        ],
        validator: validators.required('Role is required'),
      },
      {
        name: 'terms',
        label: 'Accept Terms',
        type: 'checkbox',
        validator: (v) => v ? null : 'You must accept the terms',
      },
    ];
    const { values, errors, handleChange, handleSubmit, reset } = useForm(fields);
    const [submitted, setSubmitted] = React.useState<Record<string, any> | null>(null);
    return (
      <form
        onSubmit={e => handleSubmit(e, (vals) => { setSubmitted(vals); })}
        className="max-w-md mx-auto p-4 border rounded flex flex-col gap-4"
      >
        {fields.map(field => (
          <div key={field.name} className="flex flex-col gap-1">
            <label className="font-medium">
              {field.type === 'checkbox' ? (
                <>
                  <input
                    type="checkbox"
                    name={field.name}
                    checked={!!values[field.name]}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {field.label}
                </>
              ) : (
                <>
                  {field.label}
                  {field.type === 'select' ? (
                    <select
                      name={field.name}
                      value={values[field.name]}
                      onChange={handleChange}
                      className="mt-1 border rounded px-2 py-1"
                    >
                      {field.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={values[field.name]}
                      onChange={handleChange}
                      className="mt-1 border rounded px-2 py-1"
                    />
                  )}
                </>
              )}
            </label>
            {errors[field.name] && (
              <span className="text-red-500 text-xs">{errors[field.name]}</span>
            )}
          </div>
        ))}
        <div className="flex gap-2 mt-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
          <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={reset}>Reset</button>
        </div>
        {submitted && (
          <pre className="mt-4 bg-gray-100 p-2 rounded text-xs">{JSON.stringify(submitted, null, 2)}</pre>
        )}
      </form>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates useForm with multiple field types, built-in and multiple validators, and error display.'
      },
      source: { type: 'code' },
    },
  },
};

export const AsyncValidation: Story = {
  render: () => {
    const fields: FieldConfig[] = [
      {
        name: 'username',
        label: 'Username',
        type: 'text',
        validator: debounceValidator(async (value) => {
          if (!value) return 'Required';
          await new Promise(res => setTimeout(res, 600));
          if (['admin', 'user', 'taken'].includes(value.toLowerCase())) return 'Username taken';
          return null;
        }, 400),
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        validator: [validators.required(), validators.email()],
      },
    ];
    const { values, errors, loading, handleChange, handleSubmit, reset } = useForm(fields);
    const [submitted, setSubmitted] = React.useState<Record<string, any> | null>(null);
    return (
      <form
        onSubmit={e => handleSubmit(e, (vals) => { setSubmitted(vals); })}
        className="max-w-md mx-auto p-4 border rounded flex flex-col gap-4"
      >
        <AsyncTextField
          label="Username"
          name="username"
          value={values.username}
          onChange={handleChange}
          error={errors.username}
          loading={loading.username}
        />
        <AsyncTextField
          label="Email"
          name="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          loading={loading.email}
          type="email"
        />
        <div className="flex gap-2 mt-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
          <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={reset}>Reset</button>
        </div>
        {submitted && (
          <pre className="mt-4 bg-gray-100 p-2 rounded text-xs">{JSON.stringify(submitted, null, 2)}</pre>
        )}
      </form>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates useForm with an async debounced validator (username availability check) and a memoized AsyncTextField with loading spinner.'
      },
      source: { type: 'code' },
    },
  },
};

export const DynamicFields: Story = {
  render: () => {
    const baseFields: FieldConfig[] = [
      {
        name: 'name',
        label: 'Name',
        type: 'text' as const,
        validator: [validators.required(), validators.minLength(2)],
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email' as const,
        validator: [validators.required(), validators.email()],
      },
    ];
    const phoneField: FieldConfig = {
      name: 'phone',
      label: 'Phone Number',
      type: 'text' as const,
      validator: [validators.required(), validators.minLength(10)],
    };
    const { values, errors, handleChange, handleSubmit, reset, updateFields } = useForm(baseFields);
    const [submitted, setSubmitted] = React.useState<Record<string, any> | null>(null);
    const [phoneAdded, setPhoneAdded] = React.useState(false);
    const [phoneLabel, setPhoneLabel] = React.useState('Phone Number');

    const handleAdd = () => {
      updateFields({ field: { ...phoneField, label: phoneLabel }, mode: 'add' });
      setPhoneAdded(true);
    };
    const handleRemove = () => {
      updateFields({ name: 'phone', mode: 'remove' });
      setPhoneAdded(false);
    };
    const handleUpdate = () => {
      updateFields({ field: { ...phoneField, label: 'Updated Phone Label' }, mode: 'update' });
      setPhoneLabel('Updated Phone Label');
    };

    // Compose the current fields for rendering
    const currentFields = [
      ...baseFields,
      ...(phoneAdded ? [{ ...phoneField, label: phoneLabel }] : []),
    ];

    return (
      <>
        <div className="mb-4 flex gap-2">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={handleAdd} disabled={phoneAdded}>
            Add Phone Field
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={handleUpdate} disabled={!phoneAdded}>
            Update Phone Label
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={handleRemove} disabled={!phoneAdded}>
            Remove Phone Field
          </button>
        </div>
        <form
          onSubmit={e => handleSubmit(e, (vals) => { setSubmitted(vals); })}
          className="max-w-md mx-auto p-4 border rounded flex flex-col gap-4"
        >
          {currentFields.map(field => (
            <div key={field.name} className="flex flex-col gap-1">
              <label className="font-medium">
                {field.label}
                <input
                  type={field.type}
                  name={field.name}
                  value={values[field.name] ?? ''}
                  onChange={handleChange}
                  className="mt-1 border rounded px-2 py-1"
                />
              </label>
              {errors[field.name] && (
                <span className="text-red-500 text-xs">{errors[field.name]}</span>
              )}
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
            <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={reset}>Reset</button>
          </div>
          {submitted && (
            <pre className="mt-4 bg-gray-100 p-2 rounded text-xs">{JSON.stringify(submitted, null, 2)}</pre>
          )}
        </form>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates useForm with updateFields for add, update, and remove. Other fields are preserved.'
      },
      source: { type: 'code' },
    },
  },
};

export const CustomValidatorWithState: Story = {
  render: () => {
    // Example: user must enter a code that matches the current state value
    const [expectedCode, setExpectedCode] = React.useState('1234');
    const codeField = React.useMemo(() => ({
      name: 'code',
      label: 'Enter Code',
      type: 'text' as const,
      validator: (value: string) => value === expectedCode ? null : `Code must match ${expectedCode}`,
    }), [expectedCode]);
    const { values, errors, handleChange, handleSubmit, reset, updateFields } = useForm([codeField]);
    const [submitted, setSubmitted] = React.useState<Record<string, any> | null>(null);

    // Update the validator for the code field when expectedCode changes
    React.useEffect(() => {
      updateFields({ field: codeField, mode: 'update' });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [codeField]);

    return (
      <>
        <div className="mb-4 flex gap-2 items-center">
          <span className="font-medium">Expected code:</span>
          <input
            type="text"
            value={expectedCode}
            onChange={e => setExpectedCode(e.target.value)}
            className="border rounded px-2 py-1 w-24"
          />
        </div>
        <form
          onSubmit={e => handleSubmit(e, (vals) => { setSubmitted(vals); })}
          className="max-w-md mx-auto p-4 border rounded flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <label className="font-medium">
              Enter Code
              <input
                type="text"
                name="code"
                value={values.code}
                onChange={handleChange}
                className="mt-1 border rounded px-2 py-1"
              />
            </label>
            {errors.code && (
              <span className="text-red-500 text-xs">{errors.code}</span>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
            <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={reset}>Reset</button>
          </div>
          {submitted && (
            <pre className="mt-4 bg-gray-100 p-2 rounded text-xs">{JSON.stringify(submitted, null, 2)}</pre>
          )}
        </form>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates a custom validator that compares a field value with a value from component state. Changing the expected code updates the validator via updateFields.'
      },
      source: { type: 'code' },
    },
  },
};

export const CrossFieldValidation: Story = {
  render: () => {
    const fields: FieldConfig[] = [
      {
        name: 'password',
        label: 'Password',
        type: 'password' as const,
        validator: [validators.required(), validators.minLength(6)],
      },
      {
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password' as const,
        validateOnChangeOf: ['password'],
        validator: (value, values) => value === values.password ? null : 'Passwords must match',
      },
    ];
    const { values, errors, handleChange, handleSubmit, reset } = useForm(fields);
    const [submitted, setSubmitted] = React.useState<Record<string, any> | null>(null);
    return (
      <form
        onSubmit={e => handleSubmit(e, (vals) => { setSubmitted(vals); })}
        className="max-w-md mx-auto p-4 border rounded flex flex-col gap-4"
      >
        {fields.map(field => (
          <div key={field.name} className="flex flex-col gap-1">
            <label className="font-medium">
              {field.label}
              <input
                type={field.type}
                name={field.name}
                value={values[field.name]}
                onChange={handleChange}
                className="mt-1 border rounded px-2 py-1"
              />
            </label>
            {errors[field.name] && (
              <span className="text-red-500 text-xs">{errors[field.name]}</span>
            )}
          </div>
        ))}
        <div className="flex gap-2 mt-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
          <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={reset}>Reset</button>
        </div>
        {submitted && (
          <pre className="mt-4 bg-gray-100 p-2 rounded text-xs">{JSON.stringify(submitted, null, 2)}</pre>
        )}
      </form>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Cross-field validation: Confirm Password must match Password.'
      },
      source: { type: 'code' },
    },
  },
};

export const AsyncValidationWithState: Story = {
  render: () => {
    const [bannedEmails, setBannedEmails] = React.useState(['banned@example.com', 'test@blocked.com']);
    const fields: FieldConfig[] = [
      {
        name: 'email',
        label: 'Email',
        type: 'email' as const,
        validator: async (value) => {
          if (!value) return 'Required';
          await new Promise(res => setTimeout(res, 400));
          if (bannedEmails.includes(value)) return 'This email is banned';
          return validators.email()(value);
        },
      },
    ];
    const { values, errors, loading, handleChange, handleSubmit, reset } = useForm(fields);
    const [submitted, setSubmitted] = React.useState<Record<string, any> | null>(null);
    return (
      <>
        <div className="mb-4 flex gap-2 items-center">
          <span className="font-medium">Banned emails:</span>
          <input
            type="text"
            value={bannedEmails.join(',')}
            onChange={e => setBannedEmails(e.target.value.split(','))}
            className="border rounded px-2 py-1 w-64"
          />
        </div>
        <form
          onSubmit={e => handleSubmit(e, (vals) => { setSubmitted(vals); })}
          className="max-w-md mx-auto p-4 border rounded flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <label className="font-medium">
              Email
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                className="mt-1 border rounded px-2 py-1"
              />
            </label>
            {loading.email && <span className="text-xs text-blue-500">Checking...</span>}
            {errors.email && (
              <span className="text-red-500 text-xs">{errors.email}</span>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
            <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={reset}>Reset</button>
          </div>
          {submitted && (
            <pre className="mt-4 bg-gray-100 p-2 rounded text-xs">{JSON.stringify(submitted, null, 2)}</pre>
          )}
        </form>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Async validation with state: Email must not be in the banned list.'
      },
      source: { type: 'code' },
    },
  },
};

export const ConditionalValidation: Story = {
  render: () => {
    const fields: FieldConfig[] = [
      {
        name: 'subscribe',
        label: 'Subscribe to newsletter',
        type: 'checkbox' as const,
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email' as const,
        validator: (value, values) => values.subscribe ? validators.required()(value) || validators.email()(value) : null,
      },
    ];
    const { values, errors, handleChange, handleSubmit, reset } = useForm(fields);
    const [submitted, setSubmitted] = React.useState<Record<string, any> | null>(null);
    return (
      <form
        onSubmit={e => handleSubmit(e, (vals) => { setSubmitted(vals); })}
        className="max-w-md mx-auto p-4 border rounded flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <label className="font-medium">
            <input
              type="checkbox"
              name="subscribe"
              checked={!!values.subscribe}
              onChange={handleChange}
              className="mr-2"
            />
            Subscribe to newsletter
          </label>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-medium">
            Email
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              className="mt-1 border rounded px-2 py-1"
            />
          </label>
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email}</span>
          )}
        </div>
        <div className="flex gap-2 mt-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
          <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={reset}>Reset</button>
        </div>
        {submitted && (
          <pre className="mt-4 bg-gray-100 p-2 rounded text-xs">{JSON.stringify(submitted, null, 2)}</pre>
        )}
      </form>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Conditional validation: Email is required only if Subscribe is checked.'
      },
      source: { type: 'code' },
    },
  },
};
