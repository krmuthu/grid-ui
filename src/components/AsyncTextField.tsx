import React from 'react';

interface AsyncTextFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
  loading?: boolean;
  type?: string;
}

const AsyncTextField: React.FC<AsyncTextFieldProps> = React.memo(
  ({ label, name, value, onChange, error, loading, type = 'text' }) => (
    <div className="flex flex-col gap-1">
      <label className="font-medium">
        {label}
        <div className="relative">
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="mt-1 border rounded px-2 py-1 w-full pr-8"
          />
          {loading && (
            <span className="absolute right-2 top-2">
              <svg className="animate-spin h-4 w-4 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
            </span>
          )}
        </div>
      </label>
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  )
);

export default AsyncTextField;
