# ADR-RAS - Adaptive Disaster Response & Resource Allocation System

![ADR-RAS Banner](https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=2000&auto=format&fit=crop)

**ADR-RAS** is a comprehensive, production-ready full-stack platform designed to coordinate and manage large-scale emergency responses. It unites Citizens, Volunteers, NGOs, Government authorities, and System Administrators into a single, real-time response network, backed by a robust API and a dynamic React frontend.

---

## 🎯 Problem Statement
During large-scale disasters, response efforts are historically fragmented. Citizens struggle to broadcast reliable SOS signals, NGOs distribute resources without coordination, and Government command centers lack real-time visibility into ground conditions and active rescue missions.

## 💡 Solution
ADR-RAS solves this fragmentation by providing a unified, role-based platform that aggregates data from all actors into a single source of truth, enabling real-time coordination, dynamic resource allocation, and instant emergency alerts.

### Key Features
- **Centralized Incident Management**: A real-time Government & Admin Command Center for triaging and overseeing emergencies globally.
- **Smart Resource Allocation**: Track and dispatch ambulances, rescue teams, and relief supplies across multiple incidents.
- **AI-Assisted Risk Assessment**: Automated severity calculation based on incident parameters, population density, and weather conditions.
- **Role-Based Portals**: Dedicated workspaces for Citizens, Volunteers, NGOs, Government, and Admin users.
- **Interactive Live Map**: A global situational awareness map integrating active incidents, relief camps, and GPS coordinates.
- **One-Click Emergency SOS**: Immediate geo-tagged SOS broadcasting that bypasses standard workflows for rapid intervention.
- **Real-Time Synchronization**: WebSockets (Socket.IO) power instant incident updates, live alerts, and system-wide notifications.
- **Comprehensive Analytics**: Data-driven insights on disaster trends, response times, and resource utilization.

---

## 👥 User Roles & Permissions

The platform architecture relies heavily on Secure Role-Based Access Control (RBAC):

1. **Citizen**: Can report incidents, view nearby help, access emergency guides, and trigger Emergency SOS.
2. **Volunteer**: Can view available rescue missions, accept tasks, and update ground progress.
3. **NGO**: Manages relief camps, bulk inventory, and fulfills supply requests from the government.
4. **Government**: The Command Center. Triages all incidents, dispatches resources, monitors weather intelligence, and creates targeted alerts.
5. **System Admin**: Manages platform users, oversees global incident lifecycles, suspends malicious actors, and views system analytics.

---

## 🛠️ Technology Stack

**Frontend**
- **Framework**: React 18 + Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Icons**: Lucide React
- **Maps**: React Leaflet & OpenStreetMap
- **Charts**: Recharts
- **State Management**: React Context API

**Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose ODM
- **Real-Time Engine**: Socket.IO
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs
- **Validation**: Mongoose schemas and custom validators

---

## 🏗️ System Architecture

ADR-RAS uses a decoupled client-server architecture:

- **Frontend Client**: A Single Page Application (SPA) communicating asynchronously via Axios and WebSocket connections.
- **RESTful API**: A Node.js/Express backend exposing secure, authenticated endpoints mapped to specific Mongoose controllers and services.
- **Event-Driven PubSub**: Socket.IO facilitates real-time bidirectional event streaming for new incidents, SOS updates, and platform notifications.

---

## 🚀 Installation & Deployment

### Prerequisites
- Node.js (v18+)
- MongoDB instance (local or Atlas)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/adrras.git
   cd adrras
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create a .env file (see .env.example)
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ..
   npm install
   npm run dev
   ```

4. **Production Build**
   ```bash
   # In the root directory (frontend build)
   npm run build
   ```

---

## 📚 Documentation Structure

For detailed technical insights into the project, refer to the documentation package in the `/docs` folder:

- **[Architecture & Database](./docs/ARCHITECTURE.md)**: Detailed breakdown of the system layers, Mongoose schemas, and real-time Socket.IO events.
- **[API Reference](./docs/API.md)**: Comprehensive listing of RESTful endpoints, authentication requirements, and payloads.
- **[Security Controls](./docs/SECURITY.md)**: Implementation details of JWT auth, input validation, role-based checks, and general platform hardening.
- **[Deployment Guide](./DEPLOYMENT.md)**: Step-by-step instructions for preparing ADR-RAS for production environments.
- **[Testing & Verification](./docs/TESTING.md)**: Overview of module audits, regression testing, and journey validations.

---

## 👨‍💻 Author
Developed as a comprehensive showcase of modern full-stack development, complex state management, enterprise-grade UI/UX design, and secure Node.js backend integration.

*For inquiries or collaboration, please open an issue or reach out directly.*
