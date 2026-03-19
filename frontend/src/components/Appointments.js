import React, { useState, useMemo } from 'react';

const Appointments = ({ appointmentsData = [], addAppointment }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    doctor: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    type: 'Check-up',
    status: 'pending'
  });

  // Get today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointmentsData.filter(apt => apt.date === today);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push({ day: null, hasAppointment: false });
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasAppointment = appointmentsData.some(apt => apt.date === dateStr);
      days.push({ day, hasAppointment, date: dateStr });
    }
    
    return days;
  }, [currentDate, appointmentsData]);

  const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleAddAppointment = (e) => {
    e.preventDefault();
    
    const newAppointment = {
      ...formData
    };
    
    addAppointment(newAppointment);
    setFormData({
      patientName: '',
      doctor: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      type: 'Check-up',
      status: 'pending'
    });
    setShowAddAppointmentModal(false);
    showNotification(`Added appointment for ${formData.patientName}`, 'success');
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
    <div id="appointments-section" className="content-section">
      <div className="section-header">
        <h2>Appointments Calendar</h2>
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
          <div className="date-navigation">
            <button className="btn btn-outline" onClick={handlePrevMonth}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="current-date">{monthYear}</span>
            <button className="btn btn-outline" onClick={handleNextMonth}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddAppointmentModal(true)}>
            <i className="fas fa-plus"></i> New Appointment
          </button>
        </div>
      </div>

      <div className="calendar-container">
        <div className="calendar-header">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        <div className="calendar-body">
          {calendarDays.map((dayObj, index) => (
            <div 
              key={index} 
              className={`calendar-day ${dayObj.day === null ? 'empty' : ''} ${dayObj.hasAppointment ? 'has-appointment' : ''}`}
            >
              {dayObj.day && (
                <>
                  <div className="day-number">{dayObj.day}</div>
                  {dayObj.hasAppointment && (
                    <div className="appointment-indicator" title={`${appointmentsData.filter(a => a.date === dayObj.date).length} appointment(s)`}>
                      •
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="appointments-list">
        <h3>Today's Appointments ({todaysAppointments.length})</h3>
        <div className="appointments-container">
          {todaysAppointments.length === 0 ? (
            <p style={{textAlign: 'center', color: '#6b7280', padding: '20px'}}>
              No appointments scheduled for today
            </p>
          ) : (
            todaysAppointments.map(appointment => (
              <div key={appointment.id} className="appointment-item">
                <div className="apt-time">{appointment.time}</div>
                <div className="apt-details">
                  <strong>{appointment.patientName}</strong>
                  <span>with {appointment.doctor} • {appointment.type}</span>
                </div>
                <div className={`apt-status ${appointment.status}`}>
                  {appointment.status}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showAddAppointmentModal && (
        <div className="modal" style={{display: 'flex'}}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Schedule New Appointment</h3>
              <button className="close-modal" onClick={() => setShowAddAppointmentModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleAddAppointment}>
              <div className="form-group">
                <label>Patient Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter patient name"
                  value={formData.patientName}
                  onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Doctor</label>
                <select 
                  className="form-control"
                  value={formData.doctor}
                  onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                  required
                >
                  <option value="">Select Doctor...</option>
                  <option value="Dr. Smith">Dr. Smith</option>
                  <option value="Dr. Johnson">Dr. Johnson</option>
                  <option value="Dr. Williams">Dr. Williams</option>
                  <option value="Dr. Mensah">Dr. Mensah</option>
                  <option value="Dr. Akoto">Dr. Akoto</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  className="form-control"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Time</label>
                <input 
                  type="time" 
                  className="form-control"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Type</label>
                <select 
                  className="form-control"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  required
                >
                  <option value="Check-up">Check-up</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Surgery">Surgery</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <select 
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="form-buttons">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddAppointmentModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Schedule Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;