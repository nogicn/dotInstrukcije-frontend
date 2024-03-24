import React, { useState } from 'react';
import { Button, InputLabel, OutlinedInput, InputAdornment } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import "./SettingsPage.css";
import { useEffect } from 'react';
import { getSubjects } from "../../api/SubjectApi";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function SettingsPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null); // New state for uploaded file
  const [profilePictureURL, setProfilePictureURL] = useState(""); // New state for URL of uploaded file
  const [subjects, setSubjects] = useState([]);
  const [submittedSubjects, setSubmittedSubjects] = useState([]);
  const [description, setDescription] = useState([]);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isDataFilled, setIsDataFilled] = useState(true);
  const [isOriginallyTeacher, setIsOriginallyTeacher] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState('success');

  const handleSave = async () => {
    if (password === "") {
      setIsPasswordValid(false);
      return;
    }
    setIsPasswordValid(true);

    // check if every property is filled
    if (email === "" || name === "" || surname === "") {
      setIsDataFilled(false);
      return;
    }

    if (submittedSubjects.length === 0 && isOriginallyTeacher === true) {
      setIsDataFilled(false);
      return;
    }


    setIsDataFilled(true);


    // post to server 
    let user = JSON.parse(localStorage.getItem('user'));

    const formData = new FormData();
    formData.append("email", email);
    formData.append("name", name);
    formData.append("surname", surname);
    formData.append("password", password);
    formData.append("profilePicture", profilePicture);
    formData.append("subjects", submittedSubjects.map((s) => s.url));

    const response = await fetch(
      import.meta.env.VITE_REACT_BACKEND_URL  + "/"+user.status+"/" + user.id,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: formData,
      }
    );
    if (response.ok) {
      setSubjects([]);
      setSubmittedSubjects([]);
      setDescription([]);
      fetchUser();
      setSnackbarType('success');
      setOpenSnackbar(true);
    } else {
      // Handle error if necessary
      console.error("Failed to save data.");
      setSnackbarType('error');
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    fetchUser()
  }, []);

  const fetchUser = async () => {
    let user = JSON.parse(localStorage.getItem('user'));

   try {
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
      setProfilePictureURL(result.student.profilePictureUrl || ""); // Store URL of the profile picture
      setSubjects(result.student.subjects || []);
      setDescription(result.student.description || []);
      if (result.student.description) {
        setIsOriginallyTeacher(true);
      }

    }
  }
  catch {
    setSnackbarType('error');
    setOpenSnackbar(true);
    console.error("Failed to fetch user data.");
  }
  }

  useEffect(() => {
    // Update submittedSubjects after subjects state has been set
    subjects.forEach((s) => {
      if (description.length !== 0 && description.find((desc) => desc === s.url)) {
        // also check if it already exists in the submittedSubjects
        if (!submittedSubjects.find((subject) => subject.url === s.url)) {
          setSubmittedSubjects((prevSubjects) => [...prevSubjects, s]);
        }
      }
    });
  }, [subjects, description]);

  const handleSubjectSelect = (event, value) => {
    if (value) {
      if (submittedSubjects.length < 3) {
        // check that it doesnt already exist in the submittedSubjects
        if (!submittedSubjects.find((subject) => subject.url === value.url))
        setSubmittedSubjects((prevSubjects) => [...prevSubjects, value]);
      }
    }
  };

  const handleRemoveSubject = (subjectToRemove) => {
    setSubmittedSubjects((prevSubjects) =>
      prevSubjects.filter((subject) => subject !== subjectToRemove)
    );
  };

  return (
    <div className="profilepage-wrapper">
      <div className="profilepage-container">
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarType}>
          {snackbarType === 'success' ? 'Save successful!' : 'Save failed or server offline!'}
        </Alert>
      </Snackbar>
        <div className="student-info">
          <img src={profilePicture ? URL.createObjectURL(profilePicture) : import.meta.env.VITE_REACT_DATA_URL +profilePictureURL} className="student-image" />
          <div key={email}>
            <h1>{name} {surname}</h1>

            {description.length !== 0 ? (
              <>
                <h2>Predmeti: </h2>
              </>
            ) : null}
            {description.map((desc) => (
              <p key={desc}>{desc}</p>
            ))}
          </div>
        </div>

        <h1>Settings</h1>
        <InputLabel>Email</InputLabel>
        <OutlinedInput placeholder={email} onChange={(e) => setEmail(e.target.value)} />
        <InputLabel>Ime</InputLabel>
        <OutlinedInput placeholder={name} onChange={(e) => setName(e.target.value)} />
        <InputLabel>Prezime</InputLabel>
        <OutlinedInput placeholder={surname} onChange={(e) => setSurname(e.target.value)} />
        <InputLabel>Nova profilna slika</InputLabel>
        <input type="file" onChange={(e) => {
          setProfilePicture(e.target.files[0]);
          setProfilePictureURL(""); // Clear the URL when a new image is uploaded
        }} />
        

        {description.length !== 0 ? (
          <>
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
                  <Button onClick={() => handleRemoveSubject(subject)}>Remove</Button> {/* Button to remove subject */}
                </div>
              </div>
            ))}
          </>
        ) : null}
        
        <InputLabel>Unesite password prije promjene</InputLabel>
        {!isPasswordValid ? <p style={{ color: "red" }}>Niste unijeli password!</p> : null}
        {!isDataFilled ? <p style={{ color: "red" }}>Niste unijeli sve podatke!</p> : null}
        <OutlinedInput
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ borderColor: isPasswordValid ? "" : "red" }} // Change border color if password is invalid
        />
        <Button onClick={handleSave}>Save</Button>
        
      </div>
      
    </div>
    
  );
}

export default SettingsPage;
