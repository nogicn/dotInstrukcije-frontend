import ProfessorsComponent from "../../components/professors/ProfessorsComponent";
import { getInstructions } from "../../api/ProfessorApi";
import "./ProfilePage.css";
import React, {useEffect, useState} from 'react';

function ProfilePage() {
  if (!localStorage.getItem("token")) {
    window.location.href = '/login';
  }
  let user = JSON.parse(localStorage.getItem('user'));

  const [pastInstructions, setPastInstructions] = useState([]);
  const [upcomingInstructions, setUpcomingInstructions] = useState([]);
  const [sentInstructionRequests, setSentInstructionRequests] = useState([]);

  useEffect(() => {
    const fetchInstructions = async () => {
      const fetchedInstructions = await getInstructions();
      setPastInstructions(fetchedInstructions.pastInstructions);
      setUpcomingInstructions(fetchedInstructions.upcomingInstructions);
      setSentInstructionRequests(fetchedInstructions.sentInstructionRequests);
    };

    fetchInstructions();
  }, []);

  return (
    <>
      <div className="profilepage-wrapper">
        <div className="profilepage-container">
          <div className="student-info">
            <img src={user.image} className="student-image" />
            <div>
              <h1>{user.name} {user.surname}</h1>
              <p>{user.description}</p>
            </div>
          </div>

          <div>
            <h4>Poslani zahtjevi za instrukcije:</h4>
            <ProfessorsComponent
              professors={sentInstructionRequests}
              showTime={true}
              showSubject={true}
              buttonText={"Promijeni"}
              buttonVariant={"outlined"}
            />
          </div>

          <div>
            <h4>Nadolazeće instrukcije:</h4>
            <ProfessorsComponent
              professors={upcomingInstructions}
              showTime={true}
              showSubject={true}
              buttonText={"Promijeni"}
              buttonVariant={"outlined"}
            />
          </div>

          <div>
            <h4>Povijest instrukcija:</h4>
            <ProfessorsComponent
              professors={pastInstructions}
              showTime={true}
              showSubject={true}
              buttonText={"Ponovno dogovori"}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
