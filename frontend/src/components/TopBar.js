import React from 'react';

const TopBar = ({ activeSection, onPauseQueue, onAddPatient, onNotifications }) => {
  const getPageTitle = (section) => {
    const titles = {
      dashboard: 'Tamale SDA Hospital Dashboard',
      patients: 'Patients Management',
      doctors: 'Doctors Management',
      appointments: 'Appointments Calendar',
      alerts: 'SMS Alerts & Notifications',
      analytics: 'Analytics & Reports',
      settings: 'System Settings',
    };
    return titles[section] || 'Dashboard';
  };

  const getPageSubtitle = (section) => {
    const subtitles = {
      dashboard: 'General Hospital, Tamale - Management System',
      patients: 'Manage patient records and information',
      doctors: 'Manage doctors and their schedules',
      appointments: 'View and manage appointments',
      alerts: 'Send SMS notifications to patients',
      analytics: 'View reports and analytics',
      settings: 'Configure system settings',
    };
    return subtitles[section] || 'Management System';
  };

  const handleNotifications = () => {
    if (onNotifications) {
      onNotifications();
    } else {
      alert('You have 3 new notifications');
    }
  };

  const handlePauseQueue = () => {
    if (onPauseQueue) {
      onPauseQueue();
    } else {
      alert('Queue paused');
    }
  };

  const handleAddPatient = () => {
    if (onAddPatient) {
      onAddPatient();
    } else {
      alert('Add Patient clicked');
    }
  };

  return (
    <div className="top-bar">
      <div className="page-title">
        <h1 id="pageTitle">{getPageTitle(activeSection)}</h1>
        <p id="pageSubtitle">{getPageSubtitle(activeSection)}</p>
      </div>

      <div className="top-actions">
        <button className="notification-btn" onClick={handleNotifications}>
          <i className="fas fa-bell"></i>
          <span className="notification-badge">3</span>
        </button>
        <button className="btn btn-outline" id="pauseQueueBtn" onClick={handlePauseQueue}>
          <i className="fas fa-pause-circle"></i> Pause Queue
        </button>
        <button className="btn btn-primary" id="addPatientBtn" onClick={handleAddPatient}>
          <i className="fas fa-user-plus"></i> Add Patient
        </button>
      </div>
    </div>
  );
};

export default TopBar;