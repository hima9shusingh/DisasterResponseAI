import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, Mail, Lock, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { getApiErrorMessage } from '../../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const getDashboardRoute = (role) => {
    switch (role?.toLowerCase()) {
      case 'citizen': return '/citizen/dashboard';
      case 'volunteer': return '/volunteer/dashboard';
      case 'ngo': return '/ngo/dashboard';
      case 'government': return '/government/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/citizen/dashboard';
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });
      if (response.success && response.data?.token) {
        // Update context and local storage
        login(response.data.user, response.data.token);
        // Redirect based on role
        navigate(getDashboardRoute(response.data.user.role));
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card glass">
        <div className="login-header">
          <ShieldAlert size={48} color="var(--primary, #3b82f6)" style={{ margin: '0 auto' }} />
          <h1>ADR-RAS</h1>
          <p>Disaster Response & Resource Management</p>
        </div>

        {error && (
          <div className="error-message bg-red-100 text-red-600 p-3 rounded mb-4 flex items-center text-sm">
            <AlertCircle size={16} className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Authorizing...' : 'Authorize Access'}
          </button>
        </form>

        <div className="login-footer">
          <p className="mt-4">
            Don't have an account? <Link to="/auth/register" className="text-blue-400 hover:underline">Register here</Link>
          </p>
          <p className="mt-6 text-xs text-neutral-500 uppercase tracking-widest">Secure Terminal</p>
        </div>
      </div>

      <style>{`
        .login-screen {
          height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 3rem;
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
          margin-bottom: 1.5rem;
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

        .input-wrapper input:disabled {
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
          margin-top: 1rem;
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

export default Login;
