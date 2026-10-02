/**
 * Environment variable validation
 * Verifies presence of required variables without printing their values.
 * Called once at server startup.
 */

const REQUIRED_VARS = [
  'MONGODB_URI',
  'JWT_SECRET',
  'CLIENT_URL',
];

const OPTIONAL_VARS = [
  { name: 'JWT_EXPIRES_IN', default: '7d' },
  { name: 'PORT', default: '5000' },
  { name: 'WEATHER_API_KEY', warn: 'Weather integration will be disabled' },
  { name: 'WEATHER_API_URL', warn: 'Weather integration will be disabled' },
];

export const validateEnv = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  let hasFatal = false;

  console.log('\n[ENV VALIDATION]');

  // Required variables — always checked
  for (const varName of REQUIRED_VARS) {
    if (process.env[varName]) {
      console.log(`  ✓ ${varName} configured`);
    } else {
      console.error(`  ✗ ${varName} is MISSING`);
      if (isProduction) {
        hasFatal = true;
      }
    }
  }

  // Optional variables — warn if missing
  for (const { name, default: def, warn } of OPTIONAL_VARS) {
    if (process.env[name]) {
      console.log(`  ✓ ${name} configured`);
    } else if (def) {
      console.log(`  ~ ${name} not set, using default: ${def}`);
    } else if (warn) {
      console.warn(`  ~ ${name} not set — ${warn}`);
    }
  }

  // NODE_ENV status
  const env = process.env.NODE_ENV || 'development';
  if (env !== 'production') {
    console.warn(`  ~ NODE_ENV=${env} (set to 'production' before deploying)`);
  } else {
    console.log(`  ✓ NODE_ENV=production`);
  }

  console.log('[/ENV VALIDATION]\n');

  if (hasFatal) {
    console.error('FATAL: Missing required environment variables in production. Exiting.');
    process.exit(1);
  }
};
