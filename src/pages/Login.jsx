import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate auth
    navigate('/dashboard');
  };

  return (
    <div className="login-screen">
      <div className="login-card glass">
        <div className="login-header">
          <ShieldAlert size={48} color="var(--primary)" />
          <h1>ADR-RAS</h1>
          <p>Disaster Response & Resource Management</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                placeholder="admin@response.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
              />
            </div>
          </div>

          <button type="submit" className="login-btn">
            Authorize Access
          </button>
        </form>

        <div className="login-footer">
          <p>Secure Government Terminal #402</p>
        </div>
      </div>

      <style jsx>{`
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
        }

        .login-header h1 {
          font-size: 2rem;
          margin: 1rem 0 0.5rem;
          letter-spacing: 2px;
        }

        .login-header p {
          color: var(--text-muted);
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
          color: var(--text-muted);
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-muted);
        }

        .input-wrapper input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: white;
          outline: none;
          transition: border-color 0.2s;
        }

        .input-wrapper input:focus {
          border-color: var(--primary);
        }

        .login-btn {
          width: 100%;
          padding: 0.75rem;
          background: var(--primary);
          color: white;
          font-weight: 600;
          border-radius: 8px;
          margin-top: 1rem;
        }

        .login-btn:hover {
          background: var(--primary-hover);
        }

        .login-footer {
          margin-top: 2rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  );
};

export default Login;
