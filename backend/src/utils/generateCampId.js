import ReliefCamp from '../models/ReliefCamp.js';

const generateCampId = async () => {
  const year = new Date().getFullYear();
  const prefix = `ADR-CAMP-${year}-`;

  const lastCamp = await ReliefCamp.findOne({
    campId: new RegExp(`^${prefix}`)
  }).sort({ createdAt: -1 });

  let sequence = 1;
  if (lastCamp && lastCamp.campId) {
    const lastSequence = parseInt(lastCamp.campId.replace(prefix, ''), 10);
    if (!isNaN(lastSequence)) {
      sequence = lastSequence + 1;
    }
  }

  return `${prefix}${String(sequence).padStart(5, '0')}`;
};

export default generateCampId;
