import Incident from '../models/Incident.js';
import Mission from '../models/Mission.js';
import Resource from '../models/Resource.js';
import ReliefCamp from '../models/ReliefCamp.js';
import User from '../models/User.js';
import SOSRequest from '../models/SOSRequest.js';

export const getSosAnalytics = async () => {
  const [summary] = await SOSRequest.aggregate([
    {
      $group: {
        _id: null,
        totalSOS: { $sum: 1 },
        activeSOS: { $sum: { $cond: [{ $in: ['$status', ['pending', 'dispatched']] }, 1, 0] } },
        resolvedSOS: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
        falseAlarms: { $sum: { $cond: [{ $eq: ['$status', 'false_alarm'] }, 1, 0] } }
      }
    }
  ]);
  
  return summary || {
    totalSOS: 0, activeSOS: 0, resolvedSOS: 0, falseAlarms: 0
  };
};

export const getIncidentAnalytics = async () => {
  const [summary] = await Incident.aggregate([
    { $match: { isArchived: { $ne: true } } },
    {
      $group: {
        _id: null,
        totalIncidents: { $sum: 1 },
        pendingIncidents: { $sum: { $cond: [{ $eq: ['$status', 'pending_verification'] }, 1, 0] } },
        activeIncidents: { $sum: { $cond: [{ $in: ['$status', ['verified', 'resources_assigned', 'rescue_in_progress']] }, 1, 0] } },
        resolvedIncidents: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
        criticalIncidents: { $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] } },
        highSeverityIncidents: { $sum: { $cond: [{ $eq: ['$severity', 'high'] }, 1, 0] } },
        mediumSeverityIncidents: { $sum: { $cond: [{ $eq: ['$severity', 'medium'] }, 1, 0] } },
        lowSeverityIncidents: { $sum: { $cond: [{ $eq: ['$severity', 'low'] }, 1, 0] } }
      }
    }
  ]);

  const incidentsByType = await Incident.aggregate([
    { $match: { isArchived: { $ne: true } } },
    { $group: { _id: "$type", count: { $sum: 1 } } },
    { $project: { _id: 0, name: "$_id", count: 1 } },
    { $sort: { count: -1 } }
  ]);

  const incidentsByRisk = await Incident.aggregate([
    { $match: { isArchived: { $ne: true }, 'riskAssessment.riskLevel': { $exists: true } } },
    { $group: { _id: "$riskAssessment.riskLevel", count: { $sum: 1 } } },
    { $project: { _id: 0, riskLevel: "$_id", count: 1 } }
  ]);

  return {
    ...(summary || {
      totalIncidents: 0, pendingIncidents: 0, activeIncidents: 0, resolvedIncidents: 0,
      criticalIncidents: 0, highSeverityIncidents: 0, mediumSeverityIncidents: 0, lowSeverityIncidents: 0
    }),
    incidentsByType,
    incidentsByRisk
  };
};

export const getResourceAnalytics = async () => {
  const [summary] = await Resource.aggregate([
    { $match: { isArchived: { $ne: true } } },
    {
      $group: {
        _id: null,
        totalResources: { $sum: 1 },
        availableResources: {
          $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] }
        },
        deployedResources: {
          $sum: { $cond: [{ $eq: ['$status', 'deployed'] }, 1, 0] }
        },
        busyResources: {
          $sum: { $cond: [{ $eq: ['$status', 'busy'] }, 1, 0] }
        },
        maintenanceResources: {
          $sum: { $cond: [{ $eq: ['$status', 'maintenance'] }, 1, 0] }
        },
        totalUnits: { $sum: '$totalUnits' },
        availableUnits: { $sum: '$availableUnits' },
        deployedUnits: { $sum: '$deployedUnits' }
      }
    }
  ]);

  return summary || {
    totalResources: 0, availableResources: 0, deployedResources: 0, busyResources: 0, maintenanceResources: 0,
    totalUnits: 0, availableUnits: 0, deployedUnits: 0
  };
};

export const getMissionAnalytics = async () => {
  const [summary] = await Mission.aggregate([
    {
      $group: {
        _id: null,
        totalMissions: { $sum: 1 },
        assignedMissions: {
          $sum: { $cond: [{ $in: ['$status', ['assigned', 'accepted']] }, 1, 0] }
        },
        activeMissions: {
          $sum: { $cond: [{ $in: ['$status', ['en_route', 'on_site', 'rescue_in_progress']] }, 1, 0] }
        },
        completedMissions: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        peopleRescued: { $sum: '$peopleRescued' },
        peopleRemaining: { $sum: '$peopleRemaining' }
      }
    }
  ]);

  return summary || {
    totalMissions: 0, assignedMissions: 0, activeMissions: 0, completedMissions: 0,
    peopleRescued: 0, peopleRemaining: 0
  };
};

export const getReliefCampAnalytics = async () => {
  const [summary] = await ReliefCamp.aggregate([
    { $match: { isArchived: { $ne: true } } },
    {
      $group: {
        _id: null,
        totalCamps: { $sum: 1 },
        activeCamps: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        nearCapacityCamps: {
          $sum: { $cond: [{ $eq: ['$status', 'near_capacity'] }, 1, 0] }
        },
        fullCamps: {
          $sum: { $cond: [{ $eq: ['$status', 'full'] }, 1, 0] }
        },
        totalCapacity: { $sum: '$capacity' },
        totalOccupied: { $sum: '$occupied' },
        totalAvailableBeds: { $sum: '$availableBeds' },
        food: { $sum: '$inventory.food' },
        water: { $sum: '$inventory.water' },
        medicine: { $sum: '$inventory.medicine' },
        blankets: { $sum: '$inventory.blankets' },
        emergencyKits: { $sum: '$inventory.emergencyKits' }
      }
    }
  ]);

  if (!summary) {
    return {
      totalCamps: 0, activeCamps: 0, nearCapacityCamps: 0, fullCamps: 0,
      totalCapacity: 0, totalOccupied: 0, totalAvailableBeds: 0, occupancyPercentage: 0,
      inventory: { food: 0, water: 0, medicine: 0, blankets: 0, emergencyKits: 0 }
    };
  }

  const occupancyPercentage = summary.totalCapacity > 0 ? (summary.totalOccupied / summary.totalCapacity) * 100 : 0;

  return {
    ...summary,
    occupancyPercentage,
    inventory: {
      food: summary.food,
      water: summary.water,
      medicine: summary.medicine,
      blankets: summary.blankets,
      emergencyKits: summary.emergencyKits
    }
  };
};

export const getVolunteerAnalytics = async () => {
  const [summary] = await User.aggregate([
    { $match: { role: 'volunteer', isActive: true } },
    {
      $group: {
        _id: null,
        totalVolunteers: { $sum: 1 },
        availableVolunteers: {
          $sum: { $cond: [{ $eq: ['$availability', 'available'] }, 1, 0] }
        },
        unavailableVolunteers: {
          $sum: { $cond: [{ $eq: ['$availability', 'unavailable'] }, 1, 0] }
        },
        completedVolunteerMissions: { $sum: '$volunteerStats.missionsCompleted' },
        peopleAssisted: { $sum: '$volunteerStats.peopleAssisted' }
      }
    }
  ]);

  return summary || {
    totalVolunteers: 0, availableVolunteers: 0, unavailableVolunteers: 0,
    completedVolunteerMissions: 0, peopleAssisted: 0
  };
};

export const getResponseTimeAnalytics = async () => {
  // Aggregate average verification time from Incidents
  const [incidentStats] = await Incident.aggregate([
    { $match: { verifiedAt: { $exists: true, $ne: null }, reportedAt: { $exists: true, $ne: null } } },
    {
      $group: {
        _id: null,
        avgVerificationTimeMs: {
          $avg: { $subtract: ['$verifiedAt', '$reportedAt'] }
        },
        avgResolutionTimeMs: {
          $avg: {
            $cond: [
              { $and: [{ $ne: ['$resolvedAt', null] }, { $ne: ['$reportedAt', null] }] },
              { $subtract: ['$resolvedAt', '$reportedAt'] },
              null
            ]
          }
        }
      }
    }
  ]);

  // Aggregate average mission start time from Missions
  const [missionStats] = await Mission.aggregate([
    { $match: { startedAt: { $exists: true, $ne: null }, createdAt: { $exists: true, $ne: null } } },
    {
      $group: {
        _id: null,
        avgMissionStartTimeMs: {
          $avg: { $subtract: ['$startedAt', '$createdAt'] }
        }
      }
    }
  ]);

  const avgVerificationTimeMinutes = incidentStats?.avgVerificationTimeMs ? (incidentStats.avgVerificationTimeMs / 1000 / 60) : 0;
  const avgResolutionTimeHours = incidentStats?.avgResolutionTimeMs ? (incidentStats.avgResolutionTimeMs / 1000 / 60 / 60) : 0;
  const avgMissionStartTimeMinutes = missionStats?.avgMissionStartTimeMs ? (missionStats.avgMissionStartTimeMs / 1000 / 60) : 0;

  return {
    averageVerificationTimeMinutes: Number(avgVerificationTimeMinutes.toFixed(2)),
    averageResolutionTimeHours: Number(avgResolutionTimeHours.toFixed(2)),
    averageMissionStartTimeMinutes: Number(avgMissionStartTimeMinutes.toFixed(2))
  };
};

export const getIncidentTrend = async (period) => {
  let dateBoundary = new Date();
  
  if (period === '7d') dateBoundary.setDate(dateBoundary.getDate() - 7);
  else if (period === '30d') dateBoundary.setDate(dateBoundary.getDate() - 30);
  else if (period === '90d') dateBoundary.setDate(dateBoundary.getDate() - 90);
  else if (period === '1y') dateBoundary.setFullYear(dateBoundary.getFullYear() - 1);
  else dateBoundary.setDate(dateBoundary.getDate() - 30); // Default 30d

  const trend = await Incident.aggregate([
    { $match: { reportedAt: { $gte: dateBoundary }, isArchived: { $ne: true } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$reportedAt" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        date: "$_id",
        count: 1
      }
    }
  ]);

  return trend;
};

export const getRegionalAnalytics = async () => {
  const regions = await Incident.aggregate([
    { $match: { isArchived: { $ne: true } } },
    {
      $group: {
        _id: {
          state: "$location.state",
          district: "$location.district",
          city: "$location.city"
        },
        incidents: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        state: "$_id.state",
        district: "$_id.district",
        city: "$_id.city",
        incidents: 1
      }
    },
    { $sort: { state: 1, district: 1, city: 1 } }
  ]);

  return regions;
};

export const getResourceUtilization = async () => {
  const utilization = await Resource.aggregate([
    { $match: { isArchived: { $ne: true } } },
    {
      $group: {
        _id: "$type",
        totalUnits: { $sum: "$totalUnits" },
        deployedUnits: { $sum: "$deployedUnits" },
        availableUnits: { $sum: "$availableUnits" }
      }
    },
    {
      $project: {
        _id: 0,
        type: "$_id",
        totalUnits: 1,
        deployedUnits: 1,
        availableUnits: 1,
        utilizationPercentage: {
          $cond: [
            { $eq: ["$totalUnits", 0] },
            0,
            { $multiply: [{ $divide: ["$deployedUnits", "$totalUnits"] }, 100] }
          ]
        }
      }
    }
  ]);
  
  return utilization.map(item => ({
      ...item,
      utilizationPercentage: Number(item.utilizationPercentage.toFixed(2))
  }));
};

export const getMissionPerformance = async () => {
  const [summary] = await Mission.aggregate([
    {
      $group: {
        _id: null,
        totalMissions: { $sum: 1 },
        completedMissions: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
        },
        peopleRescued: { $sum: "$peopleRescued" },
        avgMissionDurationMs: {
          $avg: {
            $cond: [
              { $and: [{ $ne: ["$completedAt", null] }, { $ne: ["$startedAt", null] }] },
              { $subtract: ["$completedAt", "$startedAt"] },
              null
            ]
          }
        }
      }
    }
  ]);

  if (!summary) {
    return {
      completionRate: 0,
      averageMissionDurationHours: 0,
      peopleRescued: 0,
      missionsCompleted: 0
    };
  }

  const completionRate = summary.totalMissions > 0 ? (summary.completedMissions / summary.totalMissions) * 100 : 0;
  const avgMissionDurationHours = summary.avgMissionDurationMs ? (summary.avgMissionDurationMs / 1000 / 60 / 60) : 0;

  return {
    completionRate: Number(completionRate.toFixed(2)),
    averageMissionDurationHours: Number(avgMissionDurationHours.toFixed(2)),
    peopleRescued: summary.peopleRescued,
    missionsCompleted: summary.completedMissions
  };
};

export const getIncidentReportCsv = async (period) => {
  let dateBoundary = new Date();
  
  if (period === '7d') dateBoundary.setDate(dateBoundary.getDate() - 7);
  else if (period === '30d') dateBoundary.setDate(dateBoundary.getDate() - 30);
  else if (period === '90d') dateBoundary.setDate(dateBoundary.getDate() - 90);
  else if (period === '1y') dateBoundary.setFullYear(dateBoundary.getFullYear() - 1);
  else dateBoundary.setFullYear(dateBoundary.getFullYear() - 10); // default to all if 'all' or undefined

  const incidents = await Incident.find({ reportedAt: { $gte: dateBoundary }, isArchived: { $ne: true } })
    .select('title type status severity riskAssessment location reportedAt resolvedAt')
    .sort({ reportedAt: -1 })
    .lean();

  if (!incidents.length) return "No data available";

  const headers = ['Title', 'Type', 'Status', 'Severity', 'Risk Level', 'City', 'State', 'Reported At', 'Resolved At'];
  const rows = incidents.map(inc => [
    `"${(inc.title || '').replace(/"/g, '""')}"`,
    inc.type || 'N/A',
    inc.status || 'N/A',
    inc.severity || 'N/A',
    inc.riskAssessment?.riskLevel || 'N/A',
    `"${(inc.location?.city || '').replace(/"/g, '""')}"`,
    `"${(inc.location?.state || '').replace(/"/g, '""')}"`,
    inc.reportedAt ? new Date(inc.reportedAt).toISOString() : '',
    inc.resolvedAt ? new Date(inc.resolvedAt).toISOString() : ''
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
};
