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

  useEffect(() => {
    if (!user) navigate("/patient/login");
  }, []);

  useEffect(() => {
    if (view === "appointments") fetchAppointments();
  }, [view]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/appointments?patientID=${user?.patientID}`);
      setAppointments(res.data);
    } catch {
      notify("Failed to fetch appointments.");
    }
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
    } catch {
      notify("Failed to book appointment.");
    }
    setLoading(false);
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

        {/* Navbar */}
        <div className="patient-navbar">
          <h2>🏥 MedNet Patient Portal</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "1rem" }}>👤 {user?.patientName}</span>
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
            <button className={`btn-book ${view === "book" ? "active-btn" : ""}`} onClick={() => setView("book")}>
              📅 Book Appointment
            </button>
            <button className={`btn-view ${view === "appointments" ? "active-btn" : ""}`} onClick={() => setView("appointments")}>
              📋 My Appointments
            </button>
          </div>

          {/* Book Appointment */}
          {view === "book" && (
            <div className="appointment-form">
              <h3>📅 Book an Appointment</h3>
              <form onSubmit={handleBook}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="patientName" value={form.patientName} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Mobile</label>
                    <input type="text" name="mobile" value={form.mobile} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input type="number" name="age" value={form.age} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Gender</label>
                    <select name="gender" value={form.gender} onChange={handleChange} required>
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Department *</label>
                    <select name="department" value={form.department} onChange={handleChange} required>
                      <option value="">Select Department</option>
                      <option>Cardiology</option>
                      <option>Neurology</option>
                      <option>Orthopedics</option>
                      <option>Pediatrics</option>
                      <option>Dermatology</option>
                      <option>General Medicine</option>
                      <option>ENT</option>
                      <option>Ophthalmology</option>
                      <option>Gynecology</option>
                      <option>Psychiatry</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Disease / Symptoms *</label>
                    <input type="text" name="disease" placeholder="e.g. Fever, Back pain" value={form.disease} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input type="text" name="address" value={form.address} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date *</label>
                    <input type="date" name="date" value={form.date} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Time *</label>
                    <input type="time" name="time" value={form.time} onChange={handleChange} required />
                  </div>
                </div>
                <button type="submit" className="submit-btn">
                  {loading ? "Booking..." : "Book Appointment"}
                </button>
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
