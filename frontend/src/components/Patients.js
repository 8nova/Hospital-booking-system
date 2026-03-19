import React, { useState } from 'react';

const Patients = ({ queueData = [], addPatient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
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

  const getStatusBadge = (status) => {
    const classMap = {
      waiting: 'status-waiting',
      'in-progress': 'status-progress',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    const labelMap = {
      waiting: 'Waiting',
      'in-progress': 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    return { class: classMap[status] || '', label: labelMap[status] || status };
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
      doctor: 'Dr. Smith',
      priority: 'normal'
    });
    setShowAddPatientModal(false);
  };

  const viewPatientDetails = (patient) => {
    alert(`Patient Details:\n\nName: ${patient.name}\nGhana Card: ${patient.ghanaCard}\nPhone: ${patient.phone}\nToken: ${patient.token}\nStatus: ${patient.status}\nDepartment: ${patient.department}\nDoctor: ${patient.doctor}\nArrival Time: ${patient.time}`);
  };

  return (
    <div id="patients-section" className="content-section">
      <div className="section-header">
        <div>
          <h2>All Patients</h2>
        </div>
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddPatientModal(true)}>
            <i className="fas fa-user-plus"></i> Add Patient
          </button>
        </div>
      </div>

      <div className="patients-table-container">
        <table className="data-table">
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
                <td colSpan="8" style={{textAlign: 'center', padding: '20px', color: '#6b7280'}}>
                  {queueData.length === 0 ? 'No patients registered' : 'No patients match your search'}
                </td>
              </tr>
            ) : (
              filteredPatients.map(patient => {
                const badge = getStatusBadge(patient.status);
                return (
                  <tr key={patient.id}>
                    <td>{patient.id}</td>
                    <td>{patient.name}</td>
                    <td>{patient.ghanaCard}</td>
                    <td>{patient.phone}</td>
                    <td>{patient.department}</td>
                    <td>{patient.doctor}</td>
                    <td>
                      <span className={`status-badge ${badge.class}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-small btn-outline"
                        onClick={() => viewPatientDetails(patient)}
                        title="View Details"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button 
                        className="btn btn-small btn-outline"
                        title="Edit Patient"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button className="btn btn-outline">
          <i className="fas fa-chevron-left"></i> Previous
        </button>
        <span className="page-info">Page 1 of {Math.ceil((filteredPatients.length || 1) / 10)}</span>
        <button className="btn btn-outline">
          Next <i className="fas fa-chevron-right"></i>
        </button>
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
                  <option value="Dr. Smith">Dr. Smith</option>
                  <option value="Dr. Johnson">Dr. Johnson</option>
                  <option value="Dr. Williams">Dr. Williams</option>
                  <option value="Dr. Mensah">Dr. Mensah</option>
                  <option value="Dr. Akoto">Dr. Akoto</option>
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

export default Patients;