import { useState } from 'react';
import './Patients.css';

const Patients = ({ queueData = [], addPatient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    ghanaCard: '',
    reason: 'normal',
    department: '',
    doctor: 'Dr. Smith',
    priority: 'normal'
  });

  const filteredPatients = queueData.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.ghanaCard.includes(searchTerm) ||
    patient.phone.includes(searchTerm)
  );

  const statusConfig = {
    waiting:      { bg: '#fef3c7', color: '#92400e', label: 'Waiting' },
    'in-progress': { bg: '#dbeafe', color: '#1e40af', label: 'In Progress' },
    completed:    { bg: '#d1fae5', color: '#065f46', label: 'Completed' },
    cancelled:    { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' },
  };

  const getStatus = (status) => statusConfig[status] || { bg: '#f3f4f6', color: '#4b5563', label: status };

  const handleAddPatient = (e) => {
    e.preventDefault();
    let priority = formData.priority;
    if (formData.department === 'Emergency' || formData.reason === 'emergency') {
      priority = 'high';
    }
    addPatient({ ...formData, priority });
    setFormData({ name: '', phone: '', ghanaCard: '', reason: 'normal', department: '', doctor: 'Dr. Smith', priority: 'normal' });
    setShowAddPatientModal(false);
    showNotification('Patient added successfully!', 'success');
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      phone: patient.phone,
      ghanaCard: patient.ghanaCard,
      reason: patient.reason || 'normal',
      department: patient.department,
      doctor: patient.doctor,
      priority: patient.priority
    });
  };

  const showNotification = (message, type = 'info') => {
    const colors = { success: '#10b981', warning: '#f59e0b', error: '#ef4444', info: '#3b82f6' };
    const icons = { success: 'check-circle', warning: 'exclamation-triangle', error: 'times-circle', info: 'info-circle' };
    const el = document.createElement('div');
    el.style.cssText = `position:fixed;top:20px;right:20px;padding:14px 20px;background:${colors[type]};color:#fff;border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,.15);z-index:9999;display:flex;align-items:center;gap:10px;font-size:14px;font-weight:600;animation:slideIn .3s ease`;
    el.innerHTML = `<i class="fas fa-${icons[type]}"></i><span>${message}</span>`;
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 300); }, 3000);
  };

  const viewPatientDetails = (patient) => {
    setSelectedPatient(patient);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="patients-page">
      {/* ── Page Header ── */}
      <div className="pp-header">
        <div>
          <h2 className="pp-title">All Patients</h2>
          <p className="pp-subtitle">{queueData.length} patient{queueData.length !== 1 ? 's' : ''} registered</p>
        </div>
        <div className="pp-header-actions">
          <div className="pp-search">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by name, Ghana Card, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="pp-btn pp-btn-primary" onClick={() => setShowAddPatientModal(true)}>
            <i className="fas fa-user-plus"></i> Add Patient
          </button>
        </div>
      </div>

      {/* ── Patients Table ── */}
      <div className="pp-table-wrapper">
        <div className="pp-table-scroll">
          <table className="pp-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Ghana Card</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Doctor</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="8" className="pp-empty-row">
                    <div className="pp-empty">
                      <i className="fas fa-users pp-empty-icon"></i>
                      <p>{queueData.length === 0 ? 'No patients registered yet' : 'No patients match your search'}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentPatients.map(patient => {
                  const s = getStatus(patient.status);
                  return (
                    <tr key={patient.id}>
                      <td className="pp-id">{patient.id}</td>
                      <td className="pp-name">{patient.name}</td>
                      <td className="pp-card">{patient.ghanaCard}</td>
                      <td className="pp-phone">{patient.phone}</td>
                      <td>{patient.department}</td>
                      <td>{patient.doctor}</td>
                      <td>
                        <span className="pp-badge" style={{ background: s.bg, color: s.color }}>
                          {s.label}
                        </span>
                      </td>
                      <td>
                        <div className="pp-actions">
                          <button
                            className="pp-action-btn pp-action-view"
                            onClick={() => viewPatientDetails(patient)}
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            className="pp-action-btn pp-action-edit"
                            onClick={() => handleEditPatient(patient)}
                            title="Edit Patient"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pagination ── */}
      <div className="pp-pagination">
        <button 
          className="pp-btn pp-btn-outline" 
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        >
          <i className="fas fa-chevron-left"></i> Previous
        </button>
        <span className="pp-page-info">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button 
          className="pp-btn pp-btn-outline"
          onClick={goToNextPage}
          disabled={currentPage >= totalPages}
        >
          Next <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      {/* ── Add Patient Modal ── */}
      {showAddPatientModal && (
        <div className="pp-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAddPatientModal(false)}>
          <div className="pp-modal">
            <div className="pp-modal-header">
              <h3>Add New Patient</h3>
              <button className="pp-modal-close" onClick={() => setShowAddPatientModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleAddPatient} className="pp-form">
              <div className="pp-form-row">
                <div className="pp-form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="pp-form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+233 XX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="pp-form-group">
                <label>Ghana Card Number</label>
                <input
                  type="text"
                  placeholder="GHA-000000000-0"
                  value={formData.ghanaCard}
                  onChange={(e) => setFormData({ ...formData, ghanaCard: e.target.value })}
                  required
                />
              </div>

              <div className="pp-form-row">
                <div className="pp-form-group">
                  <label>Reason for Visit</label>
                  <select
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    required
                  >
                    <option value="normal">Consultation</option>
                    <option value="checkup">Check Up</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                <div className="pp-form-group">
                  <label>Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                  >
                    <option value="">Choose Unit...</option>
                    <option value="General OPD">General OPD</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Maternity Wing">Maternity Wing</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div className="pp-form-group">
                <label>Assign Doctor</label>
                <select
                  value={formData.doctor}
                  onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                  required
                >
                  <option value="Dr. Smith">Dr. Smith</option>
                  <option value="Dr. Johnson">Dr. Johnson</option>
                  <option value="Dr. Williams">Dr. Williams</option>
                  <option value="Dr. Mensah">Dr. Mensah</option>
                  <option value="Dr. Akoto">Dr. Akoto</option>
                </select>
              </div>

              <div className="pp-form-actions">
                <button type="button" className="pp-btn pp-btn-outline" onClick={() => setShowAddPatientModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="pp-btn pp-btn-primary">
                  <i className="fas fa-plus"></i> Add Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Patient Details Modal ── */}
      {selectedPatient && (
        <div className="pp-modal-overlay" onClick={(e) => e.target === e.currentTarget && setSelectedPatient(null)}>
          <div className="pp-modal pp-modal-details">
            <div className="pp-modal-header">
              <h3>Patient Details</h3>
              <button className="pp-modal-close" onClick={() => setSelectedPatient(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="pp-details">
              <div className="pp-detail-row">
                <span className="pp-detail-label">Name:</span>
                <span className="pp-detail-value">{selectedPatient.name}</span>
              </div>
              <div className="pp-detail-row">
                <span className="pp-detail-label">Ghana Card:</span>
                <span className="pp-detail-value">{selectedPatient.ghanaCard}</span>
              </div>
              <div className="pp-detail-row">
                <span className="pp-detail-label">Phone:</span>
                <span className="pp-detail-value">{selectedPatient.phone}</span>
              </div>
              <div className="pp-detail-row">
                <span className="pp-detail-label">Token:</span>
                <span className="pp-detail-value pp-detail-token">{selectedPatient.token}</span>
              </div>
              <div className="pp-detail-row">
                <span className="pp-detail-label">Status:</span>
                <span className="pp-badge" style={{ background: getStatus(selectedPatient.status).bg, color: getStatus(selectedPatient.status).color }}>
                  {getStatus(selectedPatient.status).label}
                </span>
              </div>
              <div className="pp-detail-row">
                <span className="pp-detail-label">Department:</span>
                <span className="pp-detail-value">{selectedPatient.department}</span>
              </div>
              <div className="pp-detail-row">
                <span className="pp-detail-label">Doctor:</span>
                <span className="pp-detail-value">{selectedPatient.doctor}</span>
              </div>
              <div className="pp-detail-row">
                <span className="pp-detail-label">Arrival Time:</span>
                <span className="pp-detail-value">{selectedPatient.time}</span>
              </div>
            </div>

            <div className="pp-form-actions">
              <button className="pp-btn pp-btn-outline" onClick={() => setSelectedPatient(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Patient Modal ── */}
      {editingPatient && (
        <div className="pp-modal-overlay" onClick={(e) => e.target === e.currentTarget && setEditingPatient(null)}>
          <div className="pp-modal">
            <div className="pp-modal-header">
              <h3>Edit Patient</h3>
              <button className="pp-modal-close" onClick={() => setEditingPatient(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              showNotification('Patient updated successfully!', 'success');
              setEditingPatient(null);
            }} className="pp-form">
              <div className="pp-form-row">
                <div className="pp-form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="pp-form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+233 XX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="pp-form-group">
                <label>Ghana Card Number</label>
                <input
                  type="text"
                  placeholder="GHA-000000000-0"
                  value={formData.ghanaCard}
                  onChange={(e) => setFormData({ ...formData, ghanaCard: e.target.value })}
                  required
                />
              </div>

              <div className="pp-form-row">
                <div className="pp-form-group">
                  <label>Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                  >
                    <option value="">Choose Unit...</option>
                    <option value="General OPD">General OPD</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Maternity Wing">Maternity Wing</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div className="pp-form-group">
                  <label>Assign Doctor</label>
                  <select
                    value={formData.doctor}
                    onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                    required
                  >
                    <option value="Dr. Smith">Dr. Smith</option>
                    <option value="Dr. Johnson">Dr. Johnson</option>
                    <option value="Dr. Williams">Dr. Williams</option>
                    <option value="Dr. Mensah">Dr. Mensah</option>
                    <option value="Dr. Akoto">Dr. Akoto</option>
                  </select>
                </div>
              </div>

              <div className="pp-form-actions">
                <button type="button" className="pp-btn pp-btn-outline" onClick={() => setEditingPatient(null)}>
                  Cancel
                </button>
                <button type="submit" className="pp-btn pp-btn-primary">
                  <i className="fas fa-save"></i> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
