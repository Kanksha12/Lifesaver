# LifeSaver - Emergency SOS & Contact Management

## Setup Instructions

### 1. Backend Setup
```
cd server
npm install
```
Edit `.env` with your credentials:
- MongoDB URI
- Twilio credentials (for SMS)
- Gmail credentials (for email)

Run server:
```
npm run dev
```

### 2. Frontend Setup
```
cd client
npm install
npm start
```

### 3. Services You Need
- **MongoDB** — local or MongoDB Atlas (free)
- **Twilio** — for SMS alerts (free trial at twilio.com)
- **Gmail App Password** — for email alerts

## Features
- User registration and login
- Add/delete emergency contacts
- SOS button — sends SMS + email with Google Maps location
- Alert history with map links

## Project Structure
```
lifesaver/
  server/
    index.js         -- Express server
    models/          -- MongoDB schemas
    routes/          -- API routes
    middleware/      -- JWT auth
    .env             -- Your credentials
  client/
    src/
      pages/         -- Login, Register, Dashboard, Contacts, History
      components/    -- Navbar
      context/       -- Auth context
```
