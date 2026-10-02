import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import CitizenLayout from '../layouts/CitizenLayout';
import VolunteerLayout from '../layouts/VolunteerLayout';
import NGOLayout from '../layouts/NGOLayout';
import GovernmentLayout from '../layouts/GovernmentLayout';
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/Admin/Dashboard';
import AdminUsers from '../pages/Admin/Users';
import AdminUserDetails from '../pages/Admin/UserDetails';
import AdminRoles from '../pages/Admin/Roles';
import AdminIncidents from '../pages/Admin/Incidents';
import AdminNgos from '../pages/Admin/Ngos';
import AdminVolunteers from '../pages/Admin/Volunteers';
import AdminLogs from '../pages/Admin/Logs';
import AdminAnalytics from '../pages/Admin/Analytics';
import AdminNotifications from '../pages/Admin/Notifications';
import AdminProfile from '../pages/Admin/Profile';
import AdminSettings from '../pages/Admin/Settings';
import MapLayout from '../layouts/MapLayout';
import ProtectedRoute from '../components/navigation/ProtectedRoute';
import GlobalErrorBoundary from '../components/navigation/GlobalErrorBoundary';

// Pages
import Home from '../pages/Public/Home';
import ReportEmergency from '../pages/Public/ReportEmergency';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import VolunteerDashboard from '../pages/Volunteer/Dashboard';
import VolunteerMissions from '../pages/Volunteer/Missions';
import VolunteerMissionDetails from '../pages/Volunteer/MissionDetails';
import VolunteerHistory from '../pages/Volunteer/History';
import VolunteerNotifications from '../pages/Volunteer/Notifications';
import VolunteerProfile from '../pages/Volunteer/Profile';
import VolunteerSettings from '../pages/Volunteer/Settings';
import NGODashboard from '../pages/NGO/Dashboard';
import NGOInventory from '../pages/NGO/Inventory';
import NGORequests from '../pages/NGO/Requests';
import NGODonations from '../pages/NGO/Donations';
import NGOVolunteers from '../pages/NGO/Volunteers';
import NGOCamps from '../pages/NGO/Camps';
import NGODistribution from '../pages/NGO/Distribution';
import NGOAnalytics from '../pages/NGO/Analytics';
import NGONotifications from '../pages/NGO/Notifications';
import NGOProfile from '../pages/NGO/Profile';
import NGOSettings from '../pages/NGO/Settings';
import GovernmentDashboard from '../pages/Government/Dashboard';
import IncidentManagement from '../pages/Government/IncidentManagement';
import IncidentDetails from '../pages/Government/IncidentDetails';
import ResourceManagement from '../pages/Government/ResourceManagement';
import CampManagement from '../pages/Government/CampManagement';
import CampDetails from '../pages/Government/CampDetails';
import WeatherIntelligence from '../pages/Government/WeatherIntelligence';
import GovernmentAnalytics from '../pages/Government/Analytics';
import GovernmentReports from '../pages/Government/Reports';
import AlertCenter from '../pages/Government/AlertCenter';
import AlertDetails from '../pages/Government/AlertDetails';
import AIAssessment from '../pages/Government/AIAssessment';
import AIHistory from '../pages/Government/AIHistory';
import AIDetails from '../pages/Government/AIDetails';
import AdminSOS from '../pages/Admin/AdminSOS';

// Shared Pages
import NotificationCenter from '../pages/Shared/NotificationCenter';
import ProfilePage from '../pages/Shared/ProfilePage';
import SettingsPage from '../pages/Shared/SettingsPage';
import NotFound from '../pages/Shared/NotFound';

// Citizen Pages
import CitizenDashboard from '../pages/Citizen/Dashboard';
import CitizenReports from '../pages/Citizen/MyReports';
import CitizenReportDetails from '../pages/Citizen/ReportDetails';
import CitizenNotifications from '../pages/Citizen/Notifications';
import CitizenProfile from '../pages/Citizen/Profile';
import CitizenSOS from '../pages/Citizen/CitizenSOS';
import EmergencyGuide from '../pages/Citizen/EmergencyGuide';
import HelpFinder from '../pages/Citizen/HelpFinder';

// Map Pages
import DisasterMapPage from '../pages/Map/DisasterMapPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <GlobalErrorBoundary />,
    children: [
      { index: true, element: <Home /> },
      { path: 'report', element: <ReportEmergency /> },
    ],
  },
  {
    path: '/map',
    element: <MapLayout />,
    errorElement: <GlobalErrorBoundary />,
    children: [
      { index: true, element: <DisasterMapPage /> },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    errorElement: <GlobalErrorBoundary />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
    ],
  },
  {
    path: '/citizen',
    element: <ProtectedRoute allowedRoles={['citizen']}><CitizenLayout /></ProtectedRoute>,
    errorElement: <GlobalErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="/citizen/dashboard" replace /> },
      { path: 'dashboard', element: <CitizenDashboard /> },
      { path: 'reports', element: <CitizenReports /> },
      { path: 'reports/:reportId', element: <CitizenReportDetails /> },
      { path: 'notifications', element: <NotificationCenter /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'sos', element: <CitizenSOS /> },
      { path: 'emergency-guide', element: <EmergencyGuide /> },
      { path: 'help', element: <HelpFinder /> },
    ],
  },
  {
    path: '/volunteer',
    element: <ProtectedRoute allowedRoles={['volunteer']}><VolunteerLayout /></ProtectedRoute>,
    errorElement: <GlobalErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="/volunteer/dashboard" replace /> },
      { path: 'dashboard', element: <VolunteerDashboard /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'notifications', element: <NotificationCenter /> },
      { path: 'missions', element: <VolunteerMissions /> },
      { path: 'missions/:missionId', element: <VolunteerMissionDetails /> },
      { path: 'history', element: <VolunteerHistory /> },
    ],
  },
  {
    path: '/ngo',
    element: <ProtectedRoute allowedRoles={['ngo']}><NGOLayout /></ProtectedRoute>,
    errorElement: <GlobalErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="/ngo/dashboard" replace /> },
      { path: 'dashboard', element: <NGODashboard /> },
      { path: 'inventory', element: <NGOInventory /> },
      { path: 'requests', element: <NGORequests /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'notifications', element: <NotificationCenter /> },
      { path: 'donations', element: <NGODonations /> },
      { path: 'volunteers', element: <NGOVolunteers /> },
      { path: 'camps', element: <NGOCamps /> },
      { path: 'distribution', element: <NGODistribution /> },
      { path: 'analytics', element: <NGOAnalytics /> },
    ],
  },
  {
    path: '/government',
    element: <ProtectedRoute allowedRoles={['government']}><GovernmentLayout /></ProtectedRoute>,
    errorElement: <GlobalErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="/government/dashboard" replace /> },
      { path: 'dashboard', element: <GovernmentDashboard /> },
      { path: 'incidents', element: <IncidentManagement /> },
      { path: 'incidents/:incidentId', element: <IncidentDetails /> },
      { path: 'resources', element: <ResourceManagement /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'notifications', element: <NotificationCenter /> },
      { path: 'relief-camps', element: <CampManagement /> },
      { path: 'relief-camps/:campId', element: <CampDetails /> },
      { path: 'weather', element: <WeatherIntelligence /> },
      { path: 'analytics', element: <GovernmentAnalytics /> },
      { path: 'reports', element: <GovernmentReports /> },
      { path: 'alerts', element: <AlertCenter /> },
      { path: 'alerts/:alertId', element: <AlertDetails /> },
      { path: 'ai-assessment', element: <AIAssessment /> },
      { path: 'ai-assessment/history', element: <AIHistory /> },
      { path: 'ai-assessment/:assessmentId', element: <AIDetails /> },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>,
    errorElement: <GlobalErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'users/:userId', element: <AdminUserDetails /> },
      { path: 'roles', element: <AdminRoles /> },
      { path: 'incidents', element: <AdminIncidents /> },
      { path: 'incidents/:incidentId', element: <IncidentDetails /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'notifications', element: <NotificationCenter /> },
      { path: 'ngos', element: <AdminNgos /> },
      { path: 'volunteers', element: <AdminVolunteers /> },
      { path: 'logs', element: <AdminLogs /> },
      { path: 'analytics', element: <AdminAnalytics /> },
      { path: 'sos', element: <AdminSOS /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />
  }
]);
