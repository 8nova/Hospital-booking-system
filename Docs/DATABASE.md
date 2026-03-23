# Database Documentation

## Overview

This document provides comprehensive database design and schema specifications for the Hospital Management System. The system uses MongoDB as the primary database with Mongoose ODM for data modeling.

---

## Table of Contents

1. [Database Choice](#database-choice)
2. [Database Architecture](#database-architecture)
3. [Collections Schema](#collections-schema)
4. [Relationships](#relationships)
5. [Indexes](#indexes)
6. [Queries](#queries)
7. [Data Migration](#data-migration)
8. [Backup & Recovery](#backup--recovery)
9. [Performance Optimization](#performance-optimization)
10. [Security](#security)

---

## Database Choice

### Why MongoDB?

**Advantages:**
- Flexible schema for evolving requirements
- Horizontal scalability
- Fast read/write operations
- JSON-like documents (easy integration with React)
- Rich query language
- Built-in replication and sharding

**Use Cases:**
- Patient records with varying fields
- Real-time queue management
- SMS logs with high write volume
- Analytics data aggregation

### Alternative Options

**PostgreSQL:**
- Better for complex relationships
- ACID compliance
- Strong data integrity
- SQL queries

**MySQL:**
- Mature and stable
- Good for structured data
- Wide hosting support

---

## Database Architecture

### Database Structure

```
hospital_management_db
├── users
├── patients
├── doctors
├── appointments
├── queue
├── sms_logs
├── settings
└── audit_logs
```

### Connection Configuration

```javascript
// MongoDB Connection
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};
```

---

## Collections Schema

### 1. Users Collection

**Purpose:** Store system users (admins, doctors, receptionists)

**Schema:**
```javascript
{
  _id: ObjectId,
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['admin', 'doctor', 'receptionist', 'viewer'],
    default: 'receptionist'
  },
  phone: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  tokens: [{
    token: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
```javascript
email: unique
role: 1
isActive: 1
```

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Dr. John Smith",
  "email": "john.smith@hospital.com",
  "password": "$2b$10$...",
  "role": "doctor",
  "phone": "+233501234567",
  "avatar": null,
  "isActive": true,
  "lastLogin": "2024-12-15T10:30:00Z",
  "tokens": [],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-12-15T10:30:00Z"
}
```

---

### 2. Patients Collection

**Purpose:** Store patient information and visit history

**Schema:**
```javascript
{
  _id: ObjectId,
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  ghanaCard: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  address: {
    street: String,
    city: String,
    region: String,
    country: { type: String, default: 'Ghana' }
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    notes: String
  }],
  allergies: [String],
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  visits: [{
    visitId: ObjectId,
    date: Date,
    department: String,
    doctor: String,
    reason: String,
    diagnosis: String,
    prescription: String,
    status: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
```javascript
ghanaCard: unique
phone: 1
name: text
createdAt: -1
```

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Jane Doe",
  "phone": "+233241234567",
  "email": "jane.doe@email.com",
  "ghanaCard": "GHA-123456789-0",
  "dateOfBirth": "1990-05-15T00:00:00Z",
  "gender": "female",
  "address": {
    "street": "123 Main St",
    "city": "Accra",
    "region": "Greater Accra",
    "country": "Ghana"
  },
  "emergencyContact": {
    "name": "John Doe",
    "phone": "+233201234567",
    "relationship": "Spouse"
  },
  "medicalHistory": [],
  "allergies": ["Penicillin"],
  "bloodGroup": "O+",
  "visits": [],
  "isActive": true,
  "createdBy": "507f1f77bcf86cd799439011",
  "createdAt": "2024-12-15T09:00:00Z",
  "updatedAt": "2024-12-15T09:00:00Z"
}
```

---

### 3. Doctors Collection

**Purpose:** Store doctor profiles and schedules

**Schema:**
```javascript
{
  _id: ObjectId,
  name: {
    type: String,
    required: true,
    trim: true
  },
  specialty: {
    type: String,
    required: true,
    enum: ['General', 'Pediatrics', 'Maternity', 'Emergency', 'Surgery', 'Cardiology', 'Orthopedics']
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  qualification: {
    degree: String,
    institution: String,
    year: Number
  },
  experience: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['available', 'busy', 'on-break', 'inactive', 'vacation'],
    default: 'available'
  },
  currentPatient: {
    type: String,
    default: null
  },
  patientsSeen: {
    type: Number,
    default: 0
  },
  schedule: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: String,
    endTime: String,
    isAvailable: Boolean
  }],
  consultationFee: {
    type: Number,
    default: 0
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
```javascript
email: unique
licenseNumber: unique
specialty: 1
status: 1
isActive: 1
```

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "Dr. Sarah Johnson",
  "specialty": "Pediatrics",
  "phone": "+233501234567",
  "email": "sarah.johnson@hospital.com",
  "licenseNumber": "MD-12345",
  "qualification": {
    "degree": "MBBS, MD",
    "institution": "University of Ghana Medical School",
    "year": 2015
  },
  "experience": 9,
  "status": "available",
  "currentPatient": null,
  "patientsSeen": 6,
  "schedule": [
    {
      "day": "Monday",
      "startTime": "09:00",
      "endTime": "17:00",
      "isAvailable": true
    }
  ],
  "consultationFee": 150,
  "rating": {
    "average": 4.8,
    "count": 120
  },
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-12-15T10:00:00Z"
}
```

---

### 4. Queue Collection

**Purpose:** Manage daily patient queue

**Schema:**
```javascript
{
  _id: ObjectId,
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  patient: {
    type: ObjectId,
    ref: 'Patient',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  patientPhone: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  doctor: {
    type: String,
    required: true
  },
  doctorId: {
    type: ObjectId,
    ref: 'Doctor'
  },
  reason: {
    type: String,
    default: 'Consultation'
  },
  priority: {
    type: String,
    enum: ['normal', 'high', 'emergency'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['waiting', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'waiting'
  },
  counter: {
    type: String,
    default: null
  },
  arrivalTime: {
    type: Date,
    default: Date.now
  },
  calledTime: {
    type: Date,
    default: null
  },
  completedTime: {
    type: Date,
    default: null
  },
  waitTime: {
    type: Number,
    default: 0
  },
  consultationTime: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  },
  smsSent: {
    registration: { type: Boolean, default: false },
    calling: { type: Boolean, default: false },
    completion: { type: Boolean, default: false }
  },
  createdBy: {
    type: ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
```javascript
token: unique
date: -1
status: 1
priority: -1
arrivalTime: 1
{ date: 1, status: 1 }: compound
```

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "date": "2024-12-15T00:00:00Z",
  "token": "KB-101",
  "patient": "507f1f77bcf86cd799439012",
  "patientName": "Jane Doe",
  "patientPhone": "+233241234567",
  "department": "General OPD",
  "doctor": "Dr. Sarah Johnson",
  "doctorId": "507f1f77bcf86cd799439013",
  "reason": "Consultation",
  "priority": "normal",
  "status": "waiting",
  "counter": null,
  "arrivalTime": "2024-12-15T09:30:00Z",
  "calledTime": null,
  "completedTime": null,
  "waitTime": 0,
  "consultationTime": 0,
  "notes": "",
  "smsSent": {
    "registration": true,
    "calling": false,
    "completion": false
  },
  "createdBy": "507f1f77bcf86cd799439011",
  "createdAt": "2024-12-15T09:30:00Z",
  "updatedAt": "2024-12-15T09:30:00Z"
}
```

---

### 5. Appointments Collection

**Purpose:** Schedule and manage appointments

**Schema:**
```javascript
{
  _id: ObjectId,
  appointmentNumber: {
    type: String,
    required: true,
    unique: true
  },
  patient: {
    type: ObjectId,
    ref: 'Patient',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  patientPhone: {
    type: String,
    required: true
  },
  doctor: {
    type: ObjectId,
    ref: 'Doctor',
    required: true
  },
  doctorName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 30
  },
  type: {
    type: String,
    enum: ['Check-up', 'Follow-up', 'Consultation', 'Emergency', 'Surgery', 'Vaccination'],
    default: 'Consultation'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show', 'rescheduled'],
    default: 'pending'
  },
  notes: {
    type: String
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  cancelReason: {
    type: String
  },
  createdBy: {
    type: ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
```javascript
appointmentNumber: unique
date: 1
doctor: 1
status: 1
{ date: 1, doctor: 1 }: compound
{ date: 1, status: 1 }: compound
```

---

### 6. SMS Logs Collection

**Purpose:** Track all SMS communications

**Schema:**
```javascript
{
  _id: ObjectId,
  recipient: {
    type: String,
    required: true
  },
  recipientName: {
    type: String
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['registration', 'calling', 'waiting', 'completed', 'reminder', 'custom'],
    default: 'custom'
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'failed'],
    default: 'pending'
  },
  provider: {
    type: String,
    enum: ['twilio', 'africastalking', 'messagebird'],
    default: 'twilio'
  },
  messageId: {
    type: String
  },
  cost: {
    type: Number,
    default: 0
  },
  errorMessage: {
    type: String
  },
  sentBy: {
    type: ObjectId,
    ref: 'User'
  },
  sentAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
```javascript
recipient: 1
type: 1
status: 1
createdAt: -1
{ sentAt: -1 }: for recent logs
```

---

### 7. Settings Collection

**Purpose:** Store system configuration

**Schema:**
```javascript
{
  _id: ObjectId,
  hospitalName: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    region: String,
    country: String,
    postalCode: String
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  queueSettings: {
    tokenFormat: {
      type: String,
      default: 'KB-###'
    },
    maxPatientsPerDoctor: {
      type: Number,
      default: 30
    },
    autoCallNext: {
      type: Boolean,
      default: false
    },
    priorityEnabled: {
      type: Boolean,
      default: true
    }
  },
  smsSettings: {
    provider: {
      type: String,
      enum: ['twilio', 'africastalking', 'messagebird']
    },
    senderId: String,
    autoSend: {
      registration: { type: Boolean, default: true },
      calling: { type: Boolean, default: true },
      completion: { type: Boolean, default: false }
    },
    balance: {
      type: Number,
      default: 0
    }
  },
  workingHours: {
    start: { type: String, default: '08:00' },
    end: { type: String, default: '17:00' },
    workingDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }
  },
  updatedBy: {
    type: ObjectId,
    ref: 'User'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

---

## Relationships

### Entity Relationship Diagram

```
Users (1) ──────── (N) Patients [createdBy]
Users (1) ──────── (N) Queue [createdBy]
Users (1) ──────── (N) Appointments [createdBy]
Users (1) ──────── (N) SMS Logs [sentBy]

Patients (1) ───── (N) Queue [patient]
Patients (1) ───── (N) Appointments [patient]

Doctors (1) ────── (N) Queue [doctorId]
Doctors (1) ────── (N) Appointments [doctor]
```

### Relationship Types

**One-to-Many:**
- User → Patients (created by)
- User → Queue entries (created by)
- Patient → Queue entries
- Doctor → Queue entries
- Doctor → Appointments

**Referenced Documents:**
- Use ObjectId references
- Populate on query when needed
- Denormalize frequently accessed fields

---

## Indexes

### Performance Indexes

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// Patients
db.patients.createIndex({ ghanaCard: 1 }, { unique: true });
db.patients.createIndex({ phone: 1 });
db.patients.createIndex({ name: "text" });

// Doctors
db.doctors.createIndex({ email: 1 }, { unique: true });
db.doctors.createIndex({ specialty: 1, status: 1 });

// Queue
db.queue.createIndex({ token: 1 }, { unique: true });
db.queue.createIndex({ date: -1, status: 1 });
db.queue.createIndex({ priority: -1, arrivalTime: 1 });

// Appointments
db.appointments.createIndex({ date: 1, doctor: 1 });
db.appointments.createIndex({ appointmentNumber: 1 }, { unique: true });

// SMS Logs
db.sms_logs.createIndex({ createdAt: -1 });
db.sms_logs.createIndex({ status: 1 });
```

---

## Queries

### Common Query Examples

**Get Today's Queue:**
```javascript
const today = new Date();
today.setHours(0, 0, 0, 0);

const queue = await Queue.find({
  date: { $gte: today },
  status: { $in: ['waiting', 'in-progress'] }
})
.sort({ priority: -1, arrivalTime: 1 })
.populate('patient', 'name phone ghanaCard');
```

**Get Available Doctors:**
```javascript
const doctors = await Doctor.find({
  status: 'available',
  isActive: true
});
```

**Get Patient History:**
```javascript
const patient = await Patient.findById(patientId)
  .populate('visits.doctor');
```

**Analytics - Daily Stats:**
```javascript
const stats = await Queue.aggregate([
  {
    $match: {
      date: { $gte: startDate, $lte: endDate }
    }
  },
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
      total: { $sum: 1 },
      completed: {
        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
      },
      avgWaitTime: { $avg: "$waitTime" }
    }
  },
  {
    $sort: { _id: 1 }
  }
]);
```

---

## Data Migration

### Initial Setup Script

```javascript
// seeds/initial-data.js
const seedDatabase = async () => {
  // Create admin user
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@hospital.com',
    password: await bcrypt.hash('admin123', 10),
    role: 'admin',
    phone: '+233501234567'
  });

  // Create default settings
  await Settings.create({
    hospitalName: 'Tamale SDA Hospital',
    address: {
      city: 'Tamale',
      region: 'Northern Region',
      country: 'Ghana'
    },
    contact: {
      phone: '+233 50 123 4567',
      email: 'info@hospital.com'
    }
  });

  console.log('Database seeded successfully');
};
```

---

## Backup & Recovery

### Backup Strategy

**Daily Backups:**
```bash
# Automated daily backup
mongodump --uri="mongodb://..." --out=/backups/$(date +%Y%m%d)
```

**Restore:**
```bash
mongorestore --uri="mongodb://..." /backups/20241215
```

**Cloud Backup:**
- MongoDB Atlas automated backups
- AWS S3 backup storage
- 30-day retention policy

---

## Performance Optimization

### Best Practices

1. **Use Indexes:** Index frequently queried fields
2. **Limit Results:** Use pagination
3. **Project Fields:** Select only needed fields
4. **Avoid N+1:** Use populate wisely
5. **Cache:** Redis for frequently accessed data
6. **Aggregate:** Use aggregation pipeline for analytics

### Query Optimization

```javascript
// Bad
const patients = await Patient.find();

// Good
const patients = await Patient.find()
  .select('name phone ghanaCard')
  .limit(20)
  .skip(page * 20)
  .lean();
```

---

## Security

### Database Security

1. **Authentication:** Enable MongoDB authentication
2. **Encryption:** Encrypt data at rest
3. **Network:** Use VPN/firewall
4. **Backups:** Encrypt backup files
5. **Audit:** Enable audit logging
6. **Least Privilege:** Role-based access

---

**Last Updated:** December 2024
**Version:** 1.0.0
