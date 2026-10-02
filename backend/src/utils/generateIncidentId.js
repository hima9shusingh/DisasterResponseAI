import Incident from '../models/Incident.js';

const generateIncidentId = async () => {
  const year = new Date().getFullYear();
  const prefix = `ADR-INC-${year}-`;

  // Find the most recently created incident for the current year
  const lastIncident = await Incident.findOne({
    incidentId: new RegExp(`^${prefix}`)
  }).sort({ createdAt: -1 });

  let sequence = 1;
  if (lastIncident && lastIncident.incidentId) {
    const lastSequence = parseInt(lastIncident.incidentId.replace(prefix, ''), 10);
    if (!isNaN(lastSequence)) {
      sequence = lastSequence + 1;
    }
  }

  return `${prefix}${String(sequence).padStart(5, '0')}`;
};

export default generateIncidentId;
