# Backend Documentation

## Overview

This document outlines the backend architecture for the Hospital Management System. Currently, the frontend operates with mock data, but this guide provides the complete backend specification for future implementation.

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Architecture](#architecture)
3. [API Endpoints](#api-endpoints)
4. [Authentication](#authentication)
5. [Data Models](#data-models)
6. [Business Logic](#business-logic)
7. [SMS Integration](#sms-integration)
8. [Error Handling](#error-handling)
9. [Security](#security)
10. [Deployment](#deployment)

---

## Technology Stack

### Recommended Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication |
| Bcrypt | Password hashing |
| Twilio/Africa's Talking | SMS service |
| Socket.io | Real-time updates |
| Joi | Validation |
| Winston | Logging |

### Alternative Stack Options

**Option 1: Python**
- Flask/Django
- PostgreSQL
- SQLAlchemy
- JWT

**Option 2: PHP**
- Laravel
- MySQL
- Eloquent ORM

---

## Architecture

### System Architecture

```
┌─────────────┐
│   Frontend  │
│   (React)   │
└──────┬──────┘
       │ HTTP/WebSocket
       ▼
┌─────────────┐
│  API Layer  │
│  (Express)  │
└──────┬──────┘
       │
       ├──────────┐
       │          │
       ▼          ▼
┌──────────┐  ┌──────────┐
│ Database │  │   SMS    │
│ (MongoDB)│  │ Service  │
└──────────┘  └──────────┘
```

### Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── jwt.js
│   │   └── sms.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── patientController.js
│   │   ├── doctorController.js
│   │   ├── appointmentController.js
│   │   ├── queueController.js
│   │   ├── smsController.js
│   │   └── analyticsController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Patient.js
│   │   ├── Doctor.js
│   │   ├── Appointment.js
│   │   ├── Queue.js
│   │   └── SMSLog.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── patients.js
│   │   ├── doctors.js
│   │   ├── appointments.js
│   │   ├── queue.js
│   │   ├── sms.js
│   │   └── analytics.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── services/
│   │   ├── smsService.js
│   │   ├── queueService.js
│   │   └── notificationService.js
│   ├── utils/
│   │   ├── logger.js
│   │   ├── tokenGenerator.js
│   │   └── helpers.js
│   └── app.js
├── tests/
├── .env
├── .gitignore
├── package.json
└── server.js
```

---

## API Endpoints

### Base URL
```
Development: http://localhost:5000/api
Production: https://api.hospital.com/api
```

### Authentication Endpoints

**POST /api/auth/register**
- Register new user
- Body: `{ name, email, password, role }`
- Returns: `{ token, user }`

**POST /api/auth/login**
- User login
- Body: `{ email, password }`
- Returns: `{ token, user }`

**GET /api/auth/me**
- Get current user
- Headers: `Authorization: Bearer <token>`
- Returns: `{ user }`

**POST /api/auth/logout**
- Logout user
- Headers: `Authorization: Bearer <token>`
- Returns: `{ message }`

---

### Patient Endpoints

**GET /api/patients**
- Get all patients
- Query: `?search=<term>&status=<status>&page=<num>&limit=<num>`
- Returns: `{ patients, total, page, pages }`

**GET /api/patients/:id**
- Get patient by ID
- Returns: `{ patient }`

**POST /api/patients**
- Create new patient
- Body: `{ name, phone, ghanaCard, department, doctor, reason, priority }`
- Returns: `{ patient }`

**PUT /api/patients/:id**
- Update patient
- Body: `{ ...patientData }`
- Returns: `{ patient }`

**DELETE /api/patients/:id**
- Delete patient
- Returns: `{ message }`

---

### Doctor Endpoints

**GET /api/doctors**
- Get all doctors
- Query: `?status=<status>&specialty=<specialty>`
- Returns: `{ doctors }`

**GET /api/doctors/:id**
- Get doctor by ID
- Returns: `{ doctor }`

**POST /api/doctors**
- Create new doctor
- Body: `{ name, specialty, phone, email, status }`
- Returns: `{ doctor }`

**PUT /api/doctors/:id**
- Update doctor
- Body: `{ ...doctorData }`
- Returns: `{ doctor }`

**PUT /api/doctors/:id/status**
- Update doctor status
- Body: `{ status }`
- Returns: `{ doctor }`

**DELETE /api/doctors/:id**
- Delete doctor
- Returns: `{ message }`

---

### Queue Endpoints

**GET /api/queue**
- Get current queue
- Query: `?status=<status>&department=<dept>`
- Returns: `{ queue }`

**POST /api/queue/call/:id**
- Call patient (move to in-progress)
- Returns: `{ patient }`

**POST /api/queue/complete/:id**
- Complete patient consultation
- Returns: `{ patient }`

**POST /api/queue/next**
- Call next patient in queue
- Returns: `{ patient }`

**PUT /api/queue/pause**
- Pause queue
- Returns: `{ message, isPaused }`

**PUT /api/queue/resume**
- Resume queue
- Returns: `{ message, isPaused }`

---

### Appointment Endpoints

**GET /api/appointments**
- Get appointments
- Query: `?date=<YYYY-MM-DD>&doctor=<name>&status=<status>`
- Returns: `{ appointments }`

**GET /api/appointments/:id**
- Get appointment by ID
- Returns: `{ appointment }`

**POST /api/appointments**
- Create appointment
- Body: `{ patientName, doctor, date, time, type, status }`
- Returns: `{ appointment }`

**PUT /api/appointments/:id**
- Update appointment
- Body: `{ ...appointmentData }`
- Returns: `{ appointment }`

**DELETE /api/appointments/:id**
- Cancel appointment
- Returns: `{ message }`

---

### SMS Endpoints

**POST /api/sms/send**
- Send SMS
- Body: `{ recipient, message, type }`
- Returns: `{ success, messageId }`

**POST /api/sms/bulk**
- Send bulk SMS
- Body: `{ recipients[], message }`
- Returns: `{ success, sent, failed }`

**GET /api/sms/logs**
- Get SMS logs
- Query: `?page=<num>&limit=<num>`
- Returns: `{ logs, total }`

**GET /api/sms/balance**
- Get SMS balance
- Returns: `{ balance, currency }`

---

### Analytics Endpoints

**GET /api/analytics/dashboard**
- Get dashboard stats
- Query: `?startDate=<date>&endDate=<date>`
- Returns: `{ stats }`

**GET /api/analytics/patients**
- Get patient analytics
- Returns: `{ trends, distribution }`

**GET /api/analytics/doctors**
- Get doctor performance
- Returns: `{ performance }`

**GET /api/analytics/wait-times**
- Get wait time analysis
- Returns: `{ waitTimes }`

**GET /api/analytics/reports**
- Get detailed reports
- Query: `?type=<daily|weekly|monthly>`
- Returns: `{ reports }`

---

## Authentication

### JWT Implementation

**Token Structure:**
```javascript
{
  userId: string,
  email: string,
  role: string,
  iat: number,
  exp: number
}
```

**Token Expiry:**
- Access Token: 24 hours
- Refresh Token: 7 days

**Middleware:**
```javascript
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      throw new Error();
    }
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};
```

### Role-Based Access Control

**Roles:**
- `admin` - Full access
- `doctor` - Patient management, queue, appointments
- `receptionist` - Patient registration, queue management
- `viewer` - Read-only access

**Permission Matrix:**
```
Action              | Admin | Doctor | Receptionist | Viewer
--------------------|-------|--------|--------------|-------
Add Patient         |   ✓   |   ✓    |      ✓       |   ✗
Call Patient        |   ✓   |   ✓    |      ✓       |   ✗
Complete Patient    |   ✓   |   ✓    |      ✗       |   ✗
Add Doctor          |   ✓   |   ✗    |      ✗       |   ✗
Send SMS            |   ✓   |   ✓    |      ✓       |   ✗
View Analytics      |   ✓   |   ✓    |      ✓       |   ✓
System Settings     |   ✓   |   ✗    |      ✗       |   ✗
```

---

## Data Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['admin', 'doctor', 'receptionist', 'viewer']),
  phone: String,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Patient Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  phone: String (required),
  ghanaCard: String (required, unique),
  token: String (required, unique),
  department: String (required),
  doctor: String (required),
  reason: String,
  priority: String (enum: ['normal', 'high']),
  status: String (enum: ['waiting', 'in-progress', 'completed', 'cancelled']),
  arrivalTime: Date,
  calledTime: Date,
  completedTime: Date,
  waitTime: Number (minutes),
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### Doctor Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  specialty: String (required),
  phone: String (required),
  email: String (required, unique),
  status: String (enum: ['available', 'busy', 'on-break', 'inactive']),
  currentPatient: String,
  patientsSeen: Number (default: 0),
  schedule: [{
    day: String,
    startTime: String,
    endTime: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment Model
```javascript
{
  _id: ObjectId,
  patientName: String (required),
  patientId: ObjectId (ref: 'Patient'),
  doctor: String (required),
  doctorId: ObjectId (ref: 'Doctor'),
  date: Date (required),
  time: String (required),
  type: String (enum: ['Check-up', 'Follow-up', 'Consultation', 'Emergency', 'Surgery']),
  status: String (enum: ['pending', 'confirmed', 'completed', 'cancelled']),
  notes: String,
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### Queue Model
```javascript
{
  _id: ObjectId,
  date: Date (required),
  isPaused: Boolean (default: false),
  patients: [ObjectId] (ref: 'Patient'),
  stats: {
    total: Number,
    waiting: Number,
    inProgress: Number,
    completed: Number,
    avgWaitTime: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### SMSLog Model
```javascript
{
  _id: ObjectId,
  recipient: String (required),
  message: String (required),
  type: String (enum: ['registration', 'calling', 'waiting', 'completed', 'custom']),
  status: String (enum: ['sent', 'delivered', 'failed', 'pending']),
  messageId: String,
  cost: Number,
  sentBy: ObjectId (ref: 'User'),
  sentAt: Date,
  deliveredAt: Date,
  createdAt: Date
}
```

---

## Business Logic

### Queue Management

**Token Generation:**
```javascript
function generateToken(department) {
  const prefix = department.substring(0, 2).toUpperCase();
  const lastToken = await Patient.findOne({ department })
    .sort({ createdAt: -1 });
  
  const lastNumber = lastToken ? 
    parseInt(lastToken.token.split('-')[1]) : 100;
  
  return `${prefix}-${lastNumber + 1}`;
}
```

**Priority Handling:**
```javascript
function sortQueue(patients) {
  return patients.sort((a, b) => {
    // High priority first
    if (a.priority === 'high' && b.priority === 'normal') return -1;
    if (a.priority === 'normal' && b.priority === 'high') return 1;
    
    // Then by arrival time
    return new Date(a.arrivalTime) - new Date(b.arrivalTime);
  });
}
```

**Wait Time Calculation:**
```javascript
function calculateWaitTime(patient) {
  const arrival = new Date(patient.arrivalTime);
  const called = new Date(patient.calledTime || Date.now());
  return Math.floor((called - arrival) / 60000); // minutes
}
```

### SMS Automation

**Auto-send on Registration:**
```javascript
async function onPatientRegistered(patient) {
  const message = `Registration successful! Your token is ${patient.token}. ` +
    `You are ${patient.position} in line for ${patient.department}.`;
  
  await sendSMS(patient.phone, message, 'registration');
}
```

**Auto-send on Calling:**
```javascript
async function onPatientCalled(patient) {
  const message = `NOW CALLING: ${patient.token}. ` +
    `Please proceed to Counter ${patient.counter} immediately.`;
  
  await sendSMS(patient.phone, message, 'calling');
}
```

---

## SMS Integration

### Twilio Integration

```javascript
const twilio = require('twilio');
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendSMS(to, message) {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    
    return { success: true, messageId: result.sid };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### Africa's Talking Integration

```javascript
const AfricasTalking = require('africastalking');
const africastalking = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME
});

const sms = africastalking.SMS;

async function sendSMS(to, message) {
  try {
    const result = await sms.send({
      to: [to],
      message: message,
      from: process.env.AT_SENDER_ID
    });
    
    return { success: true, messageId: result.SMSMessageData.Recipients[0].messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

---

## Error Handling

### Error Response Format

```javascript
{
  success: false,
  error: {
    message: "Error description",
    code: "ERROR_CODE",
    details: {}
  }
}
```

### Common Error Codes

```javascript
VALIDATION_ERROR: 400
UNAUTHORIZED: 401
FORBIDDEN: 403
NOT_FOUND: 404
CONFLICT: 409
INTERNAL_ERROR: 500
SERVICE_UNAVAILABLE: 503
```

### Error Handler Middleware

```javascript
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: err.code,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};
```

---

## Security

### Security Measures

1. **Password Security:**
   - Bcrypt hashing (10 rounds)
   - Minimum 8 characters
   - Password strength validation

2. **API Security:**
   - JWT authentication
   - Rate limiting (100 requests/15 minutes)
   - CORS configuration
   - Helmet.js for headers

3. **Data Validation:**
   - Joi schema validation
   - Input sanitization
   - SQL injection prevention
   - XSS protection

4. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb://...
   JWT_SECRET=your-secret-key
   JWT_EXPIRE=24h
   TWILIO_ACCOUNT_SID=...
   TWILIO_AUTH_TOKEN=...
   TWILIO_PHONE_NUMBER=...
   ```

---

## Deployment

### Production Checklist

- [ ] Environment variables configured
- [ ] Database connection secured
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Error tracking (Sentry)
- [ ] Monitoring (PM2, New Relic)
- [ ] Backup strategy
- [ ] Load balancing

### Deployment Platforms

**Heroku:**
```bash
heroku create hospital-api
heroku addons:create mongolab
git push heroku main
```

**AWS EC2:**
- Use PM2 for process management
- Nginx as reverse proxy
- SSL with Let's Encrypt

**DigitalOcean:**
- Docker container
- Managed MongoDB
- Load balancer

---

**Last Updated:** December 2024
**Version:** 1.0.0
