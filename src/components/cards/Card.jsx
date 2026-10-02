import { cn } from '../../utils/cn';

const Card = ({ className, children, ...props }) => {
  return (
    <div className={cn('card', className)} {...props}>
      {children}
    </div>
  );
};

export default Card;
