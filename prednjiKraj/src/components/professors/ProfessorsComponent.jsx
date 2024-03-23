/* eslint-disable react/prop-types */
import { Button } from "@mui/material";
import { useState } from "react";
import "./ProfessorsComponent.css";
import DateTimeDialog from "../dialog/DateTimeDialog";

function ProfessorsComponent({
  professors,
  showSubject,
  showInstructionsCount,
  showTime,
  buttonText,
  buttonVariant,
}) {
  const [dialogOpenMap, setDialogOpenMap] = useState({});

  const handleButtonClick = (professorId) => {
    setDialogOpenMap((prevMap) => ({
      ...prevMap,
      [professorId]: true,
    }));
  };

  const handleCloseDialog = (professorId) => {
    setDialogOpenMap((prevMap) => ({
      ...prevMap,
      [professorId]: false,
    }));
  };

  return (
    <div className="professor-container">
      {professors?.map((professor) => (
        <div key={professor._id} className="professor">
          <img
            src={
              professor.profilePictureUrl
                ? import.meta.env.VITE_REACT_DATA_URL + professor.profilePictureUrl
                : "/placeholder.png"
            }
            className="professor-image"
            alt={professor.name}
          />
          <div className="professor-info">
            <h3 className="professor-text">
              {professor.name} {professor.surname}
            </h3>
            {showSubject && (
              <p className="professor-text">{professor.subjects.join(", ")}</p>
            )}
            {showInstructionsCount && (
              <div className="instructionsCount-container">
                <img src="/icons/users-icon.svg" className="users-icon" />
                <p>{professor.instructionsCount}</p>
              </div>
            )}

            {showTime && (
              <div className="instructionsCount-container">
                <img src="/icons/users-icon.svg" className="users-icon" />
                <p>{new Date(professor.time).toLocaleString()}</p>
              </div>
            )}
            <Button
              onClick={() => handleButtonClick(professor._id)}
              variant={buttonVariant ? buttonVariant : "contained"}
            >
              {buttonText ? buttonText : "Dogovori termin"}
            </Button>
          </div>
          <DateTimeDialog
            open={dialogOpenMap[professor._id] || false}
            onClose={() => handleCloseDialog(professor._id)}
            professor={professor}
          />
        </div>
      ))}
    </div>
  );
}

export default ProfessorsComponent;
