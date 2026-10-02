import Resource from '../models/Resource.js';

const generateResourceId = async () => {
  const year = new Date().getFullYear();
  const prefix = `ADR-RES-${year}-`;

  const lastRes = await Resource.findOne({
    resourceId: new RegExp(`^${prefix}`)
  }).sort({ createdAt: -1 });

  let sequence = 1;
  if (lastRes && lastRes.resourceId) {
    const lastSequence = parseInt(lastRes.resourceId.replace(prefix, ''), 10);
    if (!isNaN(lastSequence)) {
      sequence = lastSequence + 1;
    }
  }

  return `${prefix}${String(sequence).padStart(5, '0')}`;
};

export default generateResourceId;
