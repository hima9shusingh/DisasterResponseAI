import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { 
  Truck, 
  Battery, 
  MapPin, 
  ShieldCheck, 
  Wrench,
  Package
} from 'lucide-react';

const ResourceCard = ({ resource, onClick, isSelected }) => {
  const isMaintenance = resource.status === 'Maintenance';

  const getIcon = (type) => {
    switch(type) {
      case 'Ambulance': return <Truck size={24} />;
      case 'Rescue Team': return <ShieldCheck size={24} />;
      case 'Supply Unit': return <Package size={24} />;
      default: return <Truck size={24} />;
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Available': return 'status-resolved';
      case 'On Duty': return 'status-progress';
      case 'Maintenance': return 'status-pending';
      default: return '';
    }
  };

  return (
    <div 
      className={`card resource-card ${isSelected ? 'active-card-ring' : ''} clickable-card`}
      onClick={() => { if (onClick) onClick(resource.id); }}
    >
      <div className="res-header">
        <div className="res-icon-bg">
          {getIcon(resource.type)}
        </div>
        <div className="res-title">
          <h3>{resource.name}</h3>
          <span>{resource.type}</span>
        </div>
        <div className={`res-status-dot ${getStatusClass(resource.status)}`}></div>
      </div>
      
      <div className="res-body">
        <div className="res-info-row">
          <MapPin size={14} />
          <span>{resource.location}</span>
        </div>
        
        {resource.battery && (
          <div className="res-info-row">
            <Battery size={14} className={resource.battery < 20 ? 'text-danger' : ''} />
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${resource.battery}%`, 
                  background: `hsl(${resource.battery * 1.2}, 80%, 45%)`,
                  borderRadius: '999px',
                  boxShadow: `0 0 8px hsl(${resource.battery * 1.2}, 80%, 45%)`
                }}
              ></div>
            </div>
            <span>{resource.battery}%</span>
          </div>
        )}

        {resource.members && (
          <div className="res-info-row">
            <ShieldCheck size={14} />
            <span>Personnel: {resource.members} Members</span>
          </div>
        )}

        {resource.capacity && (
          <div className="res-info-row">
            <Package size={14} />
            <span>Payload: {resource.capacity}</span>
          </div>
        )}
      </div>

      <div className="res-footer">
        <span className={getStatusClass(resource.status)}>{resource.status}</span>
        {resource.status === 'Maintenance' && <Wrench size={14} />}
      </div>

      <style jsx>{`
        .resource-card {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        
        .clickable-card {
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .clickable-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
        }

        .active-card-ring {
          box-shadow: 0 0 0 2px var(--primary), 0 20px 25px -5px rgba(0, 0, 0, 0.3);
          transform: translateY(-4px);
        }

        .res-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
        }

        .res-icon-bg {
          width: 44px;
          height: 44px;
          background: rgba(59, 130, 246, 0.1);
          color: var(--primary);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .res-title h3 {
          font-size: 1rem;
          font-weight: 600;
        }

        .res-title span {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .res-status-dot {
          position: absolute;
          right: 0;
          top: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .res-body {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .res-info-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        .progress-bar {
          flex: 1;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .res-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .text-danger { color: var(--danger); transition: color 0.3s; }
      `}</style>
    </div>
  );
};

const ResourceManager = () => {
  const { resources, incidents, allocateResource } = useDisaster();
  const [filter, setFilter] = useState('All');
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState('');

  const pendingIncidents = incidents.filter(inc => inc.status === 'Pending');

  const filteredResources = resources.filter(res => {
    if (filter === 'Ambulance') return res.type === 'Ambulance';
    if (filter === 'Rescue Team') return res.type === 'Rescue Team';
    if (filter === 'Supply Unit') return res.type === 'Supply Unit';
    return true; // All
  });

  const selectedResource = resources.find(r => r.id === selectedResourceId);

  return (
    <div className="resources-page">
      <header className="page-header">
        <h1>Resource Management</h1>
        <p>Monitor and deploy critical units across the disaster zone</p>
      </header>

      <div className="resource-filters card glass">
        <button 
          className={`filter-btn ${filter === 'All' ? 'active' : ''}`}
          onClick={() => setFilter('All')}
        >
          All Assets ({resources.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'Ambulance' ? 'active' : ''}`}
          onClick={() => setFilter('Ambulance')}
        >
          Ambulances
        </button>
        <button 
          className={`filter-btn ${filter === 'Rescue Team' ? 'active' : ''}`}
          onClick={() => setFilter('Rescue Team')}
        >
          Rescue Teams
        </button>
        <button 
          className={`filter-btn ${filter === 'Supply Unit' ? 'active' : ''}`}
          onClick={() => setFilter('Supply Unit')}
        >
          Supply Units
        </button>
      </div>

      <div className="resources-grid">
        {filteredResources.map(res => (
          <div className="fade-in" key={res.id}>
            <ResourceCard 
              resource={res} 
              isSelected={selectedResourceId === res.id}
              onClick={setSelectedResourceId}
            />
          </div>
        ))}
      </div>

      {selectedResource && (
        <div className="modal-overlay fade-in" onClick={() => setSelectedResourceId(null)}>
          <div className="card modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedResource.name}</h2>
              <button className="close-btn" onClick={() => setSelectedResourceId(null)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="detail-row">
                <span>Type:</span>
                <strong>{selectedResource.type}</strong>
              </div>
              <div className="detail-row">
                <span>Location:</span>
                <strong>{selectedResource.location}</strong>
              </div>
              <div className="detail-row">
                <span>Status:</span>
                <strong className={`status-${selectedResource.status.toLowerCase().replace(' ', '-')}`}>{selectedResource.status}</strong>
              </div>
              {selectedResource.battery && (
                <div className="detail-row">
                  <span>Battery:</span>
                  <strong>{selectedResource.battery}%</strong>
                </div>
              )}
              {selectedResource.capacity && (
                <div className="detail-row">
                  <span>Payload:</span>
                  <strong>{selectedResource.capacity}</strong>
                </div>
              )}
              {selectedResource.members && (
                <div className="detail-row">
                  <span>Personnel:</span>
                  <strong>{selectedResource.members}</strong>
                </div>
              )}

              {selectedResource.status === 'Available' ? (
                <div className="assignment-section">
                  <label>Assign to Emergency</label>
                  <select 
                    value={selectedIncidentId} 
                    onChange={e => setSelectedIncidentId(e.target.value ? Number(e.target.value) : '')}
                    className="incident-select"
                  >
                    <option value="">Select Pending Incident...</option>
                    {pendingIncidents.map(inc => (
                      <option key={inc.id} value={inc.id}>
                        {inc.type} @ {inc.location} ({inc.priorityLabel})
                      </option>
                    ))}
                  </select>
                  <button 
                    className="btn-assign"
                    disabled={!selectedIncidentId}
                    onClick={() => {
                      allocateResource(selectedIncidentId, selectedResource.id);
                      setSelectedIncidentId('');
                      setSelectedResourceId(null);
                    }}
                  >
                    Assign to Incident
                  </button>
                </div>
              ) : selectedResource.status === 'Maintenance' ? (
                <div className="locked-section maintenance-lock">
                  <strong>Resource Under Maintenance</strong>
                  <p>Deployment unavailable until repairs complete.</p>
                </div>
              ) : (
                <div className="locked-section">
                  Resource is currently {selectedResource.status} and cannot be reassigned manually.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .resources-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .resource-filters {
          display: flex;
          gap: 0.5rem;
          padding: 0.75rem;
          border-radius: 9999px;
          width: fit-content;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 0.625rem 1.5rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          color: var(--text-muted);
          background: transparent;
          font-weight: 500;
        }

        .filter-btn:hover {
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.05);
        }

        .filter-btn.active {
          background: var(--primary);
          color: white;
          font-weight: 600;
          box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
        }

        .resources-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 1024px) {
          .resources-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .resources-grid { grid-template-columns: 1fr; }
          .resource-filters { width: 100%; justify-content: center; border-radius: 12px; }
          .filter-btn { padding: 0.5rem 1rem; font-size: 0.75rem; }
        }

        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .modal-content {
          width: 100%;
          max-width: 450px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.1), var(--bg-card));
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .modal-header h2 { font-size: 1.25rem; font-weight: 600; }
        
        .close-btn {
          background: none;
          color: var(--text-muted);
          font-size: 1.5rem;
          padding: 0;
          line-height: 1;
        }
        
        .close-btn:hover { color: var(--text-main); }

        .modal-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 0.875rem;
        }

        .detail-row span { color: var(--text-muted); }

        .assignment-section {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }

        .assignment-section label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 600;
        }

        .incident-select {
          width: 100%;
          padding: 0.75rem;
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid var(--border);
          border-radius: 6px;
          color: white;
          font-family: inherit;
          font-size: 0.875rem;
          outline: none;
        }
        
        .incident-select:focus {
          border-color: var(--primary);
        }

        .btn-assign {
          width: 100%;
          padding: 0.875rem;
          background: var(--primary);
          color: white;
          border-radius: 6px;
          font-weight: 600;
          margin-top: 0.5rem;
        }

        .btn-assign:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: var(--border);
        }

        .locked-section {
          margin-top: 1rem;
          padding: 1rem;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 8px;
          color: var(--warning);
          font-size: 0.8125rem;
          text-align: center;
        }

        .locked-section.maintenance-lock {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.2);
          color: var(--danger);
        }

        .maintenance-lock strong {
          display: block;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default ResourceManager;
