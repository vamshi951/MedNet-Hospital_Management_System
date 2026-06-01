import React, { useState } from "react";
import "./CSS/Add_Doctor.css";
import nurse from "../../../../../img/nurseavatar.png";
import { useDispatch, useSelector } from "react-redux";
import { NurseRegister, SendPassword } from "../../../../../Redux/auth/action";
import Sidebar from "../../GlobalFiles/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate } from "react-router-dom";
const notify = (text) => toast(text);

const Add_Nurse = () => {
  const { data } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [registeredNurse, setRegisteredNurse] = useState(null);

  const InitData = {
    nurseName: "", age: "", mobile: "", email: "", gender: "",
    DOB: "", address: "", education: "", department: "",
    nurseID: Date.now(), password: "", details: "", bloodGroup: "",
  };
  const [NurseValue, setNurseValue] = useState(InitData);

  const HandleDoctorChange = (e) => {
    setNurseValue({ ...NurseValue, [e.target.name]: e.target.value });
  };

  const HandleDoctorSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(NurseRegister(NurseValue)).then((res) => {
      if (res.message === "Nures already exists") {
        setLoading(false);
        return notify("Nurse Already Exists");
      }
      if (res.message === "error") {
        setLoading(false);
        return notify("Something went wrong, Please try Again");
      }
      setRegisteredNurse({
        name: NurseValue.nurseName,
        id: NurseValue.nurseID,
        password: NurseValue.password,
        email: NurseValue.email,
      });
      let data = { email: res.data?.email, password: res.data?.password, userId: res.data?.nurseID };
      dispatch(SendPassword(data)).then(() => notify("Account Details Sent to Email"));
      setLoading(false);
      setNurseValue({ ...InitData, nurseID: Date.now() });
    });
  };

  if (data?.isAuthticated === false) return <Navigate to={"/"} />;
  if (data?.user.userType !== "admin") return <Navigate to={"/dashboard"} />;

  return (
    <>
      <ToastContainer />
      <div className="container">
        <Sidebar />
        <div className="AfterSideBar">
          <div className="Main_Add_Doctor_div">
            <h1>Add Nurse</h1>

            {/* Show ID card after registration */}
            {registeredNurse && (
              <div style={{
                background: "#f0fff4", border: "2px solid #68d391", borderRadius: "12px",
                padding: "1.5rem", marginBottom: "2rem", textAlign: "center"
              }}>
                <h2 style={{ color: "#276749" }}>✅ Nurse Added Successfully!</h2>
                <p style={{ fontSize: "1rem", color: "#555" }}>Please share these credentials with the nurse:</p>
                <div style={{ background: "white", borderRadius: "8px", padding: "1rem", margin: "1rem 0" }}>
                  <p><strong>Name:</strong> {registeredNurse.name}</p>
                  <p><strong>Nurse ID:</strong> <span style={{ fontSize: "1.5rem", color: "#276749", fontWeight: "bold", letterSpacing: "2px" }}>{registeredNurse.id}</span></p>
                  <p><strong>Password:</strong> {registeredNurse.password}</p>
                  <p><strong>Email:</strong> {registeredNurse.email}</p>
                </div>
                <button
                  onClick={() => setRegisteredNurse(null)}
                  style={{
                    padding: "0.6rem 1.5rem", background: "rgba(244, 133, 133, 0.874)",
                    color: "white", border: "none", borderRadius: "2rem",
                    fontWeight: "bold", cursor: "pointer", fontSize: "1rem"
                  }}
                >
                  + Add Another Nurse
                </button>
              </div>
            )}

            {!registeredNurse && (
              <>
                <img src={nurse} alt="nurse" className="avatarimg" />
                <form onSubmit={HandleDoctorSubmit}>
                  <div><label>Name</label><div className="inputdiv"><input type="text" placeholder="Full Name" name="nurseName" value={NurseValue.nurseName} onChange={HandleDoctorChange} required /></div></div>
                  <div><label>Age</label><div className="inputdiv"><input type="number" placeholder="Age" name="age" value={NurseValue.age} onChange={HandleDoctorChange} required /></div></div>
                  <div><label>Contact Number</label><div className="inputdiv"><input type="number" placeholder="Contact Number" name="mobile" value={NurseValue.mobile} onChange={HandleDoctorChange} required /></div></div>
                  <div><label>Email</label><div className="inputdiv"><input type="email" placeholder="abc@abc.com" name="email" value={NurseValue.email} onChange={HandleDoctorChange} required /></div></div>
                  <div><label>Gender</label><div className="inputdiv"><select name="gender" value={NurseValue.gender} onChange={HandleDoctorChange} required><option value="">Choose Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Others">Others</option></select></div></div>
                  <div><label>Blood Group</label><div className="inputdiv"><select name="bloodGroup" value={NurseValue.bloodGroup} onChange={HandleDoctorChange} required><option value="">Select</option><option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option></select></div></div>
                  <div><label>Birthdate</label><div className="inputdiv"><input type="date" name="DOB" value={NurseValue.DOB} onChange={HandleDoctorChange} required /></div></div>
                  <div><label>Address</label><div className="inputdiv adressdiv"><input type="text" placeholder="Address" name="address" value={NurseValue.address} onChange={HandleDoctorChange} required /></div></div>
                  <div><label>Education</label><div className="inputdiv"><input type="text" placeholder="eg. B.Sc Nursing" name="education" value={NurseValue.education} onChange={HandleDoctorChange} required /></div></div>
                  <div><label>Password</label><div className="inputdiv"><input type="text" placeholder="Password" name="password" value={NurseValue.password} onChange={HandleDoctorChange} required /></div></div>
                  <div><label>Other Info</label><div className="inputdiv"><textarea placeholder="Extra Info" rows="4" cols="50" name="details" value={NurseValue.details} onChange={HandleDoctorChange} required /></div></div>
                  <button type="submit" className="formsubmitbutton">{loading ? "Loading..." : "Submit"}</button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Add_Nurse;
