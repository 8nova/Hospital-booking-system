import React, { useState } from 'react';

const Dashboard = ({ 
  queueData, 
  doctorsData, 
  callPatient, 
  completePatient, 
  callNextPatient,
  isQueuePaused,
  setIsQueuePaused,
  addPatient
}) => {
  const [queueFilter, setQueueFilter] = useState('all');
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    ghanaCard: '',
    reason: 'normal',
    department: '',
    doctor: '',
    priority: 'normal'
  });

  // Calculate stats
  const stats = {
    totalPatients: queueData.length,
    waitingPatients: queueData.filter(p => p.status === 'waiting').length,
    inProgress: queueData.filter(p => p.status === 'in-progress').length,
    completed: queueData.filter(p => p.status === 'completed').length,
    avgWaitTime: '25m'
  };

  const filteredQueue = queueData.filter(item => {
    if (queueFilter === 'all') return true;
    if (queueFilter === 'waiting') return item.status === 'waiting';
    if (queueFilter === 'in-progress') return item.status === 'in-progress';
    return false;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'waiting': return 'status-waiting';
      case 'in-progress': return 'status-progress';
      case 'completed': return 'status-completed';
      default: return '';
    }
  };

  const getDoctorStatusClass = (status) => {
    switch (status) {
      case 'available': return 'doctor-available';
      case 'busy': return 'doctor-busy';
      case 'on-break': return 'doctor-offline';
      default: return 'doctor-offline';
    }
  };

  const handleAddPatient = (e) => {
    e.preventDefault();
    let priority = formData.priority;
    if (formData.department === 'Emergency' || formData.reason === 'emergency') {
      priority = 'high';
    }
    
    const newPatient = {
      ...formData,
      priority
    };
    
    addPatient(newPatient);
    setFormData({
      name: '',
      phone: '',
      ghanaCard: '',
      reason: 'normal',
      department: '',
      doctor: '',
      priority: 'normal'
    });
    setShowAddPatientModal(false);
    showNotification(`Added patient ${formData.name} to queue`, 'success');
  };

  const handleCallPatient = (patientId) => {
    callPatient(patientId);
    const patient = queueData.find(p => p.id === patientId);
    if (patient) {
      showNotification(`Calling patient: ${patient.name} (${patient.token})`, 'success');
    }
  };

  const handleCompletePatient = (patientId) => {
    completePatient(patientId);
    const patient = queueData.find(p => p.id === patientId);
    if (patient) {
      showNotification(`Marked ${patient.name} as completed`, 'success');
    }
  };

  const handleCallNext = () => {
    const nextPatient = callNextPatient();
    if (!nextPatient) {
      showNotification("No patients waiting in queue", 'warning');
    }
  };

  const handlePauseQueue = () => {
    const newPausedState = !isQueuePaused;
    setIsQueuePaused(newPausedState);
    
    if (newPausedState) {
      showNotification("⏸️ Queue is now PAUSED - No new patients will be called", 'warning');
    } else {
      showNotification("▶️ Queue is now ACTIVE - Patients can be called", 'success');
    }
  };

  const handleAlertsClick = () => {
    showNotification('Viewing system alerts', 'info');
  };

  const handleEmergencyClick = () => {
    // Show emergency modal
    const emergencyModal = document.createElement('div');
    emergencyModal.className = 'modal';
    emergencyModal.style.display = 'flex';
    emergencyModal.innerHTML = `
      <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header" style="background-color: #fee2e2; border-radius: 8px 8px 0 0; padding: 20px;">
          <h3 style="color: #991b1b; display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-exclamation-triangle" style="font-size: 24px;"></i>
            EMERGENCY MODE ACTIVATED
          </h3>
          <button class="close-modal" onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #991b1b;">&times;</button>
        </div>
        <div style="padding: 25px;">
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e; font-weight: 600;">
              <i class="fas fa-info-circle"></i> Emergency Protocol Initiated
            </p>
          </div>
          
          <h4 style="margin-bottom: 15px; color: #1f2937;">Emergency Actions:</h4>
          <ul style="list-style: none; padding: 0; margin-bottom: 20px;">
            <li style="padding: 10px; background-color: #f9fafb; margin-bottom: 8px; border-radius: 6px; display: flex; align-items: center; gap: 10px;">
              <i class="fas fa-check-circle" style="color: #10b981;"></i>
              <span>All emergency patients moved to priority queue</span>
            </li>
            <li style="padding: 10px; background-color: #f9fafb; margin-bottom: 8px; border-radius: 6px; display: flex; align-items: center; gap: 10px;">
              <i class="fas fa-check-circle" style="color: #10b981;"></i>
              <span>Emergency doctors notified</span>
            </li>
            <li style="padding: 10px; background-color: #f9fafb; margin-bottom: 8px; border-radius: 6px; display: flex; align-items: center; gap: 10px;">
              <i class="fas fa-check-circle" style="color: #10b981;"></i>
              <span>Emergency room prepared</span>
            </li>
            <li style="padding: 10px; background-color: #f9fafb; margin-bottom: 8px; border-radius: 6px; display: flex; align-items: center; gap: 10px;">
              <i class="fas fa-check-circle" style="color: #10b981;"></i>
              <span>SMS alerts sent to emergency staff</span>
            </li>
          </ul>
          
          <div style="background-color: #fee2e2; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; color: #991b1b; font-weight: 600;">
              <i class="fas fa-phone-alt"></i> Emergency Contact: +233 30 266 6500
            </p>
          </div>
          
          <button class="btn btn-danger" onclick="this.closest('.modal').remove()" style="width: 100%; padding: 12px; font-size: 16px;">
            <i class="fas fa-times-circle"></i> Close Emergency Panel
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(emergencyModal);
    showNotification('🚨 EMERGENCY MODE ACTIVATED!', 'error');
  };

  const handleViewDetails = (patientId) => {
    const patient = queueData.find(p => p.id === patientId);
    if (patient) {
      showNotification(`Viewing details for ${patient.name}`, 'info');
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
    <div id="dashboard-section" className="content-section active">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <h3>{stats.totalPatients}</h3>
            <p>Total Patients Today</p>
          </div>
          <div className="stat-icon stat-patients">
            <i className="fas fa-users"></i>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>{stats.waitingPatients}</h3>
            <p>Waiting</p>
          </div>
          <div className="stat-icon stat-waiting">
            <i className="fas fa-clock"></i>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>
          <div className="stat-icon stat-progress">
            <i className="fas fa-procedures"></i>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
          <div className="stat-icon stat-completed">
            <i className="fas fa-check-circle"></i>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>{stats.avgWaitTime}</h3>
            <p>Avg Wait Time</p>
          </div>
          <div className="stat-icon stat-time">
            <i className="fas fa-chart-line"></i>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Queue Management Section */}
        <div className="queue-section">
          <div className="section-header">
            <div>
              <h2>Patient Queue</h2>
              <p>Manage real-time patient queue</p>
            </div>
            <button className="btn btn-primary" onClick={handleCallNext}>
              <i className="fas fa-bullhorn"></i> Call Next Patient
            </button>
          </div>

          {/* Queue Tabs */}
          <div className="queue-tabs">
            <button
              className={`tab-btn ${queueFilter === 'all' ? 'active' : ''}`}
              onClick={() => setQueueFilter('all')}
            >
              All Patients <span className="queue-count">({queueData.length})</span>
            </button>
            <button
              className={`tab-btn ${queueFilter === 'waiting' ? 'active' : ''}`}
              onClick={() => setQueueFilter('waiting')}
            >
              Waiting <span className="queue-count">({stats.waitingPatients})</span>
            </button>
            <button
              className={`tab-btn ${queueFilter === 'in-progress' ? 'active' : ''}`}
              onClick={() => setQueueFilter('in-progress')}
            >
              In Progress <span className="queue-count">({stats.inProgress})</span>
            </button>
          </div>

          {/* Queue List */}
          <div className="queue-list">
            {filteredQueue.length === 0 ? (
              <div style={{textAlign: 'center', padding: '40px', color: '#6b7280'}}>
                No patients in this queue
              </div>
            ) : (
              filteredQueue.map(item => (
                <div key={item.id} className={`queue-item ${getStatusClass(item.status)}`}>
                  <div className="queue-info">
                    <div className="queue-token">{item.token}</div>
                    <div className="queue-details">
                      <h4>{item.name}</h4>
                      <p>
                        Time: {item.time} • Doctor: {item.doctor}
                        {item.priority === 'high' && <span className="priority-badge priority-high"> Priority</span>}
                      </p>
                    </div>
                  </div>
                  <div className="queue-actions">
                    {item.status === 'waiting' && (
                      <button className="btn btn-small btn-primary" onClick={() => handleCallPatient(item.id)}>
                        Call
                      </button>
                    )}
                    {item.status === 'in-progress' && (
                      <button className="btn btn-small btn-primary" onClick={() => handleCompletePatient(item.id)}>
                        Done
                      </button>
                    )}
                    <button className="btn btn-small btn-outline" onClick={() => handleViewDetails(item.id)}>Details</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Doctors Status & Quick Actions */}
        <div>
          {/* Doctors Status */}
          <div className="doctors-section">
            <div className="section-header">
              <div>
                <h2>Doctors Status</h2>
                <p>Current doctor availability</p>
              </div>
            </div>

            <div className="doctors-list">
              {doctorsData.map(doctor => (
                <div key={doctor.id} className="doctor-card">
                  <div className="doctor-info">
                    <div className="doctor-avatar">{doctor.name.charAt(0)}</div>
                    <div className="doctor-details">
                      <h4>{doctor.name}</h4>
                      <p>{doctor.specialty}</p>
                    </div>
                  </div>
                  <div className={`doctor-status ${getDoctorStatusClass(doctor.status)}`}>
                    <span>{doctor.status}</span>
                    <small>{doctor.patientsSeen} patients</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>

            <div className="actions-grid">
              <button 
                type="button"
                className="action-btn-large" 
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Add Patient clicked - Opening modal');
                  setShowAddPatientModal(true);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                style={{ 
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  touchAction: 'manipulation'
                }}
              >
                <i className="fas fa-user-plus" style={{ pointerEvents: 'none' }}></i>
                <span style={{ pointerEvents: 'none' }}>➕ Add Patient</span>
              </button>
              <button 
                type="button"
                className="action-btn-large" 
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Pause Queue clicked');
                  handlePauseQueue();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                style={{ 
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  touchAction: 'manipulation',
                  backgroundColor: isQueuePaused ? '#fef3c7' : '#f9fafb',
                  border: isQueuePaused ? '2px solid #f59e0b' : 'none'
                }}
              >
                <i className={`fas fa-${isQueuePaused ? 'play-circle' : 'pause-circle'}`} style={{ pointerEvents: 'none', color: isQueuePaused ? '#f59e0b' : 'inherit' }}></i>
                <span style={{ pointerEvents: 'none', color: isQueuePaused ? '#92400e' : 'inherit', fontWeight: isQueuePaused ? '700' : '600' }}>
                  {isQueuePaused ? '▶️ Resume Queue' : '⏸️ Pause Queue'}
                </span>
              </button>
              <button 
                type="button" 
                className="action-btn-large"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAlertsClick();
                }}
                style={{ cursor: 'pointer' }}
              >
                <i className="fas fa-bell" style={{ pointerEvents: 'none' }}></i>
                <span style={{ pointerEvents: 'none' }}>Alerts</span>
              </button>
              <button 
                type="button" 
                className="action-btn-large"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEmergencyClick();
                }}
                style={{ cursor: 'pointer', backgroundColor: '#fee2e2', border: '2px solid #ef4444' }}
              >
                <i className="fas fa-exclamation-triangle" style={{ pointerEvents: 'none', color: '#dc2626' }}></i>
                <span style={{ pointerEvents: 'none', color: '#991b1b', fontWeight: '700' }}>🚨 Emergency</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddPatientModal && (
        <div className="modal" style={{display: 'flex'}}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Patient</h3>
              <button className="close-modal" onClick={() => setShowAddPatientModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleAddPatient}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter patient name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Ghana Card Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="GHA-000000000-0"
                  value={formData.ghanaCard}
                  onChange={(e) => setFormData({...formData, ghanaCard: e.target.value})}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Reason for Visit</label>
                <select 
                  className="form-control"
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  required
                >
                  <option value="normal">Consultation</option>
                  <option value="checkup">Check Up</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Department</label>
                <select 
                  className="form-control"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  required
                >
                  <option value="">Choose Unit...</option>
                  <option value="General OPD">General OPD</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Maternity Wing">Maternity Wing</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Assign Doctor</label>
                <select 
                  className="form-control"
                  value={formData.doctor}
                  onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                  required
                >
                  <option value="">Select Doctor...</option>
                  {doctorsData.map(doc => (
                    <option key={doc.id} value={doc.name}>{doc.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-buttons">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddPatientModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;