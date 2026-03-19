import React from 'react';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const navItems = [
    { id: 'dashboard', icon: 'fas fa-tachometer-alt', text: 'Dashboard' },
    { id: 'patients', icon: 'fas fa-users', text: 'Patients' },
    { id: 'doctors', icon: 'fas fa-user-md', text: 'Doctors' },
    { id: 'appointments', icon: 'fas fa-calendar-check', text: 'Appointments' },
    { id: 'alerts', icon: 'fas fa-sms', text: 'Alert SMS' },
    { id: 'analytics', icon: 'fas fa-chart-bar', text: 'Analytics' },
    { id: 'settings', icon: 'fas fa-cog', text: 'Settings' },
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <div className="logo-icon">
          <i className="fas fa-hospital-alt"></i>
        </div>
        <div className="logo-text">Management Dashboard</div>
      </div>

      <div className="nav-menu">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            data-section={item.id}
            onClick={(e) => {
              e.preventDefault();
              setActiveSection(item.id);
            }}
          >
            <i className={item.icon}></i>
            <span className="nav-text">{item.text}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">TSH</div>
          <div className="user-info">
            <h4>Tamale SDA Hospital</h4>
            <p>Hospital Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;