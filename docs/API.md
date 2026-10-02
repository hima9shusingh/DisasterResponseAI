# API Documentation

The ADR-RAS platform exposes a RESTful API built with Node.js and Express. Most endpoints require a valid JWT token passed in the `Authorization` header (`Bearer <token>`).

## Base URL
`http://localhost:5000/api/v1`

---

## 1. Authentication & Users
**Endpoints**: `/api/v1/auth`

### `POST /auth/register`
- **Purpose**: Register a new user on the platform.
- **Auth**: Public
- **Request Body**: `name`, `email`, `password`, `role` (citizen, volunteer, ngo).
- **Response**: User object and JWT token.

### `POST /auth/login`
- **Purpose**: Authenticate an existing user.
- **Auth**: Public
- **Request Body**: `email`, `password`.
- **Response**: User object and JWT token.

### `GET /auth/me`
- **Purpose**: Restore session and fetch current user profile.
- **Auth**: Required (Any role)

---

## 2. Incidents
**Endpoints**: `/api/v1/incidents`

### `POST /incidents`
- **Purpose**: Report a new disaster incident.
- **Auth**: Required (Citizen, Government, Admin)
- **Request Body**: `disasterType`, `severity`, `description`, `location` (object), `affectedPeople`.
- **Response**: Created Incident object.

### `GET /incidents`
- **Purpose**: Retrieve a paginated list of incidents.
- **Auth**: Required
- **Query Params**: `page`, `limit`, `status`, `severity`, `disasterType`.

### `PATCH /incidents/:id/status`
- **Purpose**: Update the status of an active incident.
- **Auth**: Required (Government, Admin)
- **Request Body**: `status` (e.g., `verified`, `resolved`).

---

## 3. Emergency SOS
**Endpoints**: `/api/v1/sos`

### `POST /sos`
- **Purpose**: Trigger a high-priority SOS emergency.
- **Auth**: Required (Citizen)
- **Request Body**: `location` (latitude, longitude), `details`.
- **Response**: Created SOSRequest with unique `emergencyId`.

### `GET /sos`
- **Purpose**: Retrieve active SOS requests.
- **Auth**: Required (Admin, Government, Responder)

### `PATCH /sos/:id/status`
- **Purpose**: Update response status for an SOS.
- **Auth**: Required (Admin, Responder)
- **Request Body**: `status` (e.g., `RESPONDING`, `RESOLVED`), `assignedTeam`.

---

## 4. Missions & Rescue Teams
**Endpoints**: `/api/v1/missions` | `/api/v1/rescue-teams`

### `POST /missions`
- **Purpose**: Create a new volunteer/NGO mission.
- **Auth**: Required (Government, Admin)
- **Request Body**: `title`, `description`, `location`, `priority`.

### `GET /missions/available`
- **Purpose**: Get missions open for assignment.
- **Auth**: Required (Volunteer, NGO)

### `GET /rescue-teams`
- **Purpose**: List active professional rescue teams.
- **Auth**: Required (Government, Admin)

---

## 5. Alerts & Notifications
**Endpoints**: `/api/v1/alerts` | `/api/v1/notifications`

### `POST /alerts`
- **Purpose**: Broadcast a system-wide emergency alert.
- **Auth**: Required (Government, Admin)
- **Request Body**: `title`, `message`, `severity`, `targetRoles`.

### `GET /notifications`
- **Purpose**: Get notifications for the authenticated user.
- **Auth**: Required (Any role)

---

## 6. System Administration
**Endpoints**: `/api/v1/admin`

### `GET /admin/users`
- **Purpose**: List all users registered on the platform.
- **Auth**: Required (Admin)
- **Query Params**: `role`, `search`.

### `PATCH /admin/users/:id/status`
- **Purpose**: Suspend or activate a user account.
- **Auth**: Required (Admin)
- **Request Body**: `isActive` (boolean).

---

## Health & System Status
**Endpoints**: `/api/v1/health`

### `GET /health`
- **Purpose**: Verify backend and database connectivity.
- **Auth**: Public
- **Response**: Uptime, DB Status, API Status.
