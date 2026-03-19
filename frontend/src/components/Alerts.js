import React, { useState } from 'react';

const Alerts = ({ queueData = [] }) => {
  const [smsSettings, setSmsSettings] = useState({
    registration: true,
    calling: true,
    waitTime: false,
    completion: true
  });
  const [smsTemplate, setSmsTemplate] = useState('registration');
  const [smsMessage, setSmsMessage] = useState('');
  const [smsLog, setSmsLog] = useState([
    {
      id: 1,
      time: '10:45 AM',
      content: 'TSA-204 - Called to Counter 4',
      status: 'Delivered'
    },
    {
      id: 2,
      time: '10:30 AM',
      content: 'TSA-205 - Registration confirmed',
      status: 'Delivered'
    }
  ]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendFormData, setSendFormData] = useState({
    recipient: 'all',
    selectedPatient: '',
    message: ''
  });

  const handleSettingChange = (setting) => {
    setSmsSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const loadTemplate = (templateType) => {
    const templates = {
      'registration': 'Registration successful! Your token is {token}. You are {position} in line for {department}.',
      'waiting': 'Estimated wait time: {time}. Your current position: {position} in queue.',
      'calling': 'NOW CALLING: {token}. Please proceed to {counter} immediately.',
      'completed': 'Appointment completed! Thank you for visiting our hospital. Follow-up in 2 weeks if needed.',
      'delay': '⚠️ Queue delay alert: Your wait time has increased by 10 minutes due to high volume.',
      'emergency': '🚨 EMERGENCY PROTOCOL ACTIVATED. All emergency cases are being prioritized.'
    };
    setSmsMessage(templates[templateType] || '');
  };

  const handleTemplateClick = (templateType) => {
    setSmsTemplate(templateType);
    loadTemplate(templateType);
  };

  const handleSendSMS = (e) => {
    e.preventDefault();
    if (!sendFormData.message.trim()) {
      showNotification('Please enter a message', 'warning');
      return;
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newLog = {
      id: smsLog.length + 1,
      time: timeString,
      content: sendFormData.message.substring(0, 50) + (sendFormData.message.length > 50 ? '...' : ''),
      status: 'Delivered'
    };

    setSmsLog([newLog, ...smsLog]);
    setSendFormData({ recipient: 'all', selectedPatient: '', message: '' });
    setShowSendModal(false);
    showNotification('SMS sent successfully!', 'success');
  };

  const handleSendTest = () => {
    const phone = prompt('Enter phone number for test SMS:');
    if (phone) {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const newLog = {
        id: smsLog.length + 1,
        time: timeString,
        content: `Test message sent to ${phone}`,
        status: 'Delivered'
      };

      setSmsLog([newLog, ...smsLog]);
      showNotification(`Test SMS sent to ${phone}`, 'success');
    }
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
    <div id="alerts-section" className="content-section">
      <div className="section-header">
        <h2>SMS Alerts & Notifications</h2>
        <button className="btn btn-primary" onClick={() => setShowSendModal(true)}>
          <i className="fas fa-paper-plane"></i> Send SMS
        </button>
      </div>

      <div className="sms-preview-container">
        <div className="sms-preview-header">
          <div className="sms-header-info">
            <h4>Real-time SMS Notifications</h4>
            <p>Preview how SMS alerts look when sent to patients</p>
          </div>
          <button className="btn btn-primary" onClick={handleSendTest}>
            <i className="fas fa-paper-plane"></i> Send Test SMS
          </button>
        </div>

        <div className="sms-container">
          <div className="sms-screen">
            <div className="sms-header">
              <div className="sms-carrier">iMessage • Today</div>
              <div className="sms-time">Now</div>
            </div>

            <div className="bubble bubble-in">
              <div className="bubble-header">
                <strong>HOSPITAL ADMIN</strong>
                <span className="sms-time-small">10:30 AM</span>
              </div>
              <div className="bubble-content">
                Registration successful! Your token is <strong className="token-highlight">KB-204</strong>.
                You are <strong>4th</strong> in line for <strong>General OPD</strong>.
              </div>
            </div>

            {smsTemplate === 'emergency' && (
              <div className="bubble bubble-in emergency">
                <div className="bubble-header">
                  <strong>HOSPITAL - EMERGENCY</strong>
                  <span className="sms-time-small">10:45 AM</span>
                </div>
                <div className="bubble-content">
                  🚨 EMERGENCY PROTOCOL ACTIVATED<br/>
                  All emergency cases are being prioritized.
                </div>
              </div>
            )}

            {smsTemplate === 'calling' && (
              <div className="bubble bubble-in emergency">
                <div className="bubble-header">
                  <strong>HOSPITAL - URGENT</strong>
                  <span className="sms-time-small">10:45 AM</span>
                </div>
                <div className="bubble-content">
                  <strong>NOW CALLING: KB-204</strong><br/>
                  Please proceed to <strong className="counter-highlight">Counter 4</strong>.
                </div>
              </div>
            )}
          </div>

          <div className="sms-templates">
            <h4>Available SMS Templates</h4>
            <div className="template-list">
              <div 
                className={`template-item ${smsTemplate === 'registration' ? 'active' : ''}`}
                onClick={() => handleTemplateClick('registration')}
              >
                <i className="fas fa-user-plus"></i>
                <span>Registration Confirmation</span>
              </div>
              <div 
                className={`template-item ${smsTemplate === 'waiting' ? 'active' : ''}`}
                onClick={() => handleTemplateClick('waiting')}
              >
                <i className="fas fa-clock"></i>
                <span>Waiting Time Update</span>
              </div>
              <div 
                className={`template-item ${smsTemplate === 'calling' ? 'active' : ''}`}
                onClick={() => handleTemplateClick('calling')}
              >
                <i className="fas fa-bullhorn"></i>
                <span>Patient Calling</span>
              </div>
              <div 
                className={`template-item ${smsTemplate === 'completed' ? 'active' : ''}`}
                onClick={() => handleTemplateClick('completed')}
              >
                <i className="fas fa-check-circle"></i>
                <span>Appointment Completed</span>
              </div>
              <div 
                className={`template-item ${smsTemplate === 'delay' ? 'active' : ''}`}
                onClick={() => handleTemplateClick('delay')}
              >
                <i className="fas fa-exclamation-triangle"></i>
                <span>Queue Delay Alert</span>
              </div>
              <div 
                className={`template-item ${smsTemplate === 'emergency' ? 'active' : ''}`}
                onClick={() => handleTemplateClick('emergency')}
              >
                <i className="fas fa-ambulance"></i>
                <span>Emergency Protocol</span>
              </div>
            </div>

            <div className="sms-settings">
              <h4>SMS Settings</h4>
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={smsSettings.registration}
                    onChange={() => handleSettingChange('registration')}
                  /> Enable Registration SMS
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={smsSettings.calling}
                    onChange={() => handleSettingChange('calling')}
                  /> Enable Calling Alerts
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={smsSettings.waitTime}
                    onChange={() => handleSettingChange('waitTime')}
                  /> Enable Wait Time Updates
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={smsSettings.completion}
                    onChange={() => handleSettingChange('completion')}
                  /> Enable Completion SMS
                </label>
              </div>
              <div className="sms-credit">
                <i className="fas fa-credit-card"></i>
                <span>SMS Balance: <strong>1,245</strong> credits</span>
                <button className="btn btn-small">Buy More</button>
              </div>
            </div>
          </div>
        </div>

        <div className="sms-log">
          <h4>Recent SMS Log</h4>
          <div className="log-container">
            {smsLog.map(log => (
              <div key={log.id} className="log-item success">
                <div className="log-time">{log.time}</div>
                <div className="log-content">
                  <strong>{log.content}</strong>
                </div>
                <div className="log-status">{log.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Send SMS Modal */}
      {showSendModal && (
        <div className="modal" style={{display: 'flex'}}>
          <div className="modal-content">
            <div className="modal-header">
              <h3><i className="fas fa-sms"></i> Send SMS Notification</h3>
              <button className="close-modal" onClick={() => setShowSendModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSendSMS}>
              <div className="form-group">
                <label>Recipient</label>
                <select 
                  className="form-control"
                  value={sendFormData.recipient}
                  onChange={(e) => setSendFormData({...sendFormData, recipient: e.target.value})}
                  required
                >
                  <option value="all">All Waiting Patients</option>
                  <option value="specific">Specific Patient</option>
                  <option value="department">Department</option>
                </select>
              </div>

              {sendFormData.recipient === 'specific' && (
                <div className="form-group">
                  <label>Select Patient</label>
                  <select 
                    className="form-control"
                    value={sendFormData.selectedPatient}
                    onChange={(e) => setSendFormData({...sendFormData, selectedPatient: e.target.value})}
                  >
                    <option value="">Select patient...</option>
                    {queueData.filter(p => p.status === 'waiting').map(p => (
                      <option key={p.id} value={p.phone}>
                        {p.name} ({p.token}) - {p.phone}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>Message</label>
                <textarea 
                  className="form-control"
                  rows="4"
                  placeholder="Enter your message..."
                  value={sendFormData.message}
                  onChange={(e) => setSendFormData({...sendFormData, message: e.target.value})}
                  required
                ></textarea>
              </div>

              <div className="sms-preview">
                <h4>Preview:</h4>
                <div className="sms-preview-box">
                  {sendFormData.message || 'Preview will appear here...'}
                </div>
              </div>

              <div className="form-buttons">
                <button type="button" className="btn btn-outline" onClick={() => setShowSendModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Send SMS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;