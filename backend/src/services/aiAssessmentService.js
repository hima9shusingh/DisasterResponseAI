/**
 * AI Assessment Service (Simulated)
 * 
 * This service currently abstracts the damage assessment logic.
 * In a real-world scenario, it would call an external Python ML service, TensorFlow model,
 * or a Computer Vision API. For the demo, it returns a deterministic assessment based on 
 * predefined logic, explicitly marked as 'simulation'.
 */

export const analyzeEvidence = async (incidentId, evidenceIds) => {
  // SIMULATION LOGIC:
  // We mock a deterministic response to keep it consistent for demos without
  // introducing flakiness or requiring real ML integration right now.
  
  // A fake delay to simulate processing time
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    classification: "flood",
    severity: "high",
    confidence: 0.82,
    riskScore: 78,
    damageCategories: [
      "water_damage",
      "infrastructure_damage"
    ],
    recommendations: [
      "Evacuate affected low-lying areas",
      "Deploy rescue teams",
      "Check medical requirements"
    ],
    modelVersion: "demo-v1",
    analysisMode: "simulation"
  };
};

export const assessIncidentRisk = async (incidentData) => {
  // Automated risk assessment calculation based on incident parameters
  await new Promise(resolve => setTimeout(resolve, 500)); // simulate computation

  let score = 10; // Base score

  // 1. Severity weight
  const severityWeights = {
    'low': 10,
    'medium': 30,
    'high': 60,
    'critical': 80
  };
  score += severityWeights[incidentData.severity?.toLowerCase()] || 10;

  // 2. People affected weight
  if (incidentData.peopleAffected > 500) score += 40;
  else if (incidentData.peopleAffected > 100) score += 20;
  else if (incidentData.peopleAffected > 20) score += 10;

  // Cap score at 100
  score = Math.min(score, 100);

  // 3. Determine Risk Level
  let level = 'LOW';
  if (score >= 80) level = 'CRITICAL';
  else if (score >= 60) level = 'HIGH';
  else if (score >= 40) level = 'MEDIUM';

  return {
    riskScore: score,
    riskLevel: level,
    factors: ['Severity input', 'People affected estimation'],
    assessedAt: new Date()
  };
};
