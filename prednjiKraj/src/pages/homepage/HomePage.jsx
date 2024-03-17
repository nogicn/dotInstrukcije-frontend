import "./HomePage.css";

import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';

import InputAdornment from "@mui/material/InputAdornment";
import ProfessorsComponent from "../../components/professors/ProfessorsComponent";
import { getSubjects } from '../../api/SubjectApi';
import { getProfessors } from '../../api/ProfessorApi';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


function ComboBox() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    getSubjects().then(response => setSubjects(response.subjects));
  }, []);

  const handleSubjectSelect = (event, value) => {
    if (value) {
      window.location.href = `/subject/${value.url}`;
    }
  };

  return (
    <>
    <div className="search-container">
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={subjects}
      getOptionLabel={(option) => option.title}
      onChange={handleSubjectSelect}
      renderInput={(params) =>
        <TextField {...params} 
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
      }
    />
    {/* <Button variant="contained" onClick={handleButtonClick}>Pretraži</Button> */}
    </div>
    <div>
      {subjects.map((subject) => (
        <Link
          to={`/subject/${subject.url}`}
          key={subject.url}
          className="link-no-style"
        >
          <div className="predmet">
            <h2 className="predmet-text">{subject.title}</h2>
            <p className="predmet-text">{subject.description}</p>
          </div>
        </Link>
      ))}
    </div>
    </>
  );
}

function HomePage() {
  const [professors, setProfessors] = useState([]);

  useEffect(() => {
      const fetchProfessors = async () => {
        const fetchedProfessors = await getProfessors();
        setProfessors(fetchedProfessors.professors);
      };

    fetchProfessors();
  }, []);

  if (!localStorage.getItem('token')) {
    window.location.href = '/login';
  }

  return (
    <>
      <div className="homepage-wrapper">
        <div className="homepage-container">
          <div>
            <div className="title">
              <img src="/logo/dotGet-logo.svg" alt="" />
              <h2>instrukcije po mjeri!</h2>
            </div>

              <ComboBox />

          </div>

          <div>
            <h4>Najpopularniji instruktori:</h4>
            <ProfessorsComponent
              professors={professors}
              showSubject={true}
              showInstructionsCount={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
