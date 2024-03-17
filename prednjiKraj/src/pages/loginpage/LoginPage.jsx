import { Button, InputLabel } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { handleLogin } from "../../api/AuthApi";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";

import "./LoginPage.css";

function LoginPage() {
  const [showStudentLogIn, setShowStudentLogIn] = useState(true);

  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");

  const [professorEmail, setProfessorEmail] = useState("");
  const [professorPassword, setProfessorPassword] = useState("");

  function handleStudentSubmit(event) {
    event.preventDefault();
    const data = {
      email: studentEmail,
      password: studentPassword,
    };
    handleLogin(data, "student");
  }

  function handleProfessorSubmit(event) {
    event.preventDefault();
    const data = {
      email: professorEmail,
      password: professorPassword,
    };
    handleLogin(data, "professor");
  }

  return (
    <>
      {showStudentLogIn ? (
        <div className="login-wrapper">
          <div className="login-container">
            <h1>Prijava studenta</h1>
            <form onSubmit={handleStudentSubmit}>
              <div className="login-form">
                <InputLabel htmlFor="email">E-mail adresa</InputLabel>
                <OutlinedInput
                  id="email"
                  type="text"
                  placeholder="Email"
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
                  placeholder="Lozinka"
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
              </div>
              <Button
                variant="contained"
                type="submit"
                style={{ marginRight: "1rem" }}
              >
                Prijavi se
              </Button>
              <Button
                variant="contained"
                type="button"
                onClick={() => {
                  setStudentEmail("");
                  setStudentPassword("");
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
            <h1>Prijava profesora</h1>
            <form onSubmit={handleProfessorSubmit}>
              <div className="login-form">
                <InputLabel htmlFor="email">E-mail adresa</InputLabel>
                <OutlinedInput
                  id="email"
                  type="text"
                  placeholder="Email"
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
                  placeholder="Lozinka"
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
              </div>
              <Button
                variant="contained"
                type="submit"
                style={{ marginRight: "1rem" }}
              >
                Prijavi se
              </Button>
              <Button
                variant="contained"
                type="button"
                onClick={() => {
                  setProfessorEmail("");
                  setProfessorPassword("");
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
            onClick={() => setShowStudentLogIn(!showStudentLogIn)}
            style={{ marginRight: "1rem" }}
          >
            Prijavi se kao {showStudentLogIn ? "professor" : "student"}?
          </Button>
          <Link to="/register">
            <Button variant="contained">Registriraj se</Button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
