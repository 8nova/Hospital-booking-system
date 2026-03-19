import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import Patients from './components/Patients';
import Doctors from './components/Doctors';
import Appointments from './components/Appointments';
import Alerts from './components/Alerts';
import Analytics from './components/Analytics';
import Settings from './components/Settings';

// Mock data
const initialQueueData = [
  { id: 1, name: "John Doe", token: "KB-101", time: "09:30 AM", status: "waiting", priority: "normal", doctor: "Dr. Smith", department: "General OPD", phone: "+233 50 123 4567", ghanaCard: "GHA-123456789-0" },
  { id: 2, name: "Jane Smith", token: "KB-102", time: "09:45 AM", status: "waiting", priority: "high", doctor: "Dr. Johnson", department: "Emergency", phone: "+233 54 987 6543", ghanaCard: "GHA-987654321-0" },
  { id: 3, name: "Robert Brown", token: "KB-103", time: "10:00 AM", status: "in-progress", priority: "normal", doctor: "Dr. Smith", department: "General OPD", phone: "+233 55 111 2233", ghanaCard: "GHA-456789123-0" },
  { id: 4, name: "Emily Davis", token: "KB-104", time: "10:15 AM", status: "waiting", priority: "normal", doctor: "Dr. Johnson", department: "Pediatrics", phone: "+233 24 444 5555", ghanaCard: "GHA-789123456-0" },
  { id: 5, name: "Michael Wilson", token: "KB-105", time: "10:30 AM", status: "waiting", priority: "normal", doctor: "Dr. Smith", department: "Maternity Wing", phone: "+233 20 666 7777", ghanaCard: "GHA-321654987-0" },
];

const initialDoctorsData = [
  { id: 1, name: "Dr. Smith", specialty: "General Physician", status: "busy", currentPatient: "KB-103", patientsSeen: 8, phone: "+233 50 111 2222", email: "smith@hospital.com" },
  { id: 2, name: "Dr. Johnson", specialty: "Pediatrics", status: "available", currentPatient: "KB-102", patientsSeen: 6, phone: "+233 50 333 4444", email: "johnson@hospital.com" },
  { id: 3, name: "Dr. Williams", specialty: "Maternity", status: "on-break", currentPatient: null, patientsSeen: 4, phone: "+233 50 555 6666", email: "williams@hospital.com" },
  { id: 4, name: "Dr. Mensah", specialty: "Emergency", status: "available", currentPatient: null, patientsSeen: 5, phone: "+233 50 777 8888", email: "mensah@hospital.com" },
  { id: 5, name: "Dr. Akoto", specialty: "Surgery", status: "busy", currentPatient: "SUR-001", patientsSeen: 3, phone: "+233 50 999 0000", email: "akoto@hospital.com" },
];

const initialAppointmentsData = [
  { id: 1, patientName: "John Doe", doctor: "Dr. Smith", date: "2024-12-15", time: "10:00 AM", type: "Follow-up", status: "confirmed" },
  { id: 2, patientName: "Jane Smith", doctor: "Dr. Johnson", date: "2024-12-15", time: "11:00 AM", type: "Check-up", status: "confirmed" },
  { id: 3, patientName: "Robert Brown", doctor: "Dr. Williams", date: "2024-12-15", time: "02:00 PM", type: "Consultation", status: "pending" },
  { id: 4, patientName: "Emily Davis", doctor: "Dr. Mensah", date: "2024-12-16", time: "09:00 AM", type: "Emergency", status: "confirmed" },
  { id: 5, patientName: "Michael Wilson", doctor: "Dr. Akoto", date: "2024-12-16", time: "11:30 AM", type: "Surgery", status: "confirmed" },
];

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [queueData, setQueueData] = useState(initialQueueData);
  const [doctorsData, setDoctorsData] = useState(initialDoctorsData);
  const [appointmentsData, setAppointmentsData] = useState(initialAppointmentsData);
  const [isQueuePaused, setIsQueuePaused] = useState(false);

  // Queue management functions
  const callPatient = (patientId) => {
    setQueueData(prevData => {
      const updated = prevData.map(p => 
        p.id === patientId ? { ...p, status: 'in-progress' } : p
      );
      return updated;
    });
  };

  const completePatient = (patientId) => {
    setQueueData(prevData => 
      prevData.map(p => 
        p.id === patientId ? { ...p, status: 'completed' } : p
      )
    );
  };

  const callNextPatient = () => {
    const waitingPatients = queueData.filter(p => p.status === 'waiting');
    if (waitingPatients.length > 0) {
      callPatient(waitingPatients[0].id);
      return waitingPatients[0];
    }
    return null;
  };

  const addPatient = (newPatient) => {
    const lastToken = queueData.length > 0 ? queueData[queueData.length - 1].token : "KB-100";
    const tokenNum = parseInt(lastToken.split('-')[1]) + 1;
    const newToken = `KB-${tokenNum}`;
    
    const patient = {
      id: queueData.length + 1,
      ...newPatient,
      token: newToken,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'waiting',
    };
    
    setQueueData([...queueData, patient]);
    return patient;
  };

  // Doctor management functions
  const addDoctor = (newDoctor) => {
    const doctor = {
      id: doctorsData.length + 1,
      ...newDoctor,
      currentPatient: null,
      patientsSeen: 0,
    };
    setDoctorsData([...doctorsData, doctor]);
    return doctor;
  };

  // Appointment functions
  const addAppointment = (newAppointment) => {
    const appointment = {
      id: appointmentsData.length + 1,
      ...newAppointment,
    };
    setAppointmentsData([...appointmentsData, appointment]);
    return appointment;
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <Dashboard 
            queueData={queueData}
            doctorsData={doctorsData}
            callPatient={callPatient}
            completePatient={completePatient}
            callNextPatient={callNextPatient}
            isQueuePaused={isQueuePaused}
            setIsQueuePaused={setIsQueuePaused}
            addPatient={addPatient}
          />
        );
      case 'patients':
        return (
          <Patients 
            queueData={queueData}
            addPatient={addPatient}
          />
        );
      case 'doctors':
        return (
          <Doctors 
            doctorsData={doctorsData}
            addDoctor={addDoctor}
          />
        );
      case 'appointments':
        return (
          <Appointments 
            appointmentsData={appointmentsData}
            addAppointment={addAppointment}
          />
        );
      case 'alerts':
        return <Alerts queueData={queueData} />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="main-content">
        <TopBar activeSection={activeSection} />
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
