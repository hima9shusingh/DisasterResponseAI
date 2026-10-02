import {
  getIncidentAnalytics,
  getResourceAnalytics,
  getMissionAnalytics,
  getReliefCampAnalytics,
  getVolunteerAnalytics,
  getResponseTimeAnalytics,
  getIncidentTrend,
  getRegionalAnalytics,
  getResourceUtilization,
  getMissionPerformance,
  getSosAnalytics,
  getIncidentReportCsv
} from '../services/analyticsService.js';

export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const [
      incidents,
      resources,
      missions,
      reliefCamps,
      volunteers,
      responseTime,
      sosRequests
    ] = await Promise.all([
      getIncidentAnalytics(),
      getResourceAnalytics(),
      getMissionAnalytics(),
      getReliefCampAnalytics(),
      getVolunteerAnalytics(),
      getResponseTimeAnalytics(),
      getSosAnalytics()
    ]);

    res.status(200).json({
      success: true,
      data: {
        incidents,
        resources,
        missions,
        reliefCamps,
        volunteers,
        responseTime,
        sosRequests
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getIncidentTrendStats = async (req, res, next) => {
  try {
    const { period } = req.query; // e.g. 7d, 30d, 90d, 1y
    const trend = await getIncidentTrend(period);
    
    res.status(200).json({
      success: true,
      data: trend
    });
  } catch (error) {
    next(error);
  }
};

export const getRegionalAnalyticsStats = async (req, res, next) => {
  try {
    const regions = await getRegionalAnalytics();
    
    res.status(200).json({
      success: true,
      data: regions
    });
  } catch (error) {
    next(error);
  }
};

export const getResourceUtilizationStats = async (req, res, next) => {
  try {
    const utilization = await getResourceUtilization();
    
    res.status(200).json({
      success: true,
      data: utilization
    });
  } catch (error) {
    next(error);
  }
};

export const getMissionPerformanceStats = async (req, res, next) => {
  try {
    const performance = await getMissionPerformance();
    
    res.status(200).json({
      success: true,
      data: performance
    });
  } catch (error) {
    next(error);
  }
};

export const downloadIncidentReportCsv = async (req, res, next) => {
  try {
    const { period } = req.query;
    const csvData = await getIncidentReportCsv(period);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=incident_report_${new Date().getTime()}.csv`);
    res.status(200).send(csvData);
  } catch (error) {
    next(error);
  }
};
