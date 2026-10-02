# System Architecture & Workflows

## 1. High-Level Architecture
ADR-RAS follows a decoupled client-server architecture designed for high availability and real-time responsiveness during disaster scenarios.

### Frontend Layer
- **React.js (Vite)**: Single Page Application handling rendering and UI logic.
- **Context API + React Router**: Manages application state, JWT tokens, and secure routing (Role-Based Layouts).
- **Axios**: HTTP client configured with request interceptors to attach `Bearer` tokens dynamically.
- **Leaflet**: Handles geospatial rendering of disasters, relief camps, and emergency markers.

### Backend Layer
- **Node.js + Express**: Core runtime and routing layer.
- **Controllers & Services Pattern**: Controllers handle HTTP requests/responses, delegating business logic (e.g., matching a rescue team to a mission) to isolated Service classes.
- **Socket.IO**: Upgrades standard HTTP connections to WebSockets, emitting real-time changes to connected, authenticated clients.
- **MongoDB + Mongoose**: Document-based NoSQL database, highly suitable for variable geospatial data and flexible incident schemas.

---

## 2. Real-Time Architecture (Socket.IO)

The Socket.IO server integrates tightly with the Express application. 

### Connection & Authentication
- Clients connect via `useSocket` custom hook.
- Socket initialization includes passing the user's JWT token.
- The backend middleware verifies the token before allowing the connection to join the primary communication pool.

### Event Flow
- `incident:new` / `incident:updated` -> Emitted when an incident is created or its status changes.
- `alert:new` -> Emitted by the Government when a severe weather or disaster alert is broadcasted.
- `sos:created` / `sos:updated` -> Emitted globally when a citizen triggers a rapid-response emergency.
- `notification:new` -> Targeted alerts sent to specific user roles or individual IDs.

---

## 3. Core Workflows

### A. User Registration/Login
1. User submits form -> POST `/api/auth/register`
2. Backend hashes password via bcrypt -> Saves to MongoDB.
3. User logs in -> POST `/api/auth/login`
4. Backend verifies credentials -> Returns JWT & Profile.
5. Frontend stores JWT in localStorage -> Initiates secure session.

### B. Disaster Incident Reporting
1. Citizen fills out Incident Form -> POST `/api/v1/incidents`
2. Backend assigns `PENDING_VERIFICATION` status -> Saves to DB.
3. Socket.IO emits `incident:new`.
4. Government Command Center receives notification -> Reviews data.

### C. Risk Assessment (AI/Scoring)
1. Incident is submitted with fields (Disaster Type, Affected People, Infrastructure Damage).
2. Backend service calculates a **Risk Score** based on predefined heuristics (weights assigned to casualties, infrastructure, and type).
3. If Score > Threshold -> Assessed as `CRITICAL`.
4. This score dictates the visual urgency (red flags) on Admin/Government dashboards.
*(Note: The AI risk assessment is a heuristic scoring engine, not a trained Deep Learning model.)*

### D. Emergency SOS (Rapid Response)
1. Citizen taps "SOS" -> Captures geolocation (if allowed) -> POST `/api/v1/sos`.
2. Backend creates high-priority `SOSRequest` -> Emits `sos:created`.
3. Admin Console intercepts -> Dispatches nearest available `RescueTeam`.
4. Team marks status as `RESPONDING` -> Updates Citizen context in real-time.

### E. Mission Lifecycle
1. Government creates a task for Volunteers -> POST `/api/v1/missions`.
2. Volunteer views available missions -> Accepts mission.
3. Mission status updates to `IN_PROGRESS`.
4. Volunteer completes tasks -> Marks as `COMPLETED`.

---

## 4. Role & Permission Matrix

| Feature / Resource | Citizen | Volunteer | NGO | Government | Admin |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **View Active Incidents** | Own Only | Yes | Yes | Yes | Yes |
| **Report Incident** | Yes | No | No | Yes | Yes |
| **Trigger SOS** | Yes | No | No | No | No |
| **Manage SOS Requests** | No | No | No | No | Yes |
| **Accept Missions** | No | Yes | No | No | No |
| **Manage Camps/Resources** | No | No | Yes | View Only | View Only |
| **Dispatch Rescue Teams** | No | No | No | Yes | Yes |
| **Generate Alerts** | No | No | No | Yes | Yes |
| **View Analytics** | No | No | No | Yes | Yes |
| **Manage Users** | No | No | No | No | Yes |

---

## 5. Database Schema (Mongoose Models)

### `User`
- **Purpose**: Centralized authentication and profile data.
- **Key Fields**: `name`, `email`, `password` (hashed), `role` (Citizen, Admin, etc.), `isActive`.
- **Indexes**: `email` (unique).

### `Incident`
- **Purpose**: Tracks reported disaster events.
- **Key Fields**: `incidentId`, `disasterType`, `severity`, `status`, `location` (GeoJSON / Address), `reportedBy`.
- **Lifecycle**: `pending_verification` -> `verified` -> `resources_assigned` -> `rescue_in_progress` -> `resolved`.

### `SOSRequest`
- **Purpose**: Urgent, one-click emergency triggers.
- **Key Fields**: `emergencyId`, `userId`, `location` (lat/lng), `status`, `assignedTeam`.
- **Lifecycle**: `PENDING` -> `ACKNOWLEDGED` -> `ASSIGNED` -> `RESPONDING` -> `ON_SCENE` -> `RESOLVED`.

### `RescueTeam`
- **Purpose**: Tracking deployment of professional responders.
- **Key Fields**: `name`, `type` (Medical, Fire, etc.), `status` (Available, Deployed), `location`, `assignedIncident`.

### `Mission`
- **Purpose**: Volunteer and NGO task coordination.
- **Key Fields**: `title`, `description`, `incident`, `assignedTo`, `status`, `priority`.

### `Resource`
- **Purpose**: Inventory and supply tracking.
- **Key Fields**: `name`, `type`, `quantity`, `location`, `status`.

### `EmergencyAlert`
- **Purpose**: Broadcast messages to specific regions or roles.
- **Key Fields**: `title`, `message`, `severity`, `targetRoles`, `expiresAt`.

### `ReliefCamp`
- **Purpose**: Safe zones managed by NGOs.
- **Key Fields**: `name`, `location`, `capacity`, `currentOccupancy`, `managerId`.

---

## 6. Known Limitations / Future Improvements
- **File Storage**: Currently, the system uses the local filesystem (`/uploads`) for storing incident evidence. In a true production environment, this should be abstracted to AWS S3 or Google Cloud Storage.
- **AI Intelligence**: The current Risk Assessment engine uses static algorithmic scoring. Future updates should integrate external Python microservices running actual ML inference on structural damage imagery.
- **Routing/ETA**: While coordinates are stored, real-time routing engines (like Mapbox Directions API) are not fully integrated to provide exact vehicle ETAs.
