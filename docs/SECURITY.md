# Security Controls & Hardening

ADR-RAS implements a multi-layered security approach to protect sensitive emergency data and user profiles.

## 1. Authentication & Authorization
- **JWT (JSON Web Tokens)**: All API endpoints (except registration/login) are protected by JWT authentication. Tokens expire logically (e.g., 24 hours).
- **Password Hashing**: User passwords are encrypted using `bcryptjs` with a secure salt round before persistence. Plaintext passwords are never stored.
- **Role-Based Access Control (RBAC)**: The `authorizeRoles` middleware ensures endpoints are strictly scoped. For instance, only `admin` and `government` roles can dispatch resources or modify system-wide incident states.
- **Socket.IO Authentication**: The WebSocket layer requires the JWT token to be passed during the initial handshake. Unauthenticated socket connections are forcefully disconnected to prevent unauthorized event snooping.

## 2. API & Network Security
- **CORS Configuration**: Cross-Origin Resource Sharing is restricted in production to explicitly trusted frontend domains.
- **Rate Limiting**: `express-rate-limit` prevents brute-force attacks on sensitive routes (e.g., `/api/auth/login`) and prevents denial-of-service (DoS) vectors against the main incident reporting endpoint.
- **Security Headers**: `helmet` is utilized to set HTTP headers securely (HSTS, NoSniff, X-Frame-Options).
- **Data Sanitization**: Incoming request bodies are sanitized using `express-mongo-sanitize` to prevent NoSQL injection attacks.

## 3. Data Validation & Integrity
- **Mongoose Schemas**: Strict schema validation ensures only expected data structures are saved to the database. Undefined fields are stripped.
- **Mass Assignment Protection**: Controllers explicitly destructure and pick allowed fields from `req.body` rather than blindly spreading payloads into database update commands.

## 4. File Upload Security
- **Validation**: File uploads (for incident evidence) restrict `mimetype` to images (`jpeg`, `png`, `webp`) or documents (`pdf`).
- **Size Limits**: `multer` is configured to limit file sizes (e.g., 5MB max) to prevent storage exhaustion attacks.

## 5. Secret Management
- **Environment Variables**: Sensitive configurations (MongoDB URIs, JWT Secrets) are strictly isolated in `.env` files.
- **Client Separation**: Secrets are NEVER prefixed with `VITE_` unless they are explicitly meant for public exposure (e.g., Mapbox public tokens).
