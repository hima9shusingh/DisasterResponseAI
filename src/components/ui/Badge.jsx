import { cn } from '../../utils/cn';

const Badge = ({ variant = 'primary', className, children }) => {
  const variants = {
    primary: 'bg-primary-light/20 text-primary-dark',
    success: 'bg-success-light/20 text-success-dark',
    warning: 'bg-warning-light/20 text-warning-dark',
    danger: 'bg-emergency-light/20 text-emergency-dark',
    neutral: 'bg-neutral-200 text-neutral-700'
  };

  return (
    <span className={cn('badge', variants[variant] || variants.primary, className)}>
      {children}
    </span>
  );
};

export default Badge;
