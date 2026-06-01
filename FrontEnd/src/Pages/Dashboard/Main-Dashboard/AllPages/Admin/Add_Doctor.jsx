import React, { useState } from "react";
import "./CSS/Add_Doctor.css";
import doctor from "../../../../../img/doctoravatar.png";
import { useDispatch, useSelector } from "react-redux";
import { DoctorRegister, SendPassword } from "../../../../../Redux/auth/action";
import Sidebar from "../../GlobalFiles/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate } from "react-router-dom";
const notify = (text) => toast(text);

const AddDoctor = () => {
  const { data } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [registeredDoctor, setRegisteredDoctor] = useState(null);

  const initData = {
    docName: "", age: "", mobile: "", email: "", bloodGroup: "",
    gender: "", DOB: "", address: "", education: "", department: "",
    docID: Date.now(), password: "", details: "",
  };
  const [DoctorValue, setDoctorValue] = useState(initData);

  const HandleDoctorChange = (e) => {
    setDoctorValue({ ...DoctorValue, [e.target.name]: e.target.value });
  };

  const HandleDoctorSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(DoctorRegister(DoctorValue)).then((res) => {
      if (res.message === "Doctor already exists") {
        setLoading(false);
        return notify("Doctor Already Exists");
      }
      if (res.message === "error") {
        setLoading(false);
        return notify("Something went wrong, Please try Again");
      }
      setRegisteredDoctor({
        name: DoctorValue.docName,
        id: DoctorValue.docID,
        password: DoctorValue.password,
        email: DoctorValue.email,
      });
      let data = { email: res.data?.email, password: res.data?.password, userId: res.data?.docID };
      dispatch(SendPassword(data)).then(() => notify("Account Details Sent to Email"));
      setLoading(false);
      setDoctorValue({ ...initData, docID: Date.now() });
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
            <h1>Add Doctors</h1>

            {/* Show ID card after registration */}
            {registeredDoctor && (
              <div style={{
                background: "#f0fff4", border: "2px solid #68d391", borderRadius: "12px",
                padding: "1.5rem", marginBottom: "2rem", textAlign: "center"
              }}>
                <h2 style={{ color: "#276749" }}>✅ Doctor Added Successfully!</h2>
                <p style={{ fontSize: "1rem", color: "#555" }}>Please share these credentials with the doctor:</p>
                <div style={{ background: "white", borderRadius: "8px", padding: "1rem", margin: "1rem 0" }}>
                  <p><strong>Name:</strong> {registeredDoctor.name}</p>
                  <p><strong>Doctor ID:</strong> <span style={{ fontSize: "1.5rem", color: "#276749", fontWeight: "bold", letterSpacing: "2px" }}>{registeredDoctor.id}</span></p>
                  <p><strong>Password:</strong> {registeredDoctor.password}</p>
                  <p><strong>Email:</strong> {registeredDoctor.email}</p>
                </div>
                <button
                  onClick={() => setRegisteredDoctor(null)}
                  style={{
                    padding: "0.6rem 1.5rem", background: "rgba(244, 133, 133, 0.874)",
                    color: "white", border: "none", borderRadius: "2rem",
                    fontWeight: "bold", cursor: "pointer", fontSize: "1rem"
                  }}
                >
                  + Add Another Doctor
                </button>
              </div>
            )}

            {!registeredDoctor && (
              <>
                <img src={doctor} alt="doctor" className="avatarimg" />
                <form onSubmit={HandleDoctorSubmit}>
                  <div><label>Doctor Name</label><div className="inputdiv"><input type="text" placeholder="Full Name" name="docName" value={DoctorValue.docName} onChange={HandleDoctorChange} required /></div></div>
                  <div><label>Age</label><div className="inputdiv"><input type="number" placeholder="Age" name="age" value={DoctorValue.age} onChange={HandleDoctorChange} required /></div></div>
                  <div><label>Emergency Number</label><div className="inputdiv"><input type="number" placeholder="Emergency Number" name="mobile" value={DoctorValue.mobile} onChange={HandleDoctorChange} required /></div></div>
                  <div><label>Email</label><div className="inputdiv"><input type="email" placeholder="abc@abc.com" name="email" value={DoctorValue.email} onChange={HandleDoctorChange} required /></div></div>
                  <div><label>Gender</label><div className="inputdiv"><select name="gender" value={DoctorValue.gender} onChange={HandleDoctorChange} required><option value="">Choose Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Others">Others</option></select></div></div>
                  <div><label>Blood Group</label><div className="inputdiv"><select name="bloodGroup" value={DoctorValue.bloodGroup} onChange={HandleDoctorChange} required><option value="">Select</option><option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option></select></div></div>
                  <div><label>Birthdate</label><div className="inputdiv"><input type="date" name="DOB" value={DoctorValue.DOB} onChange={HandleDoctorChange} required /></div></div>
                  <div><label>Address</label><div className="inputdiv adressdiv"><input type="text" placeholder="Address" name="address" value={DoctorValue.address} onChange={HandleDoctorChange} required /></div></div>
                  <div><label>Education</label><div className="inputdiv"><input type="text" placeholder="eg.MBBS" name="education" value={DoctorValue.education} onChange={HandleDoctorChange} required /></div></div>
                  <div><label>Department</label><div className="inputdiv"><select name="department" value={DoctorValue.department} onChange={HandleDoctorChange} required><option value="">Select</option><option value="Cardiology">Cardiology</option><option value="Neurology">Neurology</option><option value="ENT">ENT</option><option value="Ophthalmologist">Ophthalmologist</option><option value="Anesthesiologist">Anesthesiologist</option><option value="Dermatologist">Dermatologist</option><option value="Oncologist">Oncologist</option><option value="Psychiatrist">Psychiatrist</option></select></div></div>
                  <div><label>Password</label><div className="inputdiv"><input type="text" placeholder="Password" name="password" value={DoctorValue.password} onChange={HandleDoctorChange} required /></div></div>
                  <div><label>Other Details</label><div className="inputdiv"><textarea placeholder="Extra Info" rows="4" cols="50" name="details" value={DoctorValue.details} onChange={HandleDoctorChange} required /></div></div>
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

export default AddDoctor;
