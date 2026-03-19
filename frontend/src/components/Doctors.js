import React, { useState } from 'react';

const Doctors = ({ doctorsData = [], addDoctor }) => {
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialty: 'General',
    phone: '',
    email: '',
    status: 'active'
  });

  const getStatusBadge = (status) => {
    const statusMap = {
      'active': { class: 'status-active', label: 'Active' },
      'busy': { class: 'status-busy', label: 'Busy' },
      'on-break': { class: 'status-onbreak', label: 'On Break' },
      'inactive': { class: 'status-inactive', label: 'Inactive' },
      'vacation': { class: 'status-vacation', label: 'On Vacation' }
    };
    return statusMap[status] || { class: '', label: status };
  };

  const handleAddDoctor = (e) => {
    e.preventDefault();
    
    const newDoctor = {
      ...formData
    };
    
    addDoctor(newDoctor);
    setFormData({
      name: '',
      specialty: 'General',
      phone: '',
      email: '',
      status: 'active'
    });
    setShowAddDoctorModal(false);
    showNotification(`Added doctor ${formData.name}`, 'success');
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
    <div id="doctors-section" className="content-section">
      <div className="section-header">
        <h2>Doctors Management</h2>
        <button className="btn btn-primary" onClick={() => setShowAddDoctorModal(true)}>
          <i className="fas fa-user-md"></i> Add Doctor
        </button>
      </div>

      <div className="doctors-grid">
        {doctorsData.length === 0 ? (
          <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#6b7280'}}>
            No doctors registered. Click "Add Doctor" to get started.
          </div>
        ) : (
          doctorsData.map(doctor => {
            const badge = getStatusBadge(doctor.status);
            return (
              <div key={doctor.id} className="doctor-card-full">
                <div className="doctor-header">
                  <div className="doctor-avatar-large">{doctor.name.charAt(0)}</div>
                  <div className="doctor-info-main">
                    <h3>{doctor.name}</h3>
                    <p className="specialty">{doctor.specialty}</p>
                    <span className={`status-badge ${badge.class}`}>{badge.label}</span>
                  </div>
                </div>
                <div className="doctor-details">
                  <div className="detail-item">
                    <i className="fas fa-phone"></i>
                    <span>{doctor.phone}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-envelope"></i>
                    <span>{doctor.email}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-users"></i>
                    <span>{doctor.patientsSeen} patients today</span>
                  </div>
                  {doctor.currentPatient && (
                    <div className="detail-item">
                      <i className="fas fa-user-clock"></i>
                      <span>Current: {doctor.currentPatient}</span>
                    </div>
                  )}
                </div>
                <div className="doctor-actions">
                  <button className="btn btn-small btn-outline" title="Edit Doctor">
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button className="btn btn-small btn-outline" title="View Schedule">
                    <i className="fas fa-calendar"></i> Schedule
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="doctors-schedule">
        <h3>Weekly Schedule</h3>
        <div className="schedule-table">
          <div className="schedule-header">
            <div>Time</div>
            <div>Monday</div>
            <div>Tuesday</div>
            <div>Wednesday</div>
            <div>Thursday</div>
            <div>Friday</div>
            <div>Saturday</div>
          </div>
          <div className="schedule-body">
            <div className="time-slot">
              <div className="time">9:00 AM</div>
              <div className="slot">Dr. Smith</div>
              <div className="slot">Dr. Johnson</div>
              <div className="slot">Dr. Smith</div>
              <div className="slot">Dr. Williams</div>
              <div className="slot">Dr. Smith</div>
              <div className="slot">-</div>
            </div>
            <div className="time-slot">
              <div className="time">2:00 PM</div>
              <div className="slot">Dr. Williams</div>
              <div className="slot">Dr. Smith</div>
              <div className="slot">Dr. Johnson</div>
              <div className="slot">Dr. Smith</div>
              <div className="slot">Dr. Williams</div>
              <div className="slot">-</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showAddDoctorModal && (
        <div className="modal" style={{display: 'flex'}}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Doctor</h3>
              <button className="close-modal" onClick={() => setShowAddDoctorModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleAddDoctor}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter doctor name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Specialty</label>
                <select 
                  className="form-control"
                  value={formData.specialty}
                  onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                  required
                >
                  <option value="General">General Physician</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Maternity">Maternity</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Surgery">Surgery</option>
                </select>
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
                <label>Email Address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <select 
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on-break">On Break</option>
                  <option value="vacation">On Vacation</option>
                </select>
              </div>
              
              <div className="form-buttons">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddDoctorModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;