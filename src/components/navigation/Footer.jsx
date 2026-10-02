import { Link } from 'react-router-dom';
import { ShieldAlert, Mail, Phone, MapPin } from 'lucide-react';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="col-span-1 md:col-span-5 pr-0 md:pr-12">
          <Link to="/" className="text-2xl font-bold text-white flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
              <ShieldAlert size={20} />
            </div>
            ADRRAS
          </Link>
          <p className="text-sm leading-relaxed mb-8">
            Adaptive Disaster Response & Resource Allocation System. 
            Empowering communities, coordinating rapid response, and saving lives through intelligent emergency management.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"><FaTwitter size={18} /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"><FaFacebook size={18} /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"><FaInstagram size={18} /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"><FaLinkedin size={18} /></a>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <h4 className="text-white font-semibold mb-6">Platform</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
            <li><Link to="/auth/login" className="hover:text-white transition-colors">Login to Portal</Link></li>
          </ul>
        </div>

        <div className="col-span-1 md:col-span-2">
          <h4 className="text-white font-semibold mb-6">Resources</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#guide" className="hover:text-white transition-colors">Emergency Guide</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Volunteer Training</a></li>
            <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="col-span-1 md:col-span-3">
          <h4 className="text-white font-semibold mb-6">Contact</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 text-primary shrink-0" />
              <span>National Disaster Management HQ, Tech Park, Cityville, 10001</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-primary shrink-0" />
              <span>+1 (800) 123-HELP</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-primary shrink-0" />
              <span>support@adrras.gov</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>&copy; {new Date().getFullYear()} ADRRAS. All rights reserved.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
