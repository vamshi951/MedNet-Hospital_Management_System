import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./Patient.css";

const notify = (text) => toast(text);
const BASE_URL = process.env.REACT_APP_BASE_URL;

const PatientLogin = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ patientID: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ patientName: "", email: "", password: "", mobile: "", age: "", gender: "", bloodGroup: "", DOB: "", address: "" });

  const handleLoginChange = (e) => setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  const handleRegisterChange = (e) => setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.patientID || !loginForm.password) return notify("Please fill all fields");
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/patients/login`, { ...loginForm, patientID: Number(loginForm.patientID) });
      if (res.data.message === "Login Successful.") {
        dispatch({ type: "LOGIN_PATIENT_SUCCESS", payload: { message: res.data.message, user: res.data.user, token: res.data.token } });
        localStorage.setItem("token", res.data.token);
        notify("Login Successful!");
        navigate("/patient/dashboard");
      } else {
        notify(res.data.message || "Wrong credentials");
      }
    } catch (err) {
      notify("Something went wrong.");
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerForm.patientName || !registerForm.email || !registerForm.password) return notify("Please fill all required fields");
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/patients/register`, { ...registerForm, mobile: Number(registerForm.mobile), age: Number(registerForm.age), patientID: Math.floor(Math.random() * 90000) + 10000 });
      if (res.data.id) {
        notify(`Registered! Your Patient ID is: ${res.data.id}`);
        setTimeout(() => setIsRegister(false), 2000);
      } else {
        notify(res.data.message || "Registration failed");
      }
    } catch (err) {
      notify("Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <>
      <ToastContainer />
      <div className="patient-main">
        <div className="patient-left">
          <div className="patient-hero-text">
            <h1>MedNet</h1>
            <p>Your health, our priority.</p>
            <ul>
              <li>✅ Book appointments easily</li>
              <li>✅ View your medical history</li>
              <li>✅ Track your appointments</li>
            </ul>
          </div>
        </div>
        <div className="patient-right">
          <div className="patient-card">
            <div className="patient-tabs">
              <button className={!isRegister ? "active" : ""} onClick={() => setIsRegister(false)}>Login</button>
              <button className={isRegister ? "active" : ""} onClick={() => setIsRegister(true)}>Register</button>
            </div>
            {!isRegister ? (
              <>
                <h2>Patient Login</h2>
                <form onSubmit={handleLogin}>
                  <label>Patient ID</label>
                  <input type="text" name="patientID" placeholder="Enter your Patient ID" value={loginForm.patientID} onChange={handleLoginChange} required />
                  <label>Password</label>
                  <input type="password" name="password" placeholder="Enter your password" value={loginForm.password} onChange={handleLoginChange} required />
                  <button type="submit">{loading ? "Loading..." : "Login"}</button>
                </form>
                <p className="switch-text">Don't have an account? <span onClick={() => setIsRegister(true)}>Register here</span></p>
                <p className="back-link"><Link to="/">← Back to Staff Login</Link></p>
              </>
            ) : (
              <>
                <h2>Patient Register</h2>
                <form onSubmit={handleRegister}>
                  <label>Full Name *</label>
                  <input type="text" name="patientName" placeholder="Full Name" value={registerForm.patientName} onChange={handleRegisterChange} required />
                  <label>Email *</label>
                  <input type="email" name="email" placeholder="Email" value={registerForm.email} onChange={handleRegisterChange} required />
                  <label>Password *</label>
                  <input type="password" name="password" placeholder="Password" value={registerForm.password} onChange={handleRegisterChange} required />
                  <label>Mobile</label>
                  <input type="text" name="mobile" placeholder="Mobile Number" value={registerForm.mobile} onChange={handleRegisterChange} />
                  <label>Age</label>
                  <input type="number" name="age" placeholder="Age" value={registerForm.age} onChange={handleRegisterChange} />
                  <label>Gender</label>
                  <select name="gender" value={registerForm.gender} onChange={handleRegisterChange}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <label>Blood Group</label>
                  <select name="bloodGroup" value={registerForm.bloodGroup} onChange={handleRegisterChange}>
                    <option value="">Select Blood Group</option>
                    {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                  <label>Date of Birth</label>
                  <input type="date" name="DOB" value={registerForm.DOB} onChange={handleRegisterChange} />
                  <label>Address</label>
                  <input type="text" name="address" placeholder="Address" value={registerForm.address} onChange={handleRegisterChange} />
                  <button type="submit">{loading ? "Loading..." : "Register"}</button>
                </form>
                <p className="switch-text">Already have an account? <span onClick={() => setIsRegister(false)}>Login here</span></p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientLogin;
