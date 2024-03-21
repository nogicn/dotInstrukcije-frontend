import { useState } from 'react';
import { Button, InputLabel, OutlinedInput,InputAdornment } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import "./SettingsPage.css";
import { useEffect } from 'react';
import { getSubjects } from "../../api/SubjectApi";

function SettingsPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(""); // New state for uploaded file
  const [subjects, setSubjects] = useState([]);
  const [submittedSubjects, setSubmittedSubjects] = useState([]);
  const [description, setDescription] = useState([]);

  const handleSave = async () => {
    // post to server 
    let user = JSON.parse(localStorage.getItem('user'));

    const formData = new FormData();
    formData.append("email", email);
    formData.append("name", name);
    formData.append("surname", surname);
    formData.append("password", password);
    formData.append("profilePicture", profilePicture);
    formData.append("subjects", submittedSubjects)
    

    const response = await fetch(
      import.meta.env.VITE_REACT_BACKEND_URL + "/student/" + user.id,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: formData,
      }
    );
  };

  const fetchUser = async () => {
    let user = JSON.parse(localStorage.getItem('user'));

    const response = await fetch(
      import.meta.env.VITE_REACT_BACKEND_URL + "/student/" + user.email,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      }
    );

    if (response.ok) {
      const result = await response.json();
      setEmail(result.student.email || "");
      setName(result.student.name || "");
      setSurname(result.student.surname || "");
      setProfilePicture(result.student.profilePictureUrl || "");
      setSubjects(result.student.subjects || []);
      setDescription(result.student.description || []);
      result.student.subjects.forEach((s) => {
        if (result.student.description.find((desc) => desc.url === s.url)) {
          setSubmittedSubjects((prevSubjects) => [...prevSubjects, s]);
        }
      });
      
      
    }


  }

  const handleSubjectSelect = (event, value) => {
    if (value) {
      setSubmittedSubjects((prevSubjects) => [...prevSubjects, value]);
    }
  };


  useEffect(() => {
    fetchUser();
    
  }, []);

  return (
    <div className="profilepage-wrapper">
      <div className="profilepage-container">
        <div className="student-info">
          <img src={import.meta.env.VITE_REACT_DATA_URL + profilePicture} className="student-image" />
          <div>
            <h1>{name} {surname}</h1>
            <h2>Predmeti: </h2>
           {description.map((desc) => (
            <p>{desc}</p>
          ))}
          </div>
        </div>

        <h1>Settings</h1>
        <InputLabel>Email</InputLabel>
        <OutlinedInput value={email} onChange={(e) => setEmail(e.target.value)} />
        <InputLabel>Name</InputLabel>
        <OutlinedInput value={name} onChange={(e) => setName(e.target.value)} />
        <InputLabel>Surname</InputLabel>
        <OutlinedInput value={surname} onChange={(e) => setSurname(e.target.value)} />
        <InputLabel>Password</InputLabel>
        <OutlinedInput value={password} onChange={(e) => setPassword(e.target.value)} />
        <InputLabel>Current profile Picture</InputLabel>
        <input type="file" onChange={(e) => setProfilePicture(e.target.files[0])} />
        {subjects ? (<>
          <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={subjects}
          getOptionLabel={(option) => option.title}
          onChange={handleSubjectSelect}
          renderInput={(params) => (
            <TextField
              {...params}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <img
                      src="/icons/search-icon.svg"
                      style={{ height: "20px", width: "20px" }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        {submittedSubjects.map((subject) => (
          <div key={subject.url} className="link-no-style">
            <div className="predmet">
              <h2 className="predmet-text">{subject.title}</h2>
              <p className="predmet-text">{subject.description}</p>
            </div>
          </div>
        ))}</>) : null}
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}

export default SettingsPage;
