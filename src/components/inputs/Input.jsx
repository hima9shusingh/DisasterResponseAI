import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-medium text-neutral-700">{label}</label>}
      <input
        ref={ref}
        className={cn(
          'input-field',
          error && 'border-emergency focus:ring-emergency focus:border-emergency',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-emergency">{error}</span>}
    </div>
  );
});
Input.displayName = 'Input';
export default Input;
