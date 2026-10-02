import SOSRequest from '../models/SOSRequest.js';

const generateSOSId = async () => {
  const year = new Date().getFullYear();
  const prefix = `SOS-${year}-`;

  const lastSOS = await SOSRequest.findOne({
    emergencyId: new RegExp(`^${prefix}`)
  }).sort({ createdAt: -1 });

  let sequence = 1;
  if (lastSOS && lastSOS.emergencyId) {
    const lastSequence = parseInt(lastSOS.emergencyId.replace(prefix, ''), 10);
    if (!isNaN(lastSequence)) {
      sequence = lastSequence + 1;
    }
  }

  return `${prefix}${String(sequence).padStart(5, '0')}`;
};

export default generateSOSId;
