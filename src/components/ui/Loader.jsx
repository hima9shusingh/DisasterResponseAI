import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const Loader = ({ className, size = 'default' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    default: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn('flex items-center justify-center p-4', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizes[size] || sizes.default)} />
    </div>
  );
};

export default Loader;
