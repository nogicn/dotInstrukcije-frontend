import  { useState } from "react";
import { Button, InputLabel, OutlinedInput } from "@mui/material";
import { createSubject } from "../../api/SubjectApi";

function NewSubjectPage() {
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectUrl, setNewSubjectUrl] = useState("");
  const [newSubjectDescription, setNewSubjectDescription] = useState("");

  const handleSubjectSubmit = async () => {
    const subject = {
      title: newSubjectName,
      url: newSubjectUrl,
      description: newSubjectDescription,
    };
    createSubject(subject);
  };

  return (
    <div className="profilepage-wrapper">
      <div className="profilepage-container">
        <h1>Stvori novi predmet</h1>
        <div>
          <InputLabel htmlFor="confirmPassword">Ime predmeta</InputLabel>
          <OutlinedInput
            type="text"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
          />
          <InputLabel htmlFor="confirmPassword">Kratica predmeta </InputLabel>
          <OutlinedInput
            id="confirmPassword"
            type="text"
            value={newSubjectUrl}
            onChange={(e) => setNewSubjectUrl(e.target.value)}
          />
          <InputLabel htmlFor="confirmPassword">Opis predmeta</InputLabel>
          <OutlinedInput
            id="confirmPassword"
            type="text"
            value={newSubjectDescription}
            onChange={(e) => setNewSubjectDescription(e.target.value)}
          />
        </div>
        <Button
          type="button"
          variant="contained"
          style={{ marginTop: "1rem" }}
          onClick={handleSubjectSubmit}
        >
          Spremi novi predmet
        </Button>
      </div>
    </div>
  );
}

export default NewSubjectPage;
