import React, { useState, useEffect } from "react";
import Sidebar from "../../GlobalFiles/Sidebar";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const notify = (text) => toast(text);
const BASE_URL = process.env.REACT_APP_BASE_URL;

const ViewAll = () => {
  const { data } = useSelector((store) => store.auth);
  const [activeTab, setActiveTab] = useState("doctors");
  const [doctors, setDoctors] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [d, n, p] = await Promise.all([
        axios.get(`${BASE_URL}/doctors`),
        axios.get(`${BASE_URL}/nurses`),
        axios.get(`${BASE_URL}/patients`),
      ]);
      setDoctors(d.data.doctors || d.data);
      setNurses(n.data.nurses || n.data);
      setPatients(p.data.patients || p.data);
    } catch {
      notify("Failed to fetch data.");
    }
    setLoading(false);
  };

  const handleDelete = async (type, id, name) => {
    setConfirmDelete({ type, id, name });
  };

  const confirmDeleteAction = async () => {
    const { type, id } = confirmDelete;
    try {
      await axios.delete(`${BASE_URL}/${type}/${id}`);
      notify(`✅ Deleted successfully!`);
      setConfirmDelete(null);
      fetchAll();
    } catch {
      notify("Failed to delete. Please try again.");
      setConfirmDelete(null);
    }
  };

  if (data?.isAuthticated === false) return <Navigate to={"/"} />;
  if (data?.user.userType !== "admin") return <Navigate to={"/dashboard"} />;

  const filterData = (list, fields) => {
    if (!search) return list;
    return list.filter(item =>
      fields.some(f => String(item[f] || "").toLowerCase().includes(search.toLowerCase()))
    );
  };

  const filteredDoctors = filterData(doctors, ["docName", "email", "department", "docID"]);
  const filteredNurses = filterData(nurses, ["nurseName", "email", "department", "nurseID"]);
  const filteredPatients = filterData(patients, ["patientName", "email", "disease", "patientID"]);

  const tabStyle = (tab) => ({
    padding: "0.7rem 1.5rem",
    border: "2px solid rgba(244, 133, 133, 0.874)",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
    background: activeTab === tab ? "rgba(244, 133, 133, 0.874)" : "white",
    color: activeTab === tab ? "white" : "rgba(244, 133, 133, 0.874)",
    transition: "all 0.2s",
  });

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
  };

  const thStyle = {
    background: "rgba(244, 133, 133, 0.874)",
    color: "white",
    padding: "0.8rem 1rem",
    textAlign: "left",
    fontSize: "0.95rem",
  };

  const tdStyle = {
    padding: "0.8rem 1rem",
    borderBottom: "1px solid #f0f0f0",
    fontSize: "0.9rem",
    color: "#555",
  };

  const badgeStyle = {
    background: "rgba(255, 243, 243, 0.874)",
    color: "rgba(244, 100, 100, 0.9)",
    padding: "3px 10px",
    borderRadius: "12px",
    fontWeight: "bold",
    fontSize: "0.85rem",
  };

  const deleteBtnStyle = {
    background: "#ff6b6b",
    color: "white",
    border: "none",
    padding: "0.4rem 1rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.85rem",
  };

  return (
    <>
      <ToastContainer />

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{
            background: "white", borderRadius: "12px", padding: "2rem",
            maxWidth: "400px", width: "90%", textAlign: "center"
          }}>
            <h3 style={{ color: "#333", marginBottom: "1rem" }}>⚠️ Confirm Delete</h3>
            <p style={{ color: "#666", marginBottom: "1.5rem" }}>
              Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{ padding: "0.6rem 1.5rem", borderRadius: "8px", border: "2px solid #ddd", background: "white", cursor: "pointer", fontWeight: "bold" }}
              >Cancel</button>
              <button
                onClick={confirmDeleteAction}
                style={{ padding: "0.6rem 1.5rem", borderRadius: "8px", border: "none", background: "#ff6b6b", color: "white", cursor: "pointer", fontWeight: "bold" }}
              >Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <Sidebar />
        <div className="AfterSideBar">
          <h1 style={{ color: "rgb(184 191 234)", marginBottom: "0.5rem" }}>View All Staff & Patients</h1>
          <p style={{ color: "#888", marginBottom: "1.5rem" }}>Manage all doctors, nurses and patients</p>

          {/* Stats */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
            {[
              { label: "Doctors", count: doctors.length, emoji: "👨‍⚕️" },
              { label: "Nurses", count: nurses.length, emoji: "👩‍⚕️" },
              { label: "Patients", count: patients.length, emoji: "🤒" },
            ].map((s, i) => (
              <div key={i} style={{
                background: "white", borderRadius: "12px", padding: "1rem 2rem",
                boxShadow: "0 2px 10px rgba(0,0,0,0.07)", textAlign: "center", minWidth: "150px"
              }}>
                <div style={{ fontSize: "2rem" }}>{s.emoji}</div>
                <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "rgba(244, 133, 133, 0.874)" }}>{s.count}</div>
                <div style={{ color: "#888" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Search by name, email, ID, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "0.8rem 1rem", borderRadius: "8px",
              border: "2px solid #f0f0f0", fontSize: "1rem",
              marginBottom: "1.5rem", boxSizing: "border-box", outline: "none"
            }}
          />

          {/* Tabs */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <button style={tabStyle("doctors")} onClick={() => setActiveTab("doctors")}>👨‍⚕️ Doctors ({filteredDoctors.length})</button>
            <button style={tabStyle("nurses")} onClick={() => setActiveTab("nurses")}>👩‍⚕️ Nurses ({filteredNurses.length})</button>
            <button style={tabStyle("patients")} onClick={() => setActiveTab("patients")}>🤒 Patients ({filteredPatients.length})</button>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#888" }}>Loading...</div>
          ) : (
            <>
              {/* Doctors Table */}
              {activeTab === "doctors" && (
                <div style={{ overflowX: "auto" }}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Doctor ID</th>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Department</th>
                        <th style={thStyle}>Gender</th>
                        <th style={thStyle}>Mobile</th>
                        <th style={thStyle}>Education</th>
                        <th style={thStyle}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDoctors.length === 0 ? (
                        <tr><td colSpan="8" style={{ ...tdStyle, textAlign: "center" }}>No doctors found</td></tr>
                      ) : filteredDoctors.map((d, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? "white" : "rgba(255,243,243,0.5)" }}>
                          <td style={tdStyle}><span style={badgeStyle}>{d.docID}</span></td>
                          <td style={tdStyle}><strong>{d.docName}</strong></td>
                          <td style={tdStyle}>{d.email}</td>
                          <td style={tdStyle}>{d.department}</td>
                          <td style={tdStyle}>{d.gender}</td>
                          <td style={tdStyle}>{d.mobile}</td>
                          <td style={tdStyle}>{d.education}</td>
                          <td style={tdStyle}>
                            <button style={deleteBtnStyle} onClick={() => handleDelete("doctors", d._id, d.docName)}>
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Nurses Table */}
              {activeTab === "nurses" && (
                <div style={{ overflowX: "auto" }}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Nurse ID</th>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Department</th>
                        <th style={thStyle}>Gender</th>
                        <th style={thStyle}>Mobile</th>
                        <th style={thStyle}>Education</th>
                        <th style={thStyle}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNurses.length === 0 ? (
                        <tr><td colSpan="8" style={{ ...tdStyle, textAlign: "center" }}>No nurses found</td></tr>
                      ) : filteredNurses.map((n, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? "white" : "rgba(255,243,243,0.5)" }}>
                          <td style={tdStyle}><span style={badgeStyle}>{n.nurseID}</span></td>
                          <td style={tdStyle}><strong>{n.nurseName}</strong></td>
                          <td style={tdStyle}>{n.email}</td>
                          <td style={tdStyle}>{n.department}</td>
                          <td style={tdStyle}>{n.gender}</td>
                          <td style={tdStyle}>{n.mobile}</td>
                          <td style={tdStyle}>{n.education}</td>
                          <td style={tdStyle}>
                            <button style={deleteBtnStyle} onClick={() => handleDelete("nurses", n._id, n.nurseName)}>
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Patients Table */}
              {activeTab === "patients" && (
                <div style={{ overflowX: "auto" }}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Patient ID</th>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Disease</th>
                        <th style={thStyle}>Gender</th>
                        <th style={thStyle}>Blood Group</th>
                        <th style={thStyle}>Mobile</th>
                        <th style={thStyle}>Age</th>
                        <th style={thStyle}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.length === 0 ? (
                        <tr><td colSpan="9" style={{ ...tdStyle, textAlign: "center" }}>No patients found</td></tr>
                      ) : filteredPatients.map((p, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? "white" : "rgba(255,243,243,0.5)" }}>
                          <td style={tdStyle}><span style={badgeStyle}>{p.patientID}</span></td>
                          <td style={tdStyle}><strong>{p.patientName}</strong></td>
                          <td style={tdStyle}>{p.email}</td>
                          <td style={tdStyle}>{p.disease || "N/A"}</td>
                          <td style={tdStyle}>{p.gender}</td>
                          <td style={tdStyle}>{p.bloodGroup}</td>
                          <td style={tdStyle}>{p.mobile}</td>
                          <td style={tdStyle}>{p.age}</td>
                          <td style={tdStyle}>
                            <button style={deleteBtnStyle} onClick={() => handleDelete("patients", p._id, p.patientName)}>
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewAll;
