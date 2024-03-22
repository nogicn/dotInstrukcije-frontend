import { useState } from 'react';
import { Button, InputLabel, OutlinedInput, InputAdornment } from "@mui/material";
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
  const [isPasswordValid, setIsPasswordValid] = useState(true);


  const handleSave = async () => {

    if (password === "") {
      setIsPasswordValid(false);
      return;
    }
    setIsPasswordValid(true);

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
      import.meta.env.VITE_REACT_BACKEND_URL + "/student/" + user.id,
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
    } else {
      // Handle error if necessary
      console.error("Failed to save data.");
    }
  };

  useEffect(() => {
    fetchUser()
  }, []);

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
      if (submittedSubjects.length < 3) { // impose maximum of 3 submitted subjects
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
        <div className="student-info">
          <img src={import.meta.env.VITE_REACT_DATA_URL + profilePicture} className="student-image" />
          <div key={email}>
            <h1>{name} {surname}</h1>

            {description.length !== 0 ? (
              <>
                <h2>Predmeti: </h2>
              </>
            ) : null}
            {description.map((desc) => (
              <>
                <p>{desc}</p>
              </>
            ))}
          </div>
        </div>

        <h1>Settings</h1>
        <InputLabel>Email</InputLabel>
        <OutlinedInput value={email} onChange={(e) => setEmail(e.target.value)} />
        <InputLabel>Ime</InputLabel>
        <OutlinedInput value={name} onChange={(e) => setName(e.target.value)} />
        <InputLabel>Prezime</InputLabel>
        <OutlinedInput value={surname} onChange={(e) => setSurname(e.target.value)} />
        <InputLabel>Nova profilna slika</InputLabel>
        <input type="file" onChange={(e) => setProfilePicture(e.target.files[0])} />
        <InputLabel>Unesite password prije promjene</InputLabel>
        {!isPasswordValid ? <p style={{ color: "red" }}>Niste unijeli password!</p> : null }
        <OutlinedInput
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ borderColor: isPasswordValid ? "" : "red" }} // Change border color if password is invalid
        />
        <div></div>
        
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
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}

export default SettingsPage;
