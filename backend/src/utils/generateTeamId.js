import RescueTeam from '../models/RescueTeam.js';

const generateTeamId = async () => {
  const year = new Date().getFullYear();
  const prefix = `ADR-TEAM-${year}-`;

  const lastTeam = await RescueTeam.findOne({
    teamId: new RegExp(`^${prefix}`)
  }).sort({ createdAt: -1 });

  let sequence = 1;
  if (lastTeam && lastTeam.teamId) {
    const lastSequence = parseInt(lastTeam.teamId.replace(prefix, ''), 10);
    if (!isNaN(lastSequence)) {
      sequence = lastSequence + 1;
    }
  }

  return `${prefix}${String(sequence).padStart(5, '0')}`;
};

export default generateTeamId;
