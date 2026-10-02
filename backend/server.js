import 'dotenv/config';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import { validateEnv } from './src/config/validateEnv.js';

import http from 'http';
import { initSocket } from './src/services/socketService.js';

const PORT = process.env.PORT || 5000;

// Validate environment variables first
validateEnv();

// Create HTTP server manually
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Connect to MongoDB
connectDB().then(() => {
  // Start server after DB connection
  server.listen(PORT, () => {
    console.log(`ADRRAS Backend`);
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to start backend due to database connection issue:", error.message);
  process.exit(1);
});

// Graceful Shutdown handling
const gracefulShutdown = () => {
  console.log("Shutting down gracefully...");
  server.close(() => {
    console.log("HTTP server closed.");
    import('mongoose').then((mongoose) => {
      mongoose.default.connection.close(false).then(() => {
        console.log("MongoDB connection closed.");
        process.exit(0);
      });
    });
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // For nodemon restarts
