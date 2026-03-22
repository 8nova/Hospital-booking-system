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
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Doctor',
    password: ''
  });

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = () => {
    showNotification('Settings saved successfully!', 'success');
    console.log('Saved settings:', settings);
  };

  const handleExportData = () => {
    showNotification('Exporting data...', 'info');
    // Simulate data export
    setTimeout(() => {
      const dataStr = JSON.stringify(settings, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'hospital-data-export.json';
      link.click();
      showNotification('Data exported successfully!', 'success');
    }, 1000);
  };

  const handleClearOldRecords = () => {
    if (window.confirm('Are you sure you want to clear old records? This action cannot be undone.')) {
      showNotification('Clearing old records...', 'warning');
      setTimeout(() => {
        showNotification('Old records cleared successfully!', 'success');
      }, 1500);
    }
  };

  const handleSystemReset = () => {
    if (window.confirm('WARNING: This will reset all system data! Are you absolutely sure?')) {
      if (window.confirm('This is your last chance. Reset everything?')) {
        showNotification('Resetting system...', 'error');
        setTimeout(() => {
          showNotification('System reset complete!', 'success');
          // Reset to default settings
          setSettings({
            hospitalName: 'Korle-Bu Teaching Hospital',
            address: 'Accra, Ghana',
            phone: '+233 30 266 6500',
            tokenFormat: 'TSA-###',
            maxPatients: 30,
            autoCall: true
          });
        }, 2000);
      }
    }
  };

  const handleAddNewUser = () => {
    setShowAddUserModal(true);
  };

  const handleSubmitNewUser = (e) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.email || !newUserData.password) {
      showNotification('Please fill all required fields', 'warning');
      return;
    }
    showNotification(`User ${newUserData.name} added successfully as ${newUserData.role}!`, 'success');
    setNewUserData({ name: '', email: '', phone: '', role: 'Doctor', password: '' });
    setShowAddUserModal(false);
  };

  const handleEditUser = (userName) => {
    showNotification(`Edit user: ${userName}`, 'info');
  };

  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background-color: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 10px;
      animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  return (
    <div id="settings-section" className="content-section">
      <div className="section-header">
        <h2>System Settings</h2>
        <button className="btn btn-primary" onClick={handleSaveSettings}>
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
              <button className="btn btn-small btn-outline" onClick={() => handleEditUser('Waliu Bukari')}>Edit</button>
            </div>
            <div className="user-item">
              <div className="user-avatar-small">J</div>
              <div className="user-details">
                <strong>Dr. Johnson</strong>
                <span>Doctor</span>
              </div>
              <button className="btn btn-small btn-outline" onClick={() => handleEditUser('Dr. Johnson')}>Edit</button>
            </div>
            <button className="btn btn-outline" style={{width: '100%', marginTop: '10px'}} onClick={handleAddNewUser}>
              <i className="fas fa-user-plus"></i> Add New User
            </button>
          </div>
        </div>

        <div className="settings-card">
          <h3><i className="fas fa-database"></i> Data Management</h3>
          <button className="btn btn-outline" style={{width: '100%', marginBottom: '10px'}} onClick={handleExportData}>
            <i className="fas fa-download"></i> Export Data
          </button>
          <button className="btn btn-outline" style={{width: '100%', marginBottom: '10px'}} onClick={handleClearOldRecords}>
            <i className="fas fa-trash"></i> Clear Old Records
          </button>
          <button className="btn btn-danger" style={{width: '100%'}} onClick={handleSystemReset}>
            <i className="fas fa-power-off"></i> System Reset
          </button>
        </div>
      </div>

      {/* Add New User Modal */}
      {showAddUserModal && (
        <div className="modal" style={{display: 'flex'}}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New User</h3>
              <button className="close-modal" onClick={() => setShowAddUserModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmitNewUser}>
              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter full name"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="user@hospital.com"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  placeholder="+233 XX XXX XXXX"
                  value={newUserData.phone}
                  onChange={(e) => setNewUserData({...newUserData, phone: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Role *</label>
                <select 
                  className="form-control"
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({...newUserData, role: e.target.value})}
                  required
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Nurse">Nurse</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Pharmacist">Pharmacist</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Password *</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Enter password"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                  required 
                />
              </div>
              
              <div className="form-buttons">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddUserModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-user-plus"></i> Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;