# Testing & Verification Documentation

During the development and CI/CD preparation of ADR-RAS, multiple layers of testing were performed to ensure system stability, security, and correct business logic execution.

## 1. Automated Integration Scripts
The backend repository contains a suite of Node.js scripts (`test*.cjs`) designed to verify entire end-to-end user workflows against a running instance.

### `testAuth.cjs` / `testAuth2.cjs` / `test-login.cjs`
- **Scope**: Verifies User Registration, Login, and JWT generation.
- **Coverage**: Validates password hashing, unique email enforcement, and secure token issuance.

### `testIncidentSubmission.cjs`
- **Scope**: Verifies Citizen Incident Reporting workflow.
- **Coverage**: Ensures geo-spatial data (`latitude`, `longitude`) is parsed correctly and that the incident status defaults to `pending_verification`.

### `testAdminWorkflow.cjs`
- **Scope**: Admin intervention and state management.
- **Coverage**: Verifies an Admin can retrieve global users, update user roles/status, and intercept active incidents.

### `testCompleteFlow.cjs`
- **Scope**: End-to-end incident lifecycle.
- **Coverage**: Simulates a Citizen creating an incident, Government verifying the incident, and Resources being assigned.

### Phase 6-10 Unit Tests
- `testStep6.cjs` to `testStep10.cjs` validate discrete newly added modules:
  - **Socket.IO Real-time Events**: Confirms clients successfully connect and receive live alerts.
  - **AI Risk Assessment**: Verifies heuristic engine computes severity correctly (Low, Medium, High, Critical) based on damage inputs.
  - **Live Map Coordinates**: Verifies geospatial payload extraction.
  - **Emergency SOS Rapid Response**: Verifies high-priority SOS models are saved independently of standard incident workflows.

## 2. Frontend UX Testing
- **Responsiveness**: Form layouts, Dashboards, and Data Tables were rigorously tested on mobile dimensions. The `Table-to-Card` responsive pattern was implemented for deep-data views (e.g., Incident Management, User Tracking).
- **Component States**: All network-reliant components display accurate `Loading...` spinners and logical `Empty` states (e.g., "No incidents found matching criteria").

## 3. Production Build Validation
- **Vite Compilation**: The command `npm run build` is run continuously to ensure zero static-analysis or module-bundling errors exist before deployment.
- **Code Splitting**: Dynamic imports (e.g., `React.lazy`) correctly separate dashboard modules, ensuring fast initial citizen load times.
