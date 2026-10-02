import Mission from '../models/Mission.js';

const generateMissionId = async () => {
  const year = new Date().getFullYear();
  const prefix = `ADR-MSN-${year}-`;

  const lastMission = await Mission.findOne({
    missionId: new RegExp(`^${prefix}`)
  }).sort({ createdAt: -1 });

  let sequence = 1;
  if (lastMission && lastMission.missionId) {
    const lastSequence = parseInt(lastMission.missionId.replace(prefix, ''), 10);
    if (!isNaN(lastSequence)) {
      sequence = lastSequence + 1;
    }
  }

  return `${prefix}${String(sequence).padStart(5, '0')}`;
};

export default generateMissionId;
