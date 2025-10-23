import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helper, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-github-text">
            {label}
          </label>
        )}
        <input
          className={clsx(
            'input-field w-full',
            {
              'border-github-danger focus:border-github-danger focus:ring-github-danger/20': error,
            },
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-github-danger">{error}</p>
        )}
        {helper && !error && (
          <p className="text-sm text-github-text-tertiary">{helper}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
