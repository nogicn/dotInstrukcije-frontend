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
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleButtonClick = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  return (
    <>
      <div className="professor-container">
        {professors?.map((professor) => (
          <div key={professor._id} className="professor">
            <img
              src={
                professor.profilePictureUrl
                  ? professor.profilePictureUrl
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
                <p className="professor-text">{professor.subjectTitle}</p>
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
                  <p>{professor.time}</p>
                </div>
              )}
              <Button onClick={handleButtonClick} variant={buttonVariant ? buttonVariant : "contained"}>
                {buttonText ? buttonText : "Dogovori termin"}
              </Button>
            </div>
            <DateTimeDialog open={dialogOpen} onClose={handleCloseDialog} professor={professor} />
          </div>
          
        ))}
      </div>

    </>
  );
}

export default ProfessorsComponent;
