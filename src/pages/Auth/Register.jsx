import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { getApiErrorMessage } from '../../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'citizen'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isSubmitting = React.useRef(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const getDashboardRoute = (role) => {
    switch (role?.toLowerCase()) {
      case 'citizen': return '/citizen/dashboard';
      case 'volunteer': return '/volunteer/dashboard';
      case 'ngo': return '/ngo/dashboard';
      default: return '/citizen/dashboard';
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isSubmitting.current) return;
    setError('');
    setIsLoading(true);
    isSubmitting.current = true;

    try {
      const response = await authService.register(formData);
      if (response.success && response.data?.token) {
        login(response.data.user, response.data.token);
        navigate(getDashboardRoute(response.data.user.role));
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
      isSubmitting.current = false;
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card glass" style={{ padding: '2rem', maxWidth: '480px' }}>
        <div className="login-header">
          <ShieldAlert size={40} color="var(--primary, #3b82f6)" style={{ margin: '0 auto' }} />
          <h1 style={{ fontSize: '1.75rem' }}>Create Account</h1>
          <p style={{ marginBottom: '1.5rem' }}>Join the Disaster Response Network</p>
        </div>

        {error && (
          <div className="error-message bg-red-100 text-red-600 p-3 rounded mb-4 flex items-center text-sm">
            <AlertCircle size={16} className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="login-form">
          <div className="input-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Phone Number (Optional)</label>
            <div className="input-wrapper">
              <Phone size={18} className="input-icon" />
              <input
                type="tel"
                name="phone"
                placeholder="+1 234 567 890"
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Role</label>
            <div className="input-wrapper" style={{ display: 'block' }}>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: 'white',
                  outline: 'none'
                }}
              >
                <option value="citizen">Citizen</option>
                <option value="volunteer">Volunteer</option>
                <option value="ngo">NGO Representative</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="8"
                disabled={isLoading}
              />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="login-footer">
          <p className="mt-4">
            Already have an account? <Link to="/auth/login" className="text-blue-400 hover:underline">Sign In here</Link>
          </p>
        </div>
      </div>

      {/* Reuse the same CSS as Login for consistency */}
      <style>{`
        .login-screen {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);
          padding: 2rem 1rem;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          text-align: center;
          background: rgba(30, 41, 59, 0.7);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .login-header h1 {
          font-size: 2rem;
          margin: 1rem 0 0.5rem;
          letter-spacing: 2px;
          color: white;
        }

        .login-header p {
          color: #94a3b8;
          font-size: 0.875rem;
          margin-bottom: 2.5rem;
        }

        .login-form {
          text-align: left;
        }

        .input-group {
          margin-bottom: 1.25rem;
        }

        .input-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: #cbd5e1;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: #64748b;
        }

        .input-wrapper input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid #334155;
          border-radius: 8px;
          color: white;
          outline: none;
          transition: border-color 0.2s;
        }

        .input-wrapper input:focus {
          border-color: #3b82f6;
        }

        .input-wrapper input:disabled, .input-wrapper select:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-btn {
          width: 100%;
          padding: 0.75rem;
          background: #3b82f6;
          color: white;
          font-weight: 600;
          border-radius: 8px;
          margin-top: 0.5rem;
          transition: background 0.2s;
        }

        .login-btn:hover:not(:disabled) {
          background: #2563eb;
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Register;
