import { Moon, Sun } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useSettings();
  const isDark = theme === 'dark';

  return (
    <button 
      onClick={toggleTheme}
      className="p-2 rounded-full text-neutral-600 hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
      aria-label="Toggle theme"
    >
      {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
};

export default ThemeToggle;
