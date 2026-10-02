import { Search } from 'lucide-react';
import { cn } from '../../utils/cn';

const SearchBox = ({ className, ...props }) => {
  return (
    <div className={cn('relative w-full', className)}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-5 h-5 text-neutral-400" />
      </div>
      <input
        type="search"
        className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors duration-200 bg-white/50 backdrop-blur-sm"
        placeholder="Search..."
        {...props}
      />
    </div>
  );
};

export default SearchBox;
