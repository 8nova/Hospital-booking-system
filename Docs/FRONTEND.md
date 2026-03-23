# Frontend Documentation

## Overview

The Hospital Management Dashboard is a modern, responsive React application designed to streamline hospital operations including patient queue management, doctor scheduling, appointments, and SMS notifications.

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Components](#components)
4. [State Management](#state-management)
5. [Styling](#styling)
6. [Features](#features)
7. [Installation & Setup](#installation--setup)
8. [Build & Deployment](#build--deployment)

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.4 | UI Framework |
| React DOM | 19.2.4 | DOM Rendering |
| React Scripts | 5.0.1 | Build Tool (Create React App) |
| CSS3 | - | Styling |
| Font Awesome | - | Icons |
| JavaScript (ES6+) | - | Programming Language |

---

## Project Structure

```
frontend/
├── public/
│   ├── index.html          # Main HTML file
│   ├── manifest.json       # PWA manifest
│   └── robots.txt          # SEO robots file
├── src/
│   ├── components/
│   │   ├── Dashboard.js    # Main dashboard with queue management
│   │   ├── Patients.js     # Patient records management
│   │   ├── Doctors.js      # Doctor management & schedules
│   │   ├── Appointments.js # Calendar & appointment scheduling
│   │   ├── Alerts.js       # SMS notification system
│   │   ├── Analytics.js    # Reports & analytics
│   │   ├── Settings.js     # System configuration
│   │   ├── Sidebar.js      # Navigation sidebar
│   │   └── TopBar.js       # Top navigation bar
│   ├── App.js              # Root component
│   ├── App.css             # Main stylesheet
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
├── package.json            # Dependencies & scripts
└── vercel.json             # Vercel deployment config
```

---

## Components

### 1. App.js (Root Component)

**Purpose:** Main application container that manages global state and routing.

**State:**
```javascript
- activeSection: string          // Current active page
- queueData: array              // Patient queue data
- doctorsData: array            // Doctors information
- appointmentsData: array       // Appointments list
- isQueuePaused: boolean        // Queue pause state
```

**Key Functions:**
```javascript
callPatient(patientId)          // Move patient to in-progress
completePatient(patientId)      // Mark patient as completed
callNextPatient()               // Call next waiting patient
addPatient(newPatient)          // Add new patient to queue
addDoctor(newDoctor)            // Add new doctor
addAppointment(newAppointment)  // Schedule new appointment
```

**Props Passed to Children:**
- Queue management functions
- Data arrays (patients, doctors, appointments)
- State setters

---

### 2. Sidebar.js

**Purpose:** Navigation menu for switching between sections.

**Props:**
```javascript
activeSection: string           // Current active section
setActiveSection: function      // Function to change section
```

**Navigation Items:**
- Dashboard
- Patients
- Doctors
- Appointments
- Alert SMS
- Analytics
- Settings

**Features:**
- Active state highlighting
- Icon + text labels
- User profile display at bottom
- Responsive (converts to horizontal on mobile)

---

### 3. TopBar.js

**Purpose:** Top navigation bar with page title and quick actions.

**Props:**
```javascript
activeSection: string           // Current section for title display
```

**Features:**
- Dynamic page titles based on active section
- Notification bell with badge
- Quick action buttons (Pause Queue, Add Patient)

---

### 4. Dashboard.js

**Purpose:** Main dashboard with real-time queue management.

**Props:**
```javascript
queueData: array               // Patient queue
doctorsData: array             // Doctors list
callPatient: function          // Call patient function
completePatient: function      // Complete patient function
callNextPatient: function      // Call next function
isQueuePaused: boolean         // Queue pause state
setIsQueuePaused: function     // Set pause state
addPatient: function           // Add patient function
```

**Features:**

1. **Stats Cards (5 cards):**
   - Total Patients Today
   - Waiting Patients
   - In Progress
   - Completed
   - Average Wait Time

2. **Queue Section:**
   - Tabs: All, Waiting, In Progress
   - Patient list with token numbers
   - Action buttons (Call, Done, Details)
   - Priority badges (High/Normal)
   - Scrollable list

3. **Doctors Status:**
   - Live availability status
   - Patients seen count
   - Status indicators (Available, Busy, On Break)

4. **Quick Actions:**
   - Add Patient
   - Pause/Resume Queue
   - Alerts
   - Emergency

5. **Add Patient Modal:**
   - Form fields: Name, Phone, Ghana Card, Reason, Department, Doctor
   - Auto-priority for emergency cases
   - Form validation

---

### 5. Patients.js

**Purpose:** Comprehensive patient records management.

**Props:**
```javascript
queueData: array               // Patient data
addPatient: function           // Add patient function
```

**Features:**

1. **Search Functionality:**
   - Search by name, Ghana Card, or phone
   - Real-time filtering

2. **Patient Table:**
   - Columns: ID, Name, Ghana Card, Phone, Department, Doctor, Status
   - Status badges (Waiting, In Progress, Completed, Cancelled)
   - Action buttons (View, Edit)

3. **Pagination:**
   - Page navigation
   - Page count display

4. **Add Patient Modal:**
   - Same as Dashboard modal
   - Form validation
   - Success notifications

**Functions:**
```javascript
viewPatientDetails(patient)    // Display patient info in alert
handleAddPatient(e)            // Submit new patient
```

---

### 6. Doctors.js

**Purpose:** Doctor management and scheduling.

**Props:**
```javascript
doctorsData: array             // Doctors list
addDoctor: function            // Add doctor function
```

**Features:**

1. **Doctor Cards Grid:**
   - Doctor avatar (initial letter)
   - Name and specialty
   - Status badge (Active, Busy, On Break, Vacation)
   - Contact info (phone, email)
   - Patients seen today
   - Current patient (if busy)
   - Action buttons (Edit, Schedule)

2. **Weekly Schedule Table:**
   - Time slots (9:00 AM, 2:00 PM)
   - Doctor assignments per day
   - Monday to Saturday

3. **Add Doctor Modal:**
   - Fields: Name, Specialty, Phone, Email, Status
   - Specialty options: General, Pediatrics, Maternity, Emergency, Surgery
   - Form validation

**Status Types:**
- Active (Green)
- Busy (Yellow)
- On Break (Gray)
- Inactive (Gray)
- On Vacation (Yellow)

---

### 7. Appointments.js

**Purpose:** Calendar view and appointment scheduling.

**Props:**
```javascript
appointmentsData: array        // Appointments list
addAppointment: function       // Add appointment function
```

**Features:**

1. **Calendar View:**
   - Month navigation (Previous/Next)
   - Current month/year display
   - Day grid (Sun-Sat)
   - Appointment indicators (dots)
   - Hover shows appointment count

2. **Today's Appointments:**
   - List of appointments for current day
   - Time, patient name, doctor, type
   - Status badges (Scheduled, Confirmed, Completed, Cancelled)

3. **Add Appointment Modal:**
   - Fields: Patient Name, Doctor, Date, Time, Type, Status
   - Type options: Check-up, Follow-up, Consultation, Emergency, Surgery
   - Date picker
   - Time picker

**Functions:**
```javascript
handlePrevMonth()              // Navigate to previous month
handleNextMonth()              // Navigate to next month
handleAddAppointment(e)        // Submit new appointment
```

---

### 8. Alerts.js (SMS System)

**Purpose:** SMS notification management and preview.

**Props:**
```javascript
queueData: array               // Patient data for SMS recipients
```

**Features:**

1. **SMS Preview Screen:**
   - iPhone-style message interface
   - Real-time preview of SMS
   - Message bubbles with timestamps
   - Emergency alert styling

2. **SMS Templates (6 types):**
   - Registration Confirmation
   - Waiting Time Update
   - Patient Calling (Urgent)
   - Appointment Completed
   - Queue Delay Alert
   - Emergency Protocol

3. **SMS Settings:**
   - Toggle switches for:
     - Registration SMS
     - Calling Alerts
     - Wait Time Updates
     - Completion SMS
   - SMS balance display
   - Buy more credits button

4. **SMS Log:**
   - Recent messages sent
   - Timestamp
   - Message content
   - Delivery status (Delivered, Pending, Failed)

5. **Send SMS Modal:**
   - Recipient options: All Waiting, Specific Patient, Department
   - Patient selector (if specific)
   - Message textarea
   - Live preview
   - Send button

6. **Test SMS:**
   - Send test message to phone number
   - Prompt for phone input

**Functions:**
```javascript
handleTemplateClick(type)      // Select SMS template
handleSendSMS(e)               // Send SMS to recipients
handleSendTest()               // Send test SMS
showNotification(msg, type)    // Display notification toast
```

---

### 9. Analytics.js

**Purpose:** Reports, charts, and statistics.

**Features:**

1. **Date Range Filter:**
   - Dropdown: Today, This Week, This Month, This Quarter, This Year
   - Custom date range (from/to)
   - Apply button

2. **Charts (4 charts):**
   - **Patient Trends:** Line chart showing daily patient count
   - **Department Distribution:** Doughnut chart of patients by department
   - **Wait Time Analysis:** Bar chart of average wait times
   - **Doctor Performance:** Bar chart of patients seen per doctor

3. **Detailed Report Table:**
   - Columns: Date, Total Patients, Avg Wait Time, Completed, No Shows, Satisfaction
   - 5 days of sample data

4. **Summary Statistics (4 cards):**
   - Average Patients/Day
   - Average Wait Time
   - Completion Rate
   - Average Satisfaction

**Chart Integration:**
- Uses Chart.js (loaded via CDN in index.html)
- Initializes charts on component mount
- Responsive charts

---

### 10. Settings.js

**Purpose:** System configuration and preferences.

**Features:**

1. **Hospital Information:**
   - Hospital Name
   - Address
   - Phone Number

2. **Queue Settings:**
   - Default Token Format (TSA-###, A###, P###)
   - Max Patients per Doctor
   - Auto-call Next Patient (toggle)

3. **Notification Settings:**
   - SMS Provider (Twilio, MessageBird, Africa's Talking)
   - SMS API Key (password field)
   - SMS Sender ID

4. **User Management:**
   - User list with avatars
   - User roles (Administrator, Doctor)
   - Edit button per user
   - Add New User button

5. **Data Management:**
   - Export Data button
   - Clear Old Records button
   - System Reset button (danger)

**State:**
```javascript
settings: {
  hospitalName: string
  address: string
  phone: string
  tokenFormat: string
  maxPatients: number
  autoCall: boolean
}
```

---

## State Management

### Global State (App.js)

**Queue Data Structure:**
```javascript
{
  id: number,
  name: string,
  token: string,              // e.g., "KB-101"
  time: string,               // e.g., "09:30 AM"
  status: string,             // "waiting" | "in-progress" | "completed"
  priority: string,           // "normal" | "high"
  doctor: string,
  department: string,
  phone: string,
  ghanaCard: string,
  reason: string
}
```

**Doctor Data Structure:**
```javascript
{
  id: number,
  name: string,
  specialty: string,
  status: string,             // "available" | "busy" | "on-break"
  currentPatient: string,     // Token number or null
  patientsSeen: number,
  phone: string,
  email: string
}
```

**Appointment Data Structure:**
```javascript
{
  id: number,
  patientName: string,
  doctor: string,
  date: string,               // "YYYY-MM-DD"
  time: string,               // "10:00 AM"
  type: string,               // "Check-up" | "Follow-up" | etc.
  status: string              // "pending" | "confirmed" | "completed" | "cancelled"
}
```

### Local State

Each component manages its own local state for:
- Modal visibility
- Form data
- Search terms
- Filters
- UI interactions

---

## Styling

### Design System

**Color Palette:**
```css
--primary: #2563eb          /* Blue - Primary actions */
--primary-light: #dbeafe    /* Light blue - Backgrounds */
--secondary: #10b981        /* Green - Success */
--danger: #ef4444           /* Red - Errors/Danger */
--warning: #f59e0b          /* Orange - Warnings */
--dark: #1f2937             /* Dark gray - Text */
--light: #f9fafb            /* Light gray - Backgrounds */
--gray: #6b7280             /* Gray - Secondary text */
--gray-light: #e5e7eb       /* Light gray - Borders */
```

**Typography:**
- Font Family: 'Inter', sans-serif
- Heading Weights: 700
- Body Weights: 400-600
- Font Sizes: 12px - 28px

**Spacing:**
- Card Padding: 20-25px
- Grid Gaps: 15-25px
- Button Padding: 10-20px

**Border Radius:**
- Cards: 12px
- Buttons: 8px
- Badges: 20px (pill shape)
- Inputs: 8px

**Shadows:**
- Cards: `0 4px 6px rgba(0, 0, 0, 0.05)`
- Hover: `0 8px 16px rgba(0, 0, 0, 0.1)`

### Responsive Breakpoints

```css
/* Desktop: > 992px */
- Full sidebar (250px)
- 2-column dashboard grid
- 5-column stats grid

/* Tablet: 768px - 992px */
- Horizontal navigation
- Single column dashboard
- 2-column stats grid

/* Mobile: < 768px */
- Stacked layout
- Single column stats
- Full-width components
```

### CSS Architecture

**Main Sections:**
1. Reset & Base Styles
2. Sidebar Styles
3. Main Content & TopBar
4. Dashboard Components
5. Queue Management
6. Doctors Section
7. Patients Section
8. Appointments Section
9. SMS/Alerts Section
10. Analytics Section
11. Settings Section
12. Modals & Forms
13. Utility Classes
14. Animations
15. Responsive Media Queries

**Key CSS Features:**
- Custom scrollbars
- Smooth transitions
- Hover effects
- Focus states for accessibility
- Loading states
- Empty states

---

## Features

### 1. Real-Time Queue Management
- Add patients to queue
- Call patients (move to in-progress)
- Complete consultations
- Priority handling (emergency cases)
- Queue pause/resume
- Token generation (auto-increment)

### 2. Patient Management
- Search patients
- View patient details
- Track patient status
- Patient history
- Contact information

### 3. Doctor Management
- Doctor profiles
- Availability status
- Patient count tracking
- Schedule management
- Contact information

### 4. Appointment Scheduling
- Calendar view
- Month navigation
- Appointment indicators
- Today's appointments
- Status tracking

### 5. SMS Notifications
- Template-based messages
- Bulk SMS sending
- Individual SMS
- SMS preview
- Delivery tracking
- SMS balance monitoring

### 6. Analytics & Reports
- Patient trends
- Department distribution
- Wait time analysis
- Doctor performance
- Detailed reports
- Summary statistics

### 7. System Settings
- Hospital configuration
- Queue preferences
- SMS integration
- User management
- Data export

---

## Installation & Setup

### Prerequisites
```bash
Node.js 18.x or higher
npm or yarn
```

### Installation Steps

1. **Clone Repository:**
```bash
git clone <repository-url>
cd Hospital-booking-system/frontend
```

2. **Install Dependencies:**
```bash
npm install
```

3. **Start Development Server:**
```bash
npm start
```

4. **Open Browser:**
```
http://localhost:3000
```

### Available Scripts

```bash
npm start          # Start development server (port 3000)
npm run build      # Create production build
npm test           # Run tests
npm run eject      # Eject from Create React App (irreversible)
```

---

## Build & Deployment

### Production Build

```bash
cd frontend
npm run build
```

**Output:**
- Build folder: `frontend/build/`
- Optimized JS: ~70 KB (gzipped)
- Optimized CSS: ~5 KB (gzipped)

### Deployment on Vercel

**Option 1: Vercel CLI**
```bash
npm install -g vercel
vercel login
cd frontend
vercel --prod
```

**Option 2: Vercel Dashboard**
1. Push code to GitHub
2. Import project on Vercel
3. Set root directory: `frontend`
4. Framework: Create React App
5. Build command: `npm run build`
6. Output directory: `build`
7. Deploy

### Environment Variables

If using backend APIs, add in Vercel dashboard:
```
REACT_APP_API_URL=https://your-api.com
REACT_APP_SMS_API_KEY=your-key
```

---

## Performance Optimization

### Implemented Optimizations

1. **Code Splitting:**
   - React lazy loading ready
   - Component-based architecture

2. **CSS Optimization:**
   - Minified in production
   - Critical CSS inline
   - Unused CSS removed

3. **JavaScript Optimization:**
   - Minified and uglified
   - Tree shaking
   - Gzip compression

4. **Image Optimization:**
   - SVG icons (Font Awesome)
   - No heavy images

5. **Caching:**
   - Service worker ready
   - Static asset caching

### Performance Metrics

**Expected Lighthouse Scores:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

---

## Accessibility Features

1. **Keyboard Navigation:**
   - Tab order follows visual hierarchy
   - Focus indicators on all interactive elements
   - Escape key closes modals

2. **ARIA Labels:**
   - Semantic HTML elements
   - Button labels with icons
   - Form labels properly associated

3. **Color Contrast:**
   - WCAG AA compliant
   - Clear status indicators
   - Readable text colors

4. **Responsive Design:**
   - Mobile-friendly touch targets (44px minimum)
   - Readable text sizes
   - Scalable layouts

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Future Enhancements

1. **Features:**
   - Dark mode
   - Multi-language support
   - Offline mode (PWA)
   - Real-time updates (WebSocket)
   - Advanced filtering
   - Export to PDF/Excel
   - Print functionality

2. **Technical:**
   - Redux for state management
   - React Query for data fetching
   - TypeScript migration
   - Unit tests (Jest)
   - E2E tests (Cypress)
   - Storybook for components

3. **UI/UX:**
   - Drag-and-drop queue management
   - Customizable themes
   - Dashboard widgets
   - Advanced charts (D3.js)
   - Voice commands

---

## Troubleshooting

### Common Issues

**Issue: Build fails**
```bash
# Solution:
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Issue: Port 3000 already in use**
```bash
# Solution:
# Kill process on port 3000 or use different port
PORT=3001 npm start
```

**Issue: Styles not loading**
```bash
# Solution:
# Clear browser cache
# Check if App.css is imported in App.js
# Rebuild the project
```

**Issue: Components not rendering**
```bash
# Solution:
# Check browser console for errors
# Verify all imports are correct
# Check React DevTools
```

---

## Support & Resources

- **React Documentation:** https://react.dev
- **Create React App:** https://create-react-app.dev
- **Font Awesome:** https://fontawesome.com
- **CSS Tricks:** https://css-tricks.com
- **MDN Web Docs:** https://developer.mozilla.org

---

## License

MIT License - See LICENSE file for details

---

## Contributors

- Frontend Development Team
- UI/UX Design Team
- Quality Assurance Team

---

**Last Updated:** December 2024
**Version:** 1.0.0
