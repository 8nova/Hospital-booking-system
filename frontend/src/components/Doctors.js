import { useState } from 'react';

const Doctors = ({ doctorsData = [], addDoctor }) => {
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [viewingSchedule, setViewingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialty: 'General',
    phone: '',
    email: '',
    status: 'active'
  });

  const statusConfig = {
    active:   { bg: '#d1fae5', color: '#065f46', label: 'Active' },
    busy:     { bg: '#fef3c7', color: '#92400e', label: 'Busy' },
    'on-break': { bg: '#e0e7ff', color: '#3730a3', label: 'On Break' },
    inactive: { bg: '#f3f4f6', color: '#4b5563', label: 'Inactive' },
    vacation: { bg: '#fce7f3', color: '#9d174d', label: 'On Vacation' },
  };

  const getStatus = (status) => statusConfig[status] || { bg: '#f3f4f6', color: '#4b5563', label: status };

  const showNotification = (message, type = 'info') => {
    const colors = { success: '#10b981', warning: '#f59e0b', error: '#ef4444', info: '#3b82f6' };
    const icons  = { success: 'check-circle', warning: 'exclamation-triangle', error: 'times-circle', info: 'info-circle' };
    const el = document.createElement('div');
    el.style.cssText = `position:fixed;top:20px;right:20px;padding:14px 20px;background:${colors[type]};color:#fff;border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,.15);z-index:9999;display:flex;align-items:center;gap:10px;font-size:14px;font-weight:600;animation:slideIn .3s ease`;
    el.innerHTML = `<i class="fas fa-${icons[type]}"></i><span>${message}</span>`;
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 300); }, 3000);
  };

  const handleAddDoctor = (e) => {
    e.preventDefault();
    addDoctor({ ...formData });
    setFormData({ name: '', specialty: 'General', phone: '', email: '', status: 'active' });
    setShowAddDoctorModal(false);
    showNotification(`Dr. ${formData.name} added successfully`, 'success');
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      phone: doctor.phone,
      email: doctor.email,
      status: doctor.status
    });
  };

  const handleViewSchedule = (doctor) => {
    setViewingSchedule(doctor);
    showNotification(`Viewing schedule for ${doctor.name}`, 'info');
  };

  return (
    <div className="doctors-page">
      {/* ── Page Header ── */}
      <div className="dp-header">
        <div>
          <h2 className="dp-title">Doctors Management</h2>
          <p className="dp-subtitle">{doctorsData.length} doctor{doctorsData.length !== 1 ? 's' : ''} registered</p>
        </div>
        <button className="dp-btn dp-btn-primary" onClick={() => setShowAddDoctorModal(true)}>
          <i className="fas fa-user-md"></i> Add Doctor
        </button>
      </div>

      {/* ── Doctors Grid ── */}
      <div className="dp-grid">
        {doctorsData.length === 0 ? (
          <div className="dp-empty">
            <i className="fas fa-user-md dp-empty-icon"></i>
            <p>No doctors registered yet.</p>
            <button className="dp-btn dp-btn-primary" onClick={() => setShowAddDoctorModal(true)}>
              Add your first doctor
            </button>
          </div>
        ) : (
          doctorsData.map(doctor => {
            const s = getStatus(doctor.status);
            return (
              <div key={doctor.id} className="dp-card">
                <div className="dp-card-top">
                  <div className="dp-avatar">{doctor.name.charAt(0).toUpperCase()}</div>
                  <div className="dp-card-info">
                    <h3 className="dp-card-name">{doctor.name}</h3>
                    <p className="dp-card-specialty">{doctor.specialty}</p>
                    <span className="dp-badge" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                  </div>
                </div>

                <div className="dp-card-body">
                  <div className="dp-detail">
                    <i className="fas fa-phone"></i>
                    <span>{doctor.phone || '—'}</span>
                  </div>
                  <div className="dp-detail">
                    <i className="fas fa-envelope"></i>
                    <span>{doctor.email || '—'}</span>
                  </div>
                  <div className="dp-detail">
                    <i className="fas fa-users"></i>
                    <span>{doctor.patientsSeen ?? 0} patients today</span>
                  </div>
                  {doctor.currentPatient && (
                    <div className="dp-detail">
                      <i className="fas fa-user-clock"></i>
                      <span>Now: {doctor.currentPatient}</span>
                    </div>
                  )}
                </div>

                <div className="dp-card-footer">
                  <button className="dp-btn dp-btn-outline dp-btn-sm" onClick={() => handleEditDoctor(doctor)}>
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button className="dp-btn dp-btn-outline dp-btn-sm" onClick={() => handleViewSchedule(doctor)}>
                    <i className="fas fa-calendar"></i> Schedule
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Weekly Schedule ── */}
      <div className="dp-schedule">
        <h3 className="dp-schedule-title">Weekly Schedule</h3>
        <div className="dp-schedule-scroll">
          <table className="dp-schedule-table">
            <thead>
              <tr>
                {['Time', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                  <th key={d}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { time: '9:00 AM',  slots: ['Dr. Smith', 'Dr. Johnson', 'Dr. Smith', 'Dr. Williams', 'Dr. Smith', '—'] },
                { time: '2:00 PM',  slots: ['Dr. Williams', 'Dr. Smith', 'Dr. Johnson', 'Dr. Smith', 'Dr. Williams', '—'] },
              ].map(row => (
                <tr key={row.time}>
                  <td className="dp-time-cell">{row.time}</td>
                  {row.slots.map((s, i) => (
                    <td key={i} className={s === '—' ? 'dp-slot dp-slot-empty' : 'dp-slot'}>{s}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Doctor Modal ── */}
      {showAddDoctorModal && (
        <div className="dp-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAddDoctorModal(false)}>
          <div className="dp-modal">
            <div className="dp-modal-header">
              <h3>Add New Doctor</h3>
              <button className="dp-modal-close" onClick={() => setShowAddDoctorModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="dp-form">
              {[
                { label: 'Full Name',     key: 'name',  type: 'text',  placeholder: 'Dr. John Smith' },
                { label: 'Phone Number',  key: 'phone', type: 'tel',   placeholder: '+1 (555) 000-0000' },
                { label: 'Email Address', key: 'email', type: 'email', placeholder: 'doctor@hospital.com' },
              ].map(({ label, key, type, placeholder }) => (
                <div className="dp-form-group" key={key}>
                  <label>{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    required
                  />
                </div>
              ))}

              <div className="dp-form-row">
                <div className="dp-form-group">
                  <label>Specialty</label>
                  <select value={formData.specialty} onChange={(e) => setFormData({ ...formData, specialty: e.target.value })} required>
                    {['General', 'Pediatrics', 'Maternity', 'Emergency', 'Surgery'].map(s => (
                      <option key={s} value={s}>{s === 'General' ? 'General Physician' : s}</option>
                    ))}
                  </select>
                </div>
                <div className="dp-form-group">
                  <label>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} required>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on-break">On Break</option>
                    <option value="vacation">On Vacation</option>
                  </select>
                </div>
              </div>

              <div className="dp-form-actions">
                <button type="button" className="dp-btn dp-btn-outline" onClick={() => setShowAddDoctorModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="dp-btn dp-btn-primary">
                  <i className="fas fa-plus"></i> Add Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Doctor Modal ── */}
      {editingDoctor && (
        <div className="dp-modal-overlay" onClick={(e) => e.target === e.currentTarget && setEditingDoctor(null)}>
          <div className="dp-modal">
            <div className="dp-modal-header">
              <h3>Edit Doctor</h3>
              <button className="dp-modal-close" onClick={() => setEditingDoctor(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              showNotification(`Dr. ${formData.name} updated successfully`, 'success');
              setEditingDoctor(null);
            }} className="dp-form">
              {[
                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Dr. John Smith' },
                { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+1 (555) 000-0000' },
                { label: 'Email Address', key: 'email', type: 'email', placeholder: 'doctor@hospital.com' },
              ].map(({ label, key, type, placeholder }) => (
                <div className="dp-form-group" key={key}>
                  <label>{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    required
                  />
                </div>
              ))}

              <div className="dp-form-row">
                <div className="dp-form-group">
                  <label>Specialty</label>
                  <select value={formData.specialty} onChange={(e) => setFormData({ ...formData, specialty: e.target.value })} required>
                    {['General', 'Pediatrics', 'Maternity', 'Emergency', 'Surgery'].map(s => (
                      <option key={s} value={s}>{s === 'General' ? 'General Physician' : s}</option>
                    ))}
                  </select>
                </div>
                <div className="dp-form-group">
                  <label>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} required>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on-break">On Break</option>
                    <option value="vacation">On Vacation</option>
                  </select>
                </div>
              </div>

              <div className="dp-form-actions">
                <button type="button" className="dp-btn dp-btn-outline" onClick={() => setEditingDoctor(null)}>
                  Cancel
                </button>
                <button type="submit" className="dp-btn dp-btn-primary">
                  <i className="fas fa-save"></i> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Schedule Modal ── */}
      {viewingSchedule && (
        <div className="dp-modal-overlay" onClick={(e) => e.target === e.currentTarget && setViewingSchedule(null)}>
          <div className="dp-modal dp-modal-schedule">
            <div className="dp-modal-header">
              <h3>{viewingSchedule.name} - Weekly Schedule</h3>
              <button className="dp-modal-close" onClick={() => setViewingSchedule(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="dp-schedule-content">
              <table className="dp-schedule-table">
                <thead>
                  <tr>
                    {['Time', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                      <th key={d}>{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { time: '9:00 AM', slots: ['Available', 'Available', 'Available', 'Available', 'Available', 'Off'] },
                    { time: '11:00 AM', slots: ['Available', 'Available', 'Available', 'Available', 'Available', 'Off'] },
                    { time: '2:00 PM', slots: ['Available', 'Available', 'Available', 'Available', 'Available', 'Off'] },
                    { time: '4:00 PM', slots: ['Available', 'Available', 'Available', 'Available', 'Available', 'Off'] },
                  ].map(row => (
                    <tr key={row.time}>
                      <td className="dp-time-cell">{row.time}</td>
                      {row.slots.map((s, i) => (
                        <td key={i} className={s === 'Off' ? 'dp-slot dp-slot-empty' : 'dp-slot'}>{s}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="dp-form-actions">
              <button className="dp-btn dp-btn-outline" onClick={() => setViewingSchedule(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* ── Layout ── */
        .doctors-page { padding: 0; }

        .dp-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          padding: 24px 28px;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,.06);
        }
        .dp-title  { font-size: 22px; font-weight: 700; color: #1f2937; margin: 0 0 4px; }
        .dp-subtitle { font-size: 13px; color: #6b7280; margin: 0; }

        /* ── Buttons ── */
        .dp-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 18px; border-radius: 8px; border: none;
          font-size: 14px; font-weight: 600; cursor: pointer;
          transition: all .2s;
        }
        .dp-btn-primary  { background: #2563eb; color: #fff; }
        .dp-btn-primary:hover  { background: #1d4ed8; }
        .dp-btn-outline  { background: transparent; color: #2563eb; border: 1.5px solid #2563eb; }
        .dp-btn-outline:hover  { background: #dbeafe; }
        .dp-btn-sm { padding: 7px 13px; font-size: 13px; }

        /* ── Doctors Grid ── */
        .dp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 28px;
        }

        /* ── Empty State ── */
        .dp-empty {
          grid-column: 1 / -1;
          display: flex; flex-direction: column; align-items: center;
          gap: 14px; padding: 60px 20px;
          background: #fff; border-radius: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,.06);
          color: #6b7280; text-align: center;
        }
        .dp-empty-icon { font-size: 48px; color: #d1d5db; }
        .dp-empty p { font-size: 15px; margin: 0; }

        /* ── Doctor Card ── */
        .dp-card {
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,.06);
          overflow: hidden;
          display: flex; flex-direction: column;
          transition: transform .2s, box-shadow .2s;
        }
        .dp-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,.1); }

        .dp-card-top {
          display: flex; align-items: center; gap: 14px;
          padding: 20px 20px 16px;
          border-bottom: 1px solid #f3f4f6;
        }
        .dp-avatar {
          width: 56px; height: 56px; border-radius: 50%;
          background: #dbeafe; color: #2563eb;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; font-weight: 700; flex-shrink: 0;
        }
        .dp-card-name     { font-size: 16px; font-weight: 700; color: #1f2937; margin: 0 0 3px; }
        .dp-card-specialty { font-size: 13px; color: #6b7280; margin: 0 0 8px; }
        .dp-badge {
          display: inline-block; padding: 3px 10px;
          border-radius: 20px; font-size: 11px; font-weight: 600;
        }

        .dp-card-body {
          padding: 14px 20px;
          display: flex; flex-direction: column; gap: 8px;
          flex: 1;
        }
        .dp-detail {
          display: flex; align-items: center; gap: 10px;
          font-size: 13px; color: #4b5563;
        }
        .dp-detail i { width: 16px; color: #2563eb; font-size: 13px; flex-shrink: 0; }

        .dp-card-footer {
          display: flex; gap: 10px;
          padding: 14px 20px;
          border-top: 1px solid #f3f4f6;
          background: #fafafa;
        }
        .dp-card-footer .dp-btn { flex: 1; justify-content: center; }

        /* ── Schedule ── */
        .dp-schedule {
          background: #fff;
          border-radius: 14px;
          padding: 24px 28px;
          box-shadow: 0 2px 8px rgba(0,0,0,.06);
          margin-bottom: 28px;
        }
        .dp-schedule-title { font-size: 17px; font-weight: 700; color: #1f2937; margin: 0 0 18px; }
        .dp-schedule-scroll { overflow-x: auto; }

        .dp-schedule-table {
          width: 100%; border-collapse: collapse; min-width: 600px;
        }
        .dp-schedule-table th {
          background: #f9fafb; padding: 12px 16px;
          text-align: left; font-size: 13px; font-weight: 600;
          color: #374151; border-bottom: 2px solid #e5e7eb;
          white-space: nowrap;
        }
        .dp-schedule-table td { padding: 12px 16px; border-bottom: 1px solid #f3f4f6; }
        .dp-schedule-table tr:last-child td { border-bottom: none; }
        .dp-schedule-table tr:hover td { background: #f9fafb; }

        .dp-time-cell { font-weight: 600; color: #2563eb; white-space: nowrap; }
        .dp-slot { font-size: 13px; color: #374151; }
        .dp-slot-empty { color: #d1d5db; }

        /* ── Modal ── */
        .dp-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,.45);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 20px;
        }
        .dp-modal {
          background: #fff; border-radius: 16px;
          width: 100%; max-width: 520px;
          box-shadow: 0 20px 60px rgba(0,0,0,.2);
          overflow: hidden;
          animation: dpFadeUp .25s ease;
        }
        @keyframes dpFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dp-modal-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #f3f4f6;
        }
        .dp-modal-header h3 { font-size: 18px; font-weight: 700; color: #1f2937; margin: 0; }
        .dp-modal-close {
          background: none; border: none; cursor: pointer;
          color: #9ca3af; font-size: 16px; padding: 4px;
          border-radius: 6px; transition: color .2s, background .2s;
        }
        .dp-modal-close:hover { color: #ef4444; background: #fee2e2; }

        /* ── Form ── */
        .dp-form { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
        .dp-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .dp-form-group { display: flex; flex-direction: column; gap: 6px; }
        .dp-form-group label { font-size: 13px; font-weight: 600; color: #374151; }
        .dp-form-group input,
        .dp-form-group select {
          padding: 10px 14px; border-radius: 8px;
          border: 1.5px solid #e5e7eb; font-size: 14px; color: #1f2937;
          transition: border-color .2s, box-shadow .2s;
          outline: none;
        }
        .dp-form-group input:focus,
        .dp-form-group select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,.12);
        }
        .dp-form-actions {
          display: flex; justify-content: flex-end; gap: 12px;
          padding-top: 8px; border-top: 1px solid #f3f4f6;
        }

        @media (max-width: 640px) {
          .dp-header { flex-direction: column; align-items: flex-start; gap: 14px; }
          .dp-form-row { grid-template-columns: 1fr; }
          .dp-btn { width: 100%; justify-content: center; }
        }

        @media (max-width: 768px) {
          .dp-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 16px;
          }
          
          .dp-schedule-scroll {
            overflow-x: auto;
          }
          
          .dp-schedule-table {
            min-width: 600px;
          }
          
          .dp-modal {
            max-width: 95%;
            margin: 10px;
          }
          
          .dp-modal-schedule {
            max-width: 95%;
          }
          
          .dp-schedule-content {
            overflow-x: auto;
          }
        }

        @media (max-width: 480px) {
          .dp-title { font-size: 18px; }
          .dp-subtitle { font-size: 12px; }
          
          .dp-grid {
            grid-template-columns: 1fr;
          }
          
          .dp-card-name { font-size: 15px; }
          .dp-card-specialty { font-size: 12px; }
          
          .dp-avatar {
            width: 48px;
            height: 48px;
            font-size: 20px;
          }
          
          .dp-detail {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default Doctors;
