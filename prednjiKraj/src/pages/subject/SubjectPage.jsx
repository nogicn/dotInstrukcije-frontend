import "./SubjectPage.css";
import ProfessorsComponent from "../../components/professors/ProfessorsComponent";
import { getSubject } from "../../api/SubjectApi";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfessors } from '../../api/ProfessorApi';
import { getInstructions } from "../../api/ProfessorApi";

function SubjectPage() {
  if (!localStorage.getItem('token')) {
    window.location.href = '/login';
  }

  

  let { subjectName } = useParams();
  const [subjectData, setSubjectData] = useState(null);
  const [professors, setProfessors] = useState([]);
  const [pastInstructions, setPastInstructions] = useState([]);
  const [sentInstructionRequests, setSentInstructionRequests] = useState([]);
  const [otherProfessors, setOtherProfessors] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSubject(subjectName);
      setSubjectData(data);
      setProfessors(data.professors);
    };

    fetchData();
  }, []);

  
  
  useEffect(() => {
    const fetchInstructions = async () => {
      const fetchedInstructions = await getInstructions();
      

      // connect professors with pastInstructions and sentInstructionRequests
      setPastInstructions( fetchedInstructions.pastInstructions.filter(pastInstruction => {
        return professors.some(professor => professor._id === pastInstruction._id);
      }));
      setSentInstructionRequests( fetchedInstructions.sentInstructionRequests.filter(sentInstruction => {
        return professors.some(professor => professor._id === sentInstruction._id);
      }));
      // add dates to pastInstructions and sentInstructionRequests
      console.log("pastInstructions")
      console.log(sentInstructionRequests)

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

      // add instructions count to professors
      

    };

    fetchInstructions();
  }, [professors]);

  return (
    <>
      <div className="subjectPage-wrapper">
        <div className="subjectPage-container">
          <div>
            <div className="subjectPage-title">
              <h1>{subjectData ? subjectData.subject.title : "Ime predmeta"}</h1>
              <p>
                {subjectData ? subjectData.subject.description : "Opis predmeta"}
              </p>
            </div>
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
              professors={subjectData ? subjectData.professors : []}
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

export default SubjectPage;
