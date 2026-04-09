import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { 
  ClipboardList, 
  ArrowRight, 
  MapPin, 
  AlertCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';

const AllocationDashboard = () => {
  const { incidents, resources, allocations, allocateResource, updateIncidentStatus } = useDisaster();
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);

  const pendingIncidents = incidents.filter(inc => inc.status === 'Pending');
  // Sort resources to put available ones at top
  const sortedResources = [...resources].sort((a,b) => (a.status === 'Available' ? -1 : 1));

  const handleAllocate = () => {
    if (selectedIncident && selectedResource) {
      allocateResource(selectedIncident, selectedResource);
      setSelectedIncident(null);
      setSelectedResource(null);
    }
  };

  const getIncidentById = (id) => incidents.find(inc => inc.id === id);
  const getResourceById = (id) => resources.find(res => res.id === id);

  return (
    <div className="allocations-page">
      <header className="page-header">
        <h1>Allocation Control</h1>
        <p>Coordinate deployment and track mission active status</p>
      </header>

      <div className="allocation-tool-container">
        <div className="card tool-card glass">
          <h2>Deployment Workspace</h2>
          <div className="tool-grid">
            <div className="tool-column">
              <label>Select Pending Incident</label>
              <div className="list-selector">
                {pendingIncidents.length === 0 ? (
                  <p className="empty-msg">No pending incidents</p>
                ) : (
                  pendingIncidents.map(inc => (
                    <div 
                      key={inc.id} 
                      className={`selector-item ${selectedIncident === inc.id ? 'selected' : ''}`}
                      onClick={() => setSelectedIncident(inc.id)}
                    >
                      <div className="item-info">
                        <strong>{inc.type}</strong>
                        <span>{inc.location}</span>
                      </div>
                      <span className={`badge-mini ${inc.severity.toLowerCase()}`}>{inc.severity}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="tool-center">
              <ArrowRight size={32} color={selectedIncident && selectedResource ? 'var(--primary)' : 'var(--border)'} />
            </div>

            <div className="tool-column">
              <label>Select Deployment Unit (Override Supported)</label>
              <div className="list-selector">
                {sortedResources.length === 0 ? (
                  <p className="empty-msg">No resources found</p>
                ) : (
                  sortedResources.map(res => (
                    <div 
                      key={res.id} 
                      className={`selector-item ${selectedResource === res.id ? 'selected' : ''}`}
                      onClick={() => setSelectedResource(res.id)}
                    >
                      <div className="item-info">
                        <strong>{res.name}</strong>
                        <span>{res.status !== 'Available' ? `⚠️ In Use: ${res.status}` : res.type}</span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.25rem', color: res.status !== 'Available' ? 'var(--warning)' : 'var(--text-muted)'}}>
                        <MapPin size={14} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <button 
            className="btn-deploy" 
            disabled={!selectedIncident || !selectedResource}
            onClick={handleAllocate}
          >
            Confirm Deployment
          </button>
        </div>
      </div>

      <div className="active-missions-area">
        <h2>Active Mission Status</h2>
        <div className="missions-grid">
          {allocations.map(alloc => {
            const inc = getIncidentById(alloc.incidentId);
            const res = getResourceById(alloc.resourceId);
            if (!inc || !res) return null;

            return (
              <div key={alloc.id} className="card mission-card">
                <div className="mission-header">
                  <div className="id-badge">MIS-{alloc.id.toString().slice(-4)}</div>
                  <div className="mission-time">
                    <Clock size={12} />
                    {new Date(alloc.timestamp).toLocaleTimeString()}
                  </div>
                </div>

                <div className="mission-flow">
                  <div className="flow-node">
                    <AlertCircle size={20} color="var(--danger)" />
                    <div className="node-text">
                      <strong>{inc.type}</strong>
                      <span>{inc.location}</span>
                    </div>
                  </div>
                  <div className="flow-path">
                    <span style={{position: 'absolute', top: '-15px', right: '50%', transform: 'translateX(50%)', fontSize: '0.65rem', color: 'var(--text-muted)'}}>
                      {alloc.distance ? `${alloc.distance} km` : 'En Route'}
                    </span>
                  </div>
                  <div className="flow-node">
                    <div className="node-text align-right">
                      <strong>{res.name}</strong>
                      <span>Deployed</span>
                    </div>
                    <CheckCircle2 size={20} color="var(--primary)" />
                  </div>
                </div>

                <div className="mission-actions">
                  {inc.status === 'Assigned' && (
                    <button onClick={() => updateIncidentStatus(inc.id, 'Active')} className="btn-progress" style={{marginBottom: '0.5rem'}}>
                      Confirm & Start Mission
                    </button>
                  )}
                  <button onClick={() => updateIncidentStatus(inc.id, 'Resolved')} className="btn-resolve">
                    Mark Mission Resolved
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .allocations-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .tool-card {
          padding: 2rem;
        }

        .tool-card h2 {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .tool-grid {
          display: grid;
          grid-template-columns: 1fr 60px 1fr;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .tool-column {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .tool-column label {
          font-size: 0.875rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .tool-center {
          display: flex;
          justify-content: center;
        }

        .list-selector {
          height: 240px;
          background: rgba(15, 23, 42, 0.3);
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .selector-item {
          padding: 1rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .selector-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .selector-item.selected {
          background: rgba(59, 130, 246, 0.15);
          border-left: 3px solid var(--primary);
        }

        .item-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .item-info strong { font-size: 0.875rem; }
        .item-info span { font-size: 0.75rem; color: var(--text-muted); }

        .badge-mini {
          font-size: 0.625rem;
          font-weight: 700;
          padding: 0.125rem 0.5rem;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .badge-mini.high { background: rgba(239, 68, 68, 0.2); color: var(--danger); }
        .badge-mini.medium { background: rgba(245, 158, 11, 0.2); color: var(--warning); }
        .badge-mini.low { background: rgba(16, 185, 129, 0.2); color: var(--success); }

        .btn-deploy {
          width: 100%;
          padding: 1rem;
          background: var(--primary);
          color: white;
          font-weight: 600;
          border-radius: 8px;
        }

        .btn-deploy:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: var(--border);
        }

        .active-missions-area h2 {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .missions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .mission-card {
          padding: 1.5rem;
        }

        .mission-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .id-badge {
          font-size: 0.75rem;
          font-weight: 700;
          background: var(--bg-main);
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          color: var(--primary);
        }

        .mission-time {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .mission-flow {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .flow-node {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .node-text {
          display: flex;
          flex-direction: column;
        }

        .node-text.align-right { text-align: right; }
        .node-text strong { font-size: 0.875rem; }
        .node-text span { font-size: 0.75rem; color: var(--text-muted); }

        .flow-path {
          height: 1px;
          background: var(--border);
          flex: 0.5;
          position: relative;
        }

        .flow-path::after {
          content: '→';
          position: absolute;
          top: -10px;
          right: -5px;
          color: var(--border);
        }

        .btn-resolve {
          width: 100%;
          padding: 0.625rem;
          background: rgba(16, 185, 129, 0.1);
          color: var(--success);
          font-size: 0.875rem;
          font-weight: 600;
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 6px;
        }

        .btn-resolve:hover {
          background: var(--success);
          color: white;
        }

        .btn-progress {
          width: 100%;
          padding: 0.625rem;
          background: rgba(59, 130, 246, 0.1);
          color: var(--primary);
          font-size: 0.875rem;
          font-weight: 600;
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 6px;
          transition: all 0.2s;
        }

        .btn-progress:hover {
          background: var(--primary);
          color: white;
        }

        .empty-msg {
          padding: 2rem;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
};

export default AllocationDashboard;
