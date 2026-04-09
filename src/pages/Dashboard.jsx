import React, { useState, useEffect } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { 
  Activity, 
  AlertCircle, 
  Users, 
  Clock,
  Map as MapIcon,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lightbulb,
  ShieldAlert
} from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
  <div className="card stat-card">
    <div className="stat-icon" style={{ backgroundColor: `${color}20`, color: color }}>
      {icon}
    </div>
    <div className="stat-info">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
    <style jsx>{`
      .stat-card {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }
      .stat-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
      }
      .stat-info h3 {
        font-size: 0.875rem;
        color: var(--text-muted);
        font-weight: 500;
      }
      .stat-info p {
        font-size: 1.5rem;
        font-weight: 700;
        margin-top: 0.25rem;
      }
    `}</style>
  </div>
);

const TimelineRow = ({ timeline }) => {
  if (!timeline || timeline.length === 0) return null;
  
  return (
    <div className="timeline-container fade-in">
      {timeline.map((step, idx) => (
        <div key={idx} className="timeline-step">
          <div className="step-point completed"></div>
          <div className="step-info">
            <strong>{step.stage}</strong>
            <span>{new Date(step.time).toLocaleTimeString()}</span>
          </div>
          {idx < timeline.length - 1 && <div className="step-line" />}
        </div>
      ))}
      <style jsx>{`
        .timeline-container {
          display: flex;
          align-items: center;
          padding: 1.5rem 2rem;
          background: rgba(15, 23, 42, 0.4);
          border-radius: 8px;
          margin: 0.75rem 1rem;
          overflow-x: auto;
        }
        .timeline-step {
          display: flex;
          align-items: center;
          position: relative;
        }
        .step-point {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--border);
          position: relative;
          z-index: 2;
        }
        .step-point.completed {
          background: var(--success);
          box-shadow: 0 0 8px var(--success);
        }
        .step-info {
          display: flex;
          flex-direction: column;
          margin-left: 0.75rem;
          margin-right: 2rem;
        }
        .step-info strong { font-size: 0.875rem; color: var(--text-main); }
        .step-info span { font-size: 0.7rem; color: var(--text-muted); }
        .step-line {
          position: absolute;
          top: 7px;
          left: 14px;
          height: 2px;
          background: var(--success);
          width: calc(100% - 14px + 2rem);
          z-index: 1;
        }
      `}</style>
    </div>
  );
};

const Dashboard = () => {
  const { incidents, resources, decisionLogs, analytics, emergencyMode, setEmergencyMode } = useDisaster();
  const [sessionTime, setSessionTime] = useState(0);
  const [activeMapPoint, setActiveMapPoint] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const activeIncidents = incidents.filter(i => i.status !== 'Resolved');
  const highPriority = incidents.filter(i => i.severity === 'High' && i.status !== 'Resolved');
  const availableResources = resources.filter(r => r.status === 'Available');

  const getMapPosition = (id) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
    return { top: `${15 + Math.abs(hash % 70)}%`, left: `${15 + Math.abs((hash >> 3) % 70)}%` };
  };

  // Generate Smart Recommendations
  const recommendations = [];
  if (highPriority.length > 0 && availableResources.length === 0) {
    recommendations.push("Critical: No resources available for high priority incidents. Override requested.");
  }
  const pendingCritical = activeIncidents.filter(i => i.status === 'Pending' && i.priorityLabel === 'Critical');
  if (pendingCritical.length > 0) {
    recommendations.push(`Priority allocation needed for ${pendingCritical[0].location}. High risk zone detected.`);
  }

  const toggleRow = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <div>
          <h1>Operations Command Center</h1>
          <p>Real-time system monitoring and incident oversight</p>
        </div>
        <div className="header-controls">
          <button 
            className={`btn-emergency ${emergencyMode ? 'active' : ''}`}
            onClick={() => setEmergencyMode(!emergencyMode)}
          >
            <ShieldAlert size={18} />
            {emergencyMode ? 'EMERGENCY OVERRIDE ACTIVE' : 'Enable Emergency Mode'}
          </button>
          <div className="time-badge">
            <Clock size={16} />
            <span>Active Session: {formatTime(sessionTime)}</span>
          </div>
        </div>
      </header>

      {/* Analytics Matrix */}
      <div className="analytics-section">
        <h3 className="section-title">System Analytics Matrix</h3>
        <div className="stats-grid">
          <StatCard 
            title="Total Incidents Handled" 
            value={analytics.totalHandled} 
            icon={<AlertCircle size={24} />} 
            color="var(--primary)" 
          />
          <StatCard 
            title="Missions Resolved" 
            value={analytics.totalResolved} 
            icon={<AlertTriangle size={24} />} 
            color="var(--success)" 
          />
          <StatCard 
            title="Avg Simulated Resolve Time" 
            value={`${analytics.totalResolved > 0 ? (analytics.sumResponseTime / analytics.totalResolved).toFixed(1) : 0}s`} 
            icon={<Clock size={24} />} 
            color="var(--warning)" 
          />
          <StatCard 
            title="Resource Utilization" 
            value={`${((1 - availableResources.length / Math.max(1, resources.length)) * 100).toFixed(0)}%`} 
            icon={<Activity size={24} />} 
            color="var(--danger)" 
          />
        </div>
      </div>

      <div className="dashboard-content">
        <div className="main-area">
          <div className="card incident-list-card">
            <div className="card-header">
              <h2>Active Incidents Workflow</h2>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Incident</th>
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Affected</th>
                  <th>Timeline</th>
                </tr>
              </thead>
              <tbody>
                {activeIncidents.sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0)).map(incident => (
                  <React.Fragment key={incident.id}>
                    <tr 
                      className={`
                        ${incident.priorityLabel === 'Critical' ? 'row-critical' : incident.priorityLabel === 'High' ? 'row-high' : ''}
                        ${expandedId === incident.id ? 'row-expanded' : ''}
                      `}
                      onClick={() => toggleRow(incident.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <div className="type-cell">
                          <span className={`dot ${incident.severity?.toLowerCase()}`}></span>
                          {incident.type}
                        </div>
                      </td>
                      <td>{incident.location}</td>
                      <td>
                        <div className="priority-cell">
                          <span className={`badge badge-${incident.priorityLabel?.toLowerCase() || incident.severity?.toLowerCase()}`}>
                            {incident.priorityLabel || incident.severity}
                          </span>
                          {incident.priorityScore && (
                            <span className="priority-score">Score: {incident.priorityScore}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`status-${incident.status.toLowerCase().replace(' ', '-')}`}>
                          {incident.status}
                        </span>
                      </td>
                      <td>{incident.peopleAffected}</td>
                      <td>
                        <div className="expand-cell">
                          {expandedId === incident.id ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                        </div>
                      </td>
                    </tr>
                    {expandedId === incident.id && (
                      <tr className="timeline-row-wrapper">
                        <td colSpan="6" style={{ padding: 0, border: 'none' }}>
                          <TimelineRow timeline={incident.timeline} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="side-area">
          {/* Smart Recommendations */}
          <div className="card recommendations-card fade-in">
            <div className="card-header" style={{ marginBottom: '1rem' }}>
              <h2>Smart Recommendations</h2>
              <Lightbulb size={18} color="var(--warning)" />
            </div>
            <div className="log-container" style={{ maxHeight: '150px' }}>
              {recommendations.length > 0 ? recommendations.map((rec, idx) => (
                <div key={idx} className="rec-item">
                  <div className="rec-icon"><Lightbulb size={14} /></div>
                  <div className="rec-text">{rec}</div>
                </div>
              )) : (
                <div className="rec-item muted">No immediate recommendations. System stable.</div>
              )}
            </div>
          </div>

          <div className="card map-card fade-in">
            <div className="card-header">
              <h2>Incident Map</h2>
              <MapIcon size={18} color="var(--text-muted)" />
            </div>
            <div className="mock-map">
              <div className="map-grid"></div>
              {activeIncidents.map(inc => {
                const pos = getMapPosition(inc.id);
                const colorClass = inc.severity === 'Critical' ? 'red' :
                                   inc.severity === 'High' ? 'orange' :
                                   inc.severity === 'Medium' ? 'yellow' : 'green';
                const isActive = activeMapPoint === inc.id;

                return (
                  <div 
                    key={inc.id}
                    className={`pulse-point ${colorClass} ${isActive ? 'active-point' : ''}`} 
                    style={{ top: pos.top, left: pos.left }}
                    onMouseEnter={() => setActiveMapPoint(inc.id)}
                    onMouseLeave={() => setActiveMapPoint(null)}
                    onClick={() => setActiveMapPoint(inc.id)}
                  >
                    {isActive && (
                      <div className="map-tooltip fade-in">
                        <strong>{inc.type}</strong>
                        <span>{inc.location}</span>
                        <span className={`badge badge-${inc.priorityLabel?.toLowerCase() || inc.severity?.toLowerCase()}`} style={{marginTop: '0.25rem'}}>
                          {inc.priorityLabel || inc.severity}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="map-legend">
              <span>● Active Emergency</span>
            </div>
          </div>

          <div className="card decision-log-card fade-in">
            <div className="card-header">
              <h2>AI Decision Log</h2>
            </div>
            <div className="log-container">
              {decisionLogs.slice(0, 10).map(log => (
                <div key={log.id} className="log-item">
                  <div className="log-time">{log.time}</div>
                  <div className="log-msg">{log.message}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .dashboard-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .page-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
        }

        .page-header p {
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .header-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .time-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--bg-card);
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid var(--border);
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .btn-emergency {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(239, 68, 68, 0.1);
          color: var(--danger);
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
          border: 1px solid rgba(239, 68, 68, 0.3);
          font-size: 0.875rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-emergency:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        .btn-emergency.active {
          background: var(--danger);
          color: white;
          animation: criticalPulse 2s infinite;
          border-color: transparent;
        }

        @keyframes criticalPulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }

        .section-title {
          font-size: 0.875rem;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 1rem;
          letter-spacing: 1px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .dashboard-content {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 1.5rem;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .card-header h2 {
          font-size: 1.125rem;
          font-weight: 600;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          text-align: left;
          padding: 1rem;
          color: var(--text-muted);
          font-weight: 500;
          font-size: 0.75rem;
          text-transform: uppercase;
          border-bottom: 1px solid var(--border);
        }

        .data-table td {
          padding: 1.25rem 1rem;
          border-bottom: 1px solid var(--border);
          font-size: 0.875rem;
          transition: background 0.2s;
        }

        .data-table tr:hover td {
          background: rgba(255, 255, 255, 0.02);
        }

        .row-expanded td {
          border-bottom: none;
        }

        .row-critical td {
          background: rgba(239, 68, 68, 0.08);
          border-bottom: 1px solid rgba(239, 68, 68, 0.2);
        }

        .row-high td {
          background: rgba(245, 158, 11, 0.05);
          border-bottom: 1px solid rgba(245, 158, 11, 0.2);
        }

        .priority-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .priority-score {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .type-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 500;
        }

        .expand-cell {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          color: var(--text-muted);
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .dot.high { background: var(--high); box-shadow: 0 0 8px var(--high); }
        .dot.medium { background: var(--medium); }
        .dot.low { background: var(--low); }

        .mock-map {
          height: 300px;
          background: #020617;
          border-radius: 8px;
          position: relative;
          overflow: hidden;
          border: 1px solid var(--border);
        }

        .map-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(51, 65, 85, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(51, 65, 85, 0.2) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .pulse-point {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          z-index: 2;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .pulse-point:hover, .pulse-point.active-point {
          transform: scale(1.5);
          z-index: 10;
        }

        .pulse-point::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .pulse-point.red { background: var(--danger); box-shadow: 0 0 10px var(--danger); }
        .pulse-point.red::after { border: 2px solid var(--danger); }
        .pulse-point.orange { background: #f97316; box-shadow: 0 0 10px #f97316; }
        .pulse-point.orange::after { border: 2px solid #f97316; }
        .pulse-point.yellow { background: var(--warning); box-shadow: 0 0 10px var(--warning); }
        .pulse-point.yellow::after { border: 2px solid var(--warning); }
        .pulse-point.green { background: var(--success); box-shadow: 0 0 10px var(--success); }
        .pulse-point.green::after { border: 2px solid var(--success); }

        .map-tooltip {
          position: absolute;
          bottom: 150%;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.75rem;
          border-radius: 8px;
          width: max-content;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
          pointer-events: none;
          z-index: 20;
        }

        .map-tooltip strong {
          color: white;
          font-size: 0.875rem;
        }

        .map-tooltip span {
          color: var(--text-muted);
          font-size: 0.75rem;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        .map-legend {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .side-area {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .decision-log-card {
          flex: 1;
        }
        
        .log-container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 250px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .log-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0.75rem;
          background: rgba(15, 23, 42, 0.4);
          border-left: 2px solid var(--primary);
          border-radius: 0 4px 4px 0;
          font-size: 0.8125rem;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .log-time {
          font-size: 0.65rem;
          color: var(--text-muted);
        }

        .log-msg {
          color: var(--text-main);
          line-height: 1.4;
        }

        .rec-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(245, 158, 11, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(245, 158, 11, 0.2);
          font-size: 0.8125rem;
          color: var(--text-main);
        }
        
        .rec-item.muted {
          background: rgba(15, 23, 42, 0.4);
          border-color: rgba(255,255,255,0.05);
          color: var(--text-muted);
          justify-content: center;
        }

        .rec-icon {
          color: var(--warning);
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
