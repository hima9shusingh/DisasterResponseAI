import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Button = forwardRef(({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'btn',
        {
          'btn-primary': variant === 'primary',
          'btn-danger': variant === 'danger',
          'btn-ghost': variant === 'ghost',
          'bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-100': variant === 'outline',
          'px-2 py-1 text-sm': size === 'sm',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = 'Button';
export default Button;
