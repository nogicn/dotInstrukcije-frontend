import  { useState } from "react";
import { Button, InputLabel, OutlinedInput } from "@mui/material";
import { createSubject } from "../../api/SubjectApi";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


function NewSubjectPage() {
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectUrl, setNewSubjectUrl] = useState("");
  const [newSubjectDescription, setNewSubjectDescription] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState('success');
  
  const createSubject = async (data) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_BACKEND_URL}/subject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        setSnackbarType('success');
      setOpenSnackbar(true);
      }if (response.status === 400){
        setSnackbarType('error');
      setOpenSnackbar(true);
      }
      
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  const handleSubjectSubmit = () => {
    const subject = {
      title: newSubjectName,
      url: newSubjectUrl,
      description: newSubjectDescription,
    };
    createSubject(subject);
  }

  return (
    <div className="profilepage-wrapper">
      <div className="profilepage-container">
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarType}>
          {snackbarType === 'success' ? 'Spremljeno!' : 'Predmet vec postoji ili je server offline!'}
        </Alert>
      </Snackbar>
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
