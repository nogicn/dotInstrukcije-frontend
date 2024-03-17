import { useState } from "react";
import {
  Button,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

import "./RegisterPage.css";
import { handlerRegister } from "../../api/AuthApi";

import { useEffect } from "react";

import { getSubjects } from "../../api/SubjectApi";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

function RegisterPage() {
  const [showStudentForm, setShowStudentForm] = useState(true);

  const [studentName, setStudentName] = useState("");
  const [studentSurname, setStudentSurname] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentConfirmPassword, setStudentConfirmPassword] = useState("");
  const [studentProfilePicture, setStudentProfilePicture] = useState(null);

  const [professorName, setProfessorName] = useState("");
  const [professorSurname, setProfessorSurname] = useState("");
  const [professorEmail, setProfessorEmail] = useState("");
  const [professorPassword, setProfessorPassword] = useState("");
  const [professorConfirmPassword, setProfessorConfirmPassword] = useState("");
  const [professorProfilePicture, setProfessorProfilePicture] = useState(null);
  const [professorSubjects, setProfessorSubjects] = useState([]);

  const handleStudentSubmit = async (event) => {
    event.preventDefault();

    // Prepare the data to be sent
    const studentData = new FormData();
    studentData.append("name", studentName);
    studentData.append("surname", studentSurname);
    studentData.append("email", studentEmail);
    studentData.append("password", studentPassword);
    studentData.append("confirmPassword", studentConfirmPassword);
    studentData.append("profilePicture", studentProfilePicture);

    console.log(studentData);

    // Send the data to the server
    handlerRegister(studentData, "student");
  };

  const handleProfessorSubmit = async (event) => {
    event.preventDefault();

    const professorData = new FormData();
    professorData.append("name", professorName);
    professorData.append("surname", professorSurname);
    professorData.append("email", professorEmail);
    professorData.append("password", professorPassword);
    professorData.append("confirmPassword", professorConfirmPassword);
    professorData.append("profilePicture", professorProfilePicture);
    professorData.append("subjects", professorSubjects.map((s) => s.url));

    console.log(professorData);

    handlerRegister(professorData, "professor");
  };

  const handleStudentImageChange = (event) => {
    setStudentProfilePicture(event.target.files[0]);
  };

  const handleProfessorImageChange = (event) => {
    setProfessorProfilePicture(event.target.files[0]);
  };

  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    getSubjects().then((response) => setSubjects(response.subjects));
  }, []);

  const handleSubjectSelect = (event, value) => {
    if (value) {
      setProfessorSubjects((prevSubjects) => [...prevSubjects, value]);
    }
  };


  return (
    <>
      {showStudentForm ? (
        <div className="register-wrapper">
          <div className="register-container">
            <h1>Registracija studenta</h1>
            <form onSubmit={handleStudentSubmit}>
              <div className="register-form">
                <InputLabel htmlFor="name">Ime</InputLabel>
                <OutlinedInput
                  id="name"
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <img
                        src="/icons/person-icon.svg"
                        style={{ height: "15px", width: "15px" }}
                      />
                    </InputAdornment>
                  }
                />

                <InputLabel htmlFor="surname">Prezime</InputLabel>
                <OutlinedInput
                  id="surname"
                  type="text"
                  value={studentSurname}
                  onChange={(e) => setStudentSurname(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <img
                        src="/icons/person-icon.svg"
                        style={{ height: "15px", width: "15px" }}
                      />
                    </InputAdornment>
                  }
                />

                <InputLabel htmlFor="email">Email</InputLabel>
                <OutlinedInput
                  id="email"
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <img
                        src="/icons/email-icon.svg"
                        style={{ height: "15px", width: "15px" }}
                      />
                    </InputAdornment>
                  }
                />

                <InputLabel htmlFor="password">Lozinka</InputLabel>
                <OutlinedInput
                  id="password"
                  type="password"
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <img
                        src="/icons/password-icon.svg"
                        style={{ height: "15px", width: "15px" }}
                      />
                    </InputAdornment>
                  }
                />

                <InputLabel htmlFor="confirmPassword">
                  Potvrdi Lozinku
                </InputLabel>
                <OutlinedInput
                  id="confirmPassword"
                  type="password"
                  value={studentConfirmPassword}
                  onChange={(e) => setStudentConfirmPassword(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <img
                        src="/icons/password-icon.svg"
                        style={{ height: "15px", width: "15px" }}
                      />
                    </InputAdornment>
                  }
                />

                <InputLabel htmlFor="profilePicture">
                  Profilna fotografija
                </InputLabel>
                <OutlinedInput
                  id="profilePicture"
                  type="file"
                  onChange={handleStudentImageChange}
                />
              </div>
              <Button
                type="submit"
                variant="contained"
                style={{ marginRight: "1rem" }}
              >
                Registriraj se
              </Button>
              <Button
                type="button"
                variant="contained"
                onClick={() => {
                  setStudentName("");
                  setStudentSurname("");
                  setStudentEmail("");
                  setStudentPassword("");
                  setStudentConfirmPassword("");
                  setStudentProfilePicture(null);
                }}
              >
                Odbaci
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div className="login-wrapper">
          <div className="login-container">
            <h1>Registracija profesora</h1>
            <form onSubmit={handleProfessorSubmit}>
              <div className="register-form">
                <InputLabel htmlFor="name">Ime</InputLabel>
                <OutlinedInput
                  id="name"
                  type="text"
                  value={professorName}
                  onChange={(e) => setProfessorName(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <img
                        src="/icons/person-icon.svg"
                        style={{ height: "15px", width: "15px" }}
                      />
                    </InputAdornment>
                  }
                />

                <InputLabel htmlFor="surname">Prezime</InputLabel>
                <OutlinedInput
                  id="surname"
                  type="text"
                  value={professorSurname}
                  onChange={(e) => setProfessorSurname(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <img
                        src="/icons/person-icon.svg"
                        style={{ height: "15px", width: "15px" }}
                      />
                    </InputAdornment>
                  }
                />

                <InputLabel htmlFor="email">Email</InputLabel>
                <OutlinedInput
                  id="email"
                  type="email"
                  value={professorEmail}
                  onChange={(e) => setProfessorEmail(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <img
                        src="/icons/email-icon.svg"
                        style={{ height: "15px", width: "15px" }}
                      />
                    </InputAdornment>
                  }
                />

                <InputLabel htmlFor="password">Lozinka</InputLabel>
                <OutlinedInput
                  id="password"
                  type="password"
                  value={professorPassword}
                  onChange={(e) => setProfessorPassword(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <img
                        src="/icons/password-icon.svg"
                        style={{ height: "15px", width: "15px" }}
                      />
                    </InputAdornment>
                  }
                />

                <InputLabel htmlFor="confirmPassword">
                  Potvrdi Lozinku
                </InputLabel>
                <OutlinedInput
                  id="confirmPassword"
                  type="password"
                  value={professorConfirmPassword}
                  onChange={(e) => setProfessorConfirmPassword(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <img
                        src="/icons/password-icon.svg"
                        style={{ height: "15px", width: "15px" }}
                      />
                    </InputAdornment>
                  }
                />

                <InputLabel htmlFor="profilePicture">
                  Profilna fotografija
                </InputLabel>
                <OutlinedInput
                  id="profilePicture"
                  type="file"
                  onChange={handleProfessorImageChange}
                />

                <InputLabel htmlFor="profilePicture">
                  Pridruži se predmetu{" "}
                </InputLabel>
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
                {professorSubjects.map((subject) => (
                  <div key={subject.url} className="link-no-style">
                    <div className="predmet">
                      <h2 className="predmet-text">{subject.title}</h2>
                      <p className="predmet-text">{subject.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="submit"
                variant="contained"
                style={{ marginRight: "1rem" }}
              >
                Registriraj se
              </Button>
              <Button
                type="button"
                variant="contained"
                onClick={() => {
                  setProfessorName("");
                  setProfessorSurname("");
                  setProfessorEmail("");
                  setProfessorPassword("");
                  setProfessorConfirmPassword("");
                  setProfessorProfilePicture(null);
                }}
              >
                Odbaci
              </Button>
            </form>
          </div>
        </div>
      )}
      <div className="login-wrapper">
        <div className="login-container" style={{ flexDirection: "row" }}>
          <Button
            variant="contained"
            onClick={() => setShowStudentForm(!showStudentForm)}
          >
            Registriraj se kao {showStudentForm ? "professor" : "student"}?
          </Button>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
