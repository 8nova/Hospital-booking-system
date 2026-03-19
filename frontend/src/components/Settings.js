import React, { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    hospitalName: 'Korle-Bu Teaching Hospital',
    address: 'Accra, Ghana',
    phone: '+233 30 266 6500',
    tokenFormat: 'TSA-###',
    maxPatients: 30,
    autoCall: true
  });

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div id="settings-section" className="content-section">
      <div className="section-header">
        <h2>System Settings</h2>
        <button className="btn btn-primary">
          <i className="fas fa-save"></i> Save Settings
        </button>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <h3><i className="fas fa-hospital"></i> Hospital Information</h3>
          <div className="form-group">
            <label>Hospital Name</label>
            <input
              type="text"
              className="form-control"
              value={settings.hospitalName}
              onChange={(e) => handleInputChange('hospitalName', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              className="form-control"
              value={settings.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              className="form-control"
              value={settings.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>
        </div>

        <div className="settings-card">
          <h3><i className="fas fa-cog"></i> Queue Settings</h3>
          <div className="form-group">
            <label>Default Token Format</label>
            <select
              className="form-control"
              value={settings.tokenFormat}
              onChange={(e) => handleInputChange('tokenFormat', e.target.value)}
            >
              <option>TSA-###</option>
              <option>A###</option>
              <option>P###</option>
            </select>
          </div>
          <div className="form-group">
            <label>Max Patients per Doctor</label>
            <input
              type="number"
              className="form-control"
              value={settings.maxPatients}
              onChange={(e) => handleInputChange('maxPatients', parseInt(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>Auto-call Next Patient</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.autoCall}
                onChange={(e) => handleInputChange('autoCall', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-card">
          <h3><i className="fas fa-bell"></i> Notification Settings</h3>
          <div className="form-group">
            <label>SMS Provider</label>
            <select className="form-control">
              <option>Twilio</option>
              <option>MessageBird</option>
              <option>Africa's Talking</option>
            </select>
          </div>
          <div className="form-group">
            <label>SMS API Key</label>
            <input type="password" className="form-control" defaultValue="••••••••••••" />
          </div>
          <div className="form-group">
            <label>SMS Sender ID</label>
            <input type="text" className="form-control" defaultValue="KORLE-BU" />
          </div>
        </div>

        <div className="settings-card">
          <h3><i className="fas fa-user-shield"></i> User Management</h3>
          <div className="users-list">
            <div className="user-item">
              <div className="user-avatar-small">W</div>
              <div className="user-details">
                <strong>Waliu Bukari</strong>
                <span>Administrator</span>
              </div>
              <button className="btn btn-small btn-outline">Edit</button>
            </div>
            <div className="user-item">
              <div className="user-avatar-small">J</div>
              <div className="user-details">
                <strong>Dr. Johnson</strong>
                <span>Doctor</span>
              </div>
              <button className="btn btn-small btn-outline">Edit</button>
            </div>
            <button className="btn btn-outline" style={{width: '100%', marginTop: '10px'}}>
              <i className="fas fa-user-plus"></i> Add New User
            </button>
          </div>
        </div>

        <div className="settings-card">
          <h3><i className="fas fa-database"></i> Data Management</h3>
          <button className="btn btn-outline" style={{width: '100%', marginBottom: '10px'}}>
            <i className="fas fa-download"></i> Export Data
          </button>
          <button className="btn btn-outline" style={{width: '100%', marginBottom: '10px'}}>
            <i className="fas fa-trash"></i> Clear Old Records
          </button>
          <button className="btn btn-danger" style={{width: '100%'}}>
            <i className="fas fa-power-off"></i> System Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;