import { forwardRef, InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, id, ...rest }, ref) => {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="field-group">
        <label htmlFor={fieldId} className="field-label">
          {label}
        </label>
        <input
          id={fieldId}
          ref={ref}
          className={`field-input${error ? ' field-input--error' : ''}`}
          {...rest}
        />
        {error && (
          <span role="alert" className="field-error">
            {error}
          </span>
        )}
      </div>
    );
  },
);

FormField.displayName = 'FormField';
