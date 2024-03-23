import "./HomePage.css";

import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { getInstructions } from "../../api/ProfessorApi";

import InputAdornment from "@mui/material/InputAdornment";
import ProfessorsComponent from "../../components/professors/ProfessorsComponent";
import { getSubjects } from '../../api/SubjectApi';
import { getProfessors } from '../../api/ProfessorApi';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


function ComboBox() {
  const [subjects, setSubjects] = useState([]);
  const [pastInstructions, setPastInstructions] = useState([]);
  const [upcomingInstructions, setUpcomingInstructions] = useState([]);
  const [sentInstructionRequests, setSentInstructionRequests] = useState([]);

  useEffect(() => {
    getSubjects().then(response => setSubjects(response.subjects));
    const fetchInstructions = async () => {
      const fetchedInstructions = await getInstructions();
      console.log(fetchedInstructions);
      console.log(fetchedInstructions.sentInstructionRequests)
      setPastInstructions(fetchedInstructions.pastInstructions);
      setUpcomingInstructions(fetchedInstructions.upcomingInstructions);
      setSentInstructionRequests(fetchedInstructions.sentInstructionRequests);
    };

    fetchInstructions();
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
  const [pastInstructions, setPastInstructions] = useState([]);
  const [sentInstructionRequests, setSentInstructionRequests] = useState([]);
  const [otherProfessors, setOtherProfessors] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
      const fetchProfessors = async () => {
        const fetchedProfessors = await getProfessors();
        setProfessors(fetchedProfessors.professors);
      };

    fetchProfessors();
  }, []);
  useEffect(() => {
    const fetchInstructions = async () => {
      const fetchedInstructions = await getInstructions();
      console.log(fetchedInstructions);
      console.log(fetchedInstructions.sentInstructionRequests)
      setPastInstructions(fetchedInstructions.pastInstructions);
      setSentInstructionRequests(fetchedInstructions.sentInstructionRequests);
      console.log("profesori")
      console.log(professors)
      console.log(fetchedInstructions)
      // find what professors are not in sentInstructionRequests or pastInstructions
      const otherProfessors = professors.filter(professor => {
        return !fetchedInstructions.sentInstructionRequests.some(sentInstruction => sentInstruction._id === professor._id) &&
          !fetchedInstructions.pastInstructions.some(pastInstruction => pastInstruction._id === professor._id);
      });
      console.log(otherProfessors);
      setOtherProfessors(otherProfessors);
    };

    fetchInstructions();
  }, [professors]);

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
            {user.status === "student" ? (<><ProfessorsComponent
              professors={sentInstructionRequests}
              showTime={true}
              showSubject={true}
              showInstructionsCount={true}
              buttonText={"Promijeni"}
              buttonVariant={"outlined"}
            />
            <ProfessorsComponent
              professors={pastInstructions}
              showTime={true}
              showSubject={true}
              showInstructionsCount={true}
              buttonText={"Ponovno dogovori"} />
              
              <ProfessorsComponent
              professors={otherProfessors}
              showSubject={true}
              showInstructionsCount={true}
            />
            </>): (
              <ProfessorsComponent
              professors={professors}
              showSubject={true}
              showInstructionsCount={true}
            />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
