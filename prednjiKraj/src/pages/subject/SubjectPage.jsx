import "./SubjectPage.css";
import ProfessorsComponent from "../../components/professors/ProfessorsComponent";
import { getSubject } from "../../api/SubjectApi";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function SubjectPage() {
  if (!localStorage.getItem('token')) {
    window.location.href = '/login';
  }

  let { subjectName } = useParams();
  const [subjectData, setSubjectData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSubject(subjectName);
      setSubjectData(data);
    };

    fetchData();
  }, [subjectName]);

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
            <ProfessorsComponent
              professors={subjectData ? subjectData.professors : []}
              showSubject={false}
              showInstructionsCount={true}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default SubjectPage;
