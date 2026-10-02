import SupplyRequest from '../models/SupplyRequest.js';

const generateRequestId = async () => {
  const year = new Date().getFullYear();
  const prefix = `ADR-REQ-${year}-`;

  const lastReq = await SupplyRequest.findOne({
    requestId: new RegExp(`^${prefix}`)
  }).sort({ createdAt: -1 });

  let sequence = 1;
  if (lastReq && lastReq.requestId) {
    const lastSequence = parseInt(lastReq.requestId.replace(prefix, ''), 10);
    if (!isNaN(lastSequence)) {
      sequence = lastSequence + 1;
    }
  }

  return `${prefix}${String(sequence).padStart(5, '0')}`;
};

export default generateRequestId;
