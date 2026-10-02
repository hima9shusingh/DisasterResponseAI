/**
 * CI Startup Verification Script
 * 
 * Tests that the backend starts correctly with minimal env vars (no real DB needed).
 * Uses a mock MONGODB_URI that will fail DB connection but lets us verify:
 * - All imports resolve
 * - No syntax errors
 * - App module loads correctly
 * - Environment validation runs
 * 
 * This is NOT a test suite — it's a smoke test for CI import correctness.
 */

import 'dotenv/config';

// Override with CI-safe values
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'ci-test-secret-not-for-production';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/adrras_ci_test';
process.env.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

console.log('[CI-CHECK] Loading backend application modules...');

try {
  // Test: All modules import without error
  const { default: app } = await import('./src/app.js');
  console.log('[CI-CHECK] ✓ app.js loaded successfully');
  
  // Test: App is an Express instance
  if (typeof app !== 'function') {
    throw new Error('app.js did not export an Express application');
  }
  console.log('[CI-CHECK] ✓ Express app is a valid function');

  // Test: Routes module loads
  const { default: routes } = await import('./src/routes/index.js');
  console.log('[CI-CHECK] ✓ routes/index.js loaded successfully');

  // Test: All middleware loads
  const { protect } = await import('./src/middleware/authMiddleware.js');
  const { authorizeRoles } = await import('./src/middleware/roleMiddleware.js');
  console.log('[CI-CHECK] ✓ middleware loaded successfully');

  // Test: All models load
  await import('./src/models/User.js');
  await import('./src/models/Incident.js');
  await import('./src/models/Notification.js');
  await import('./src/models/SOSRequest.js');
  await import('./src/models/Mission.js');
  await import('./src/models/RescueTeam.js');
  await import('./src/models/Resource.js');
  await import('./src/models/EmergencyAlert.js');
  console.log('[CI-CHECK] ✓ All Mongoose models loaded successfully');

  // Test: Services load
  await import('./src/services/weatherService.js');
  await import('./src/services/notificationService.js');
  await import('./src/services/aiAssessmentService.js');
  console.log('[CI-CHECK] ✓ All services loaded successfully');

  console.log('\n[CI-CHECK] ✅ All syntax/import checks passed. Backend is ready for deployment.\n');
  process.exit(0);
} catch (err) {
  console.error('\n[CI-CHECK] ✗ Backend import/syntax check FAILED:');
  console.error(err.message);
  console.error(err.stack);
  process.exit(1);
}
