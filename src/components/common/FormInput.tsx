import React from 'react';
import clsx from 'clsx';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  icon?: string;
}

export default React.forwardRef<HTMLInputElement, FormInputProps>(function FormInput(
  {
    label,
    name,
    type = 'text',
    placeholder,
    error,
    success,
    disabled = false,
    icon,
    ...rest
  },
  ref
) {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="form-label">
          {icon && <i className={`fas fa-${icon}`}></i>}
          <span>{label}</span>
        </label>
      )}
      <div className="input-wrapper">
        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={clsx('form-input', {
            'input-error': error,
            'input-valid': success,
            'opacity-50 cursor-not-allowed': disabled,
          })}
          {...rest}
        />
        <span className="input-focus-bg"></span>
      </div>
      {error && (
        <span className="error-message" style={{ display: 'block' }}>{error}</span>
      )}
      {success && !error && (
        <span className="success-message" style={{ display: 'block' }}>{success}</span>
      )}
    </div>
  );
});
