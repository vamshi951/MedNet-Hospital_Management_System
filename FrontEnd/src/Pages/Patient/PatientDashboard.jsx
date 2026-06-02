import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./Patient.css";

const notify = (text) => toast(text);
const BASE_URL = process.env.REACT_APP_BASE_URL;

const PatientDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxUser = useSelector((state) => state.auth.data.user);

  const getUser = () => {
    if (reduxUser) return reduxUser;
    const stored = localStorage.getItem("patientUser");
    return stored ? JSON.parse(stored) : null;
  };

  const user = getUser();
  const [view, setView] = useState("home");
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [form, setForm] = useState({
    patientName: user?.patientName || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    address: user?.address || "",
    disease: "",
    department: "",
    date: "",
    time: "",
    age: user?.age || "",
    gender: user?.gender || ""
  });

  const departments = [
    "Cardiology", "Neurology", "Orthopedics", "Pediatrics",
    "Dermatology", "General Medicine", "ENT", "Ophthalmology",
    "Gynecology", "Psychiatry", "Anesthesiologist", "Oncologist"
  ];

  useEffect(() => { if (!user) navigate("/patient/login"); }, []);
  useEffect(() => { if (view === "appointments") fetchAppointments(); }, [view]);
  useEffect(() => { if (view === "doctors") fetchDoctors(); }, [view]);

  useEffect(() => {
    if (selectedDept) {
      setFilteredDoctors(doctors.filter(d =>
        d.department?.toLowerCase().includes(selectedDept.toLowerCase())
      ));
    } else {
      setFilteredDoctors(doctors);
    }
  }, [selectedDept, doctors]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/appointments?patientID=${user?.patientID}`);
      setAppointments(res.data);
    } catch { notify("Failed to fetch appointments."); }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/doctors`);
      const data = res.data.doctors || res.data;
      setDoctors(data);
      setFilteredDoctors(data);
    } catch { notify("Failed to fetch doctors."); }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!form.disease || !form.department || !form.date || !form.time)
      return notify("Please fill all required fields");
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/appointments/create`, {
        ...form,
        patientID: user.patientID,
        mobile: Number(form.mobile),
        age: Number(form.age)
      });
      notify("Appointment booked! ✅");
      setView("appointments");
    } catch { notify("Failed to book appointment."); }
    setLoading(false);
  };

  const handleBookWithDoctor = (doctor) => {
    setForm(f => ({ ...f, department: doctor.department }));
    setSelectedDoctor(doctor);
    setView("book");
  };

  const handleLogout = () => {
    localStorage.removeItem("patientUser");
    localStorage.removeItem("token");
    dispatch({ type: "AUTH_LOGOUT" });
    navigate("/patient/login");
  };

  return (
    <>
      <ToastContainer />
      <div className="patient-dashboard">
        <div className="patient-navbar">
          <h2>🏥 MedNet Patient Portal</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span>👤 {user?.patientName}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div className="patient-content">
          {/* Profile Card */}
          <div className="patient-welcome">
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h3>👤 {user?.patientName}</h3>
                <p>🆔 Patient ID: <strong>{user?.patientID}</strong></p>
                <p>📧 {user?.email}</p>
                <p>📞 {user?.mobile}</p>
              </div>
              <div>
                <p>🩸 Blood Group: <strong>{user?.bloodGroup || "N/A"}</strong></p>
                <p>🎂 DOB: {user?.DOB || "N/A"}</p>
                <p>⚧ Gender: {user?.gender || "N/A"}</p>
                <p>📍 {user?.address || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="patient-actions">
            <button className={`btn-book ${view === "doctors" ? "active-btn" : ""}`} onClick={() => setView("doctors")}>
              👨‍⚕️ Find a Doctor
            </button>
            <button className={`btn-book ${view === "book" ? "active-btn" : ""}`} onClick={() => { setSelectedDoctor(null); setView("book"); }}>
              📅 Book Appointment
            </button>
            <button className={`btn-view ${view === "appointments" ? "active-btn" : ""}`} onClick={() => setView("appointments")}>
              📋 My Appointments
            </button>
          </div>

          {/* Find a Doctor */}
          {view === "doctors" && (
            <div className="appointments-list">
              <h3>👨‍⚕️ Find a Doctor</h3>

              {/* Department Filter */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ fontWeight: "bold", marginBottom: "0.5rem", display: "block" }}>Filter by Department:</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  <button
                    onClick={() => setSelectedDept("")}
                    style={{
                      padding: "0.4rem 1rem", borderRadius: "2rem", border: "2px solid rgba(244,133,133,0.874)",
                      background: !selectedDept ? "rgba(244,133,133,0.874)" : "white",
                      color: !selectedDept ? "white" : "rgba(244,133,133,0.874)",
                      cursor: "pointer", fontWeight: "bold", fontSize: "0.85rem"
                    }}
                  >All</button>
                  {departments.map((dept, i) => (
                    <button key={i} onClick={() => setSelectedDept(dept)}
                      style={{
                        padding: "0.4rem 1rem", borderRadius: "2rem", border: "2px solid rgba(244,133,133,0.874)",
                        background: selectedDept === dept ? "rgba(244,133,133,0.874)" : "white",
                        color: selectedDept === dept ? "white" : "rgba(244,133,133,0.874)",
                        cursor: "pointer", fontWeight: "bold", fontSize: "0.85rem"
                      }}
                    >{dept}</button>
                  ))}
                </div>
              </div>

              {/* Doctor Cards */}
              {filteredDoctors.length === 0 ? (
                <p className="no-appointments">No doctors found for this department.</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                  {filteredDoctors.map((doc, i) => (
                    <div key={i} style={{
                      background: "white", borderRadius: "12px", padding: "1.5rem",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
                      borderTop: "4px solid rgba(244,133,133,0.874)"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                        <img
                          src={doc.image || "https://res.cloudinary.com/diverse/image/upload/v1674562453/diverse/oipm1ecb1yudf9eln7az.jpg"}
                          alt={doc.docName}
                          style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(244,133,133,0.4)" }}
                        />
                        <div>
                          <h4 style={{ margin: 0, color: "#333" }}>Dr. {doc.docName}</h4>
                          <span style={{
                            background: "rgba(255,243,243,0.874)", color: "rgba(244,100,100,0.9)",
                            padding: "2px 10px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "bold"
                          }}>{doc.department}</span>
                        </div>
                      </div>
                      <p style={{ margin: "4px 0", color: "#666", fontSize: "0.9rem" }}>🎓 {doc.education}</p>
                      <p style={{ margin: "4px 0", color: "#666", fontSize: "0.9rem" }}>⚧ {doc.gender}</p>
                      <p style={{ margin: "4px 0", color: "#666", fontSize: "0.9rem" }}>📞 {doc.mobile}</p>
                      <p style={{ margin: "4px 0", color: "#666", fontSize: "0.9rem" }}>📧 {doc.email}</p>
                      {doc.details && <p style={{ margin: "8px 0 0", color: "#888", fontSize: "0.85rem", fontStyle: "italic" }}>"{doc.details}"</p>}
                      <button
                        onClick={() => handleBookWithDoctor(doc)}
                        style={{
                          width: "100%", marginTop: "1rem", padding: "0.6rem",
                          background: "rgba(244,133,133,0.874)", color: "white",
                          border: "none", borderRadius: "2rem", fontWeight: "bold",
                          cursor: "pointer", fontSize: "0.95rem"
                        }}
                      >📅 Book Appointment</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Book Appointment */}
          {view === "book" && (
            <div className="appointment-form">
              <h3>📅 Book an Appointment {selectedDoctor ? `with Dr. ${selectedDoctor.docName}` : ""}</h3>

              {selectedDoctor && (
                <div style={{
                  background: "rgba(255,243,243,0.874)", borderRadius: "10px",
                  padding: "1rem", marginBottom: "1.5rem",
                  display: "flex", alignItems: "center", gap: "1rem"
                }}>
                  <img src={selectedDoctor.image} alt={selectedDoctor.docName}
                    style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }} />
                  <div>
                    <strong>Dr. {selectedDoctor.docName}</strong>
                    <p style={{ margin: 0, color: "#888", fontSize: "0.9rem" }}>{selectedDoctor.department} • {selectedDoctor.education}</p>
                  </div>
                  <button onClick={() => setSelectedDoctor(null)}
                    style={{ marginLeft: "auto", background: "none", border: "none", color: "#ff6b6b", cursor: "pointer", fontSize: "1.2rem" }}>✕</button>
                </div>
              )}

              <form onSubmit={handleBook}>
                <div className="form-row">
                  <div className="form-group"><label>Full Name</label><input type="text" name="patientName" value={form.patientName} onChange={handleChange} required /></div>
                  <div className="form-group"><label>Email</label><input type="email" name="email" value={form.email} onChange={handleChange} required /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Mobile</label><input type="text" name="mobile" value={form.mobile} onChange={handleChange} required /></div>
                  <div className="form-group"><label>Age</label><input type="number" name="age" value={form.age} onChange={handleChange} required /></div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Gender</label>
                    <select name="gender" value={form.gender} onChange={handleChange} required>
                      <option value="">Select</option>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Department *</label>
                    <select name="department" value={form.department} onChange={handleChange} required>
                      <option value="">Select Department</option>
                      {departments.map((d, i) => <option key={i}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Disease / Symptoms *</label><input type="text" name="disease" placeholder="e.g. Fever, Back pain" value={form.disease} onChange={handleChange} required /></div>
                  <div className="form-group"><label>Address</label><input type="text" name="address" value={form.address} onChange={handleChange} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Date *</label><input type="date" name="date" value={form.date} onChange={handleChange} required /></div>
                  <div className="form-group"><label>Time *</label><input type="time" name="time" value={form.time} onChange={handleChange} required /></div>
                </div>
                <button type="submit" className="submit-btn">{loading ? "Booking..." : "Book Appointment"}</button>
              </form>
            </div>
          )}

          {/* View Appointments */}
          {view === "appointments" && (
            <div className="appointments-list">
              <h3>📋 My Appointments</h3>
              {appointments.length === 0 ? (
                <p className="no-appointments">No appointments found. Book one now!</p>
              ) : (
                appointments.map((a, i) => (
                  <div className="appointment-card" key={i}>
                    <h4>🏥 {a.department}</h4>
                    <p>📅 Date: <strong>{a.date}</strong> &nbsp;|&nbsp; ⏰ Time: <strong>{a.time}</strong></p>
                    <p>🤒 Symptoms: {a.disease}</p>
                    <p>📞 {a.mobile} &nbsp;|&nbsp; 🩺 Age: {a.age} &nbsp;|&nbsp; ⚧ {a.gender}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PatientDashboard;
