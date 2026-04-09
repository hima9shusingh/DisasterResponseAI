import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDisaster } from '../context/DisasterContext';
import { Send, AlertTriangle, MapPin, Users, Info } from 'lucide-react';

const IncidentReport = () => {
  const { addIncident } = useDisaster();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'Fire',
    location: '',
    severity: 'Medium',
    peopleAffected: 0,
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addIncident(formData);
    navigate('/dashboard');
  };

  return (
    <div className="report-page">
      <header className="page-header">
        <h1>Incident Reporting</h1>
        <p>Broadcast critical disaster data to the response network</p>
      </header>

      <div className="report-container">
        <div className="card report-card">
          <form onSubmit={handleSubmit} className="report-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Disaster Type</label>
                <div className="select-wrapper">
                  <AlertTriangle size={18} className="form-icon" />
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option>Fire</option>
                    <option>Flood</option>
                    <option>Traffic Accident</option>
                    <option>Earthquake</option>
                    <option>Hazardous Spill</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Location / Area</label>
                <div className="input-wrapper">
                  <MapPin size={18} className="form-icon" />
                  <input 
                    type="text" 
                    placeholder="e.g. Sector 7, Block B"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Severity Level</label>
                <div className="select-wrapper">
                  <div className={`severity-indicator ${formData.severity.toLowerCase()}`}></div>
                  <select 
                    value={formData.severity}
                    onChange={(e) => setFormData({...formData, severity: e.target.value})}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>People Affected (Estimate)</label>
                <div className="input-wrapper">
                  <Users size={18} className="form-icon" />
                  <input 
                    type="number" 
                    value={formData.peopleAffected}
                    onChange={(e) => setFormData({...formData, peopleAffected: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group full-width">
              <label>Additional Details</label>
              <textarea 
                placeholder="Describe current situation, immediate needs, or structural damage..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="4"
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Send size={18} />
                Dispatch Alert
              </button>
            </div>
          </form>
        </div>

        <aside className="report-info">
          <div className="card info-card glass">
            <Info size={24} color="var(--primary)" />
            <h3>Reporting Guidelines</h3>
            <ul>
              <li>Be specific about the location if possible.</li>
              <li>Estimate people affected to help resource scaling.</li>
              <li>Updates will be visible to all active units immediately.</li>
            </ul>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .report-page {
          max-width: 1000px;
          margin: 0 auto;
        }

        .page-header { margin-bottom: 2rem; }
        .page-header h1 { font-size: 1.75rem; }
        .page-header p { color: var(--text-muted); }

        .report-container {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 2rem;
        }

        .report-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group.full-width { grid-column: span 2; }

        .form-group label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-muted);
        }

        .input-wrapper, .select-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .form-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-muted);
          pointer-events: none;
        }

        .severity-indicator {
          position: absolute;
          left: 1rem;
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .severity-indicator.low { background: var(--low); }
        .severity-indicator.medium { background: var(--medium); }
        .severity-indicator.high { background: var(--high); }
        .severity-indicator.critical { background: var(--danger); box-shadow: 0 0 5px var(--danger); }

        input, select, textarea {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: white;
          outline: none;
        }

        textarea { padding-left: 1rem; }

        input:focus, select:focus, textarea:focus {
          border-color: var(--primary);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }

        .btn-primary {
          background: var(--primary);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-secondary {
          background: transparent;
          color: var(--text-muted);
          padding: 0.75rem 1.5rem;
        }

        .info-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .info-card h3 { font-size: 1rem; }
        .info-card ul {
          padding-left: 1.25rem;
          font-size: 0.875rem;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default IncidentReport;
