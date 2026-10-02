import { Link } from 'react-router-dom';
import { ShieldAlert, Menu, X } from 'lucide-react';
import { useState } from 'react';

const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="h-20 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 transition-all duration-300">
      <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
          <ShieldAlert size={24} />
        </div>
        <span className="tracking-tight">ADRRAS</span>
      </Link>
      
      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8 font-medium text-neutral-600">
        <a href="#home" className="hover:text-primary transition-colors">Home</a>
        <a href="#about" className="hover:text-primary transition-colors">About</a>
        <a href="#features" className="hover:text-primary transition-colors">Features</a>
        <a href="#guide" className="hover:text-primary transition-colors">Emergency Guide</a>
        <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <Link to="/auth/login" className="font-medium text-neutral-700 hover:text-primary transition-colors px-4 py-2">
          Login
        </Link>
        <Link to="/report" className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg shadow-red-500/30 flex items-center gap-2">
          <ShieldAlert size={18} />
          Report Emergency
        </Link>
      </div>

      {/* Mobile Nav Toggle */}
      <button className="md:hidden text-neutral-700" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-white border-b border-neutral-200 p-6 flex flex-col gap-4 shadow-xl md:hidden">
          <a href="#home" className="text-lg font-medium">Home</a>
          <a href="#about" className="text-lg font-medium">About</a>
          <a href="#features" className="text-lg font-medium">Features</a>
          <a href="#guide" className="text-lg font-medium">Emergency Guide</a>
          <a href="#contact" className="text-lg font-medium">Contact</a>
          <hr className="my-2" />
          <Link to="/auth/login" className="text-lg font-medium">Login</Link>
          <Link to="/report" className="bg-red-500 text-white px-4 py-3 rounded-xl font-bold text-center mt-2 flex items-center justify-center gap-2">
            <ShieldAlert size={20} />
            Report Emergency
          </Link>
        </div>
      )}
    </nav>
  );
};

export default PublicNavbar;
