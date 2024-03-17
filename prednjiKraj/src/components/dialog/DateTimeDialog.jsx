/* eslint-disable react/prop-types */
import * as React from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { sentInstructionDate } from "../../api/ProfessorApi";

const DateTimeDialog = ({ open, onClose, professor }) => {
  const [value, setValue] = React.useState(dayjs("2024-03-15T15:30"));

  const handleClose = () => {
    sentInstructionDate(value, professor._id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Odaberi vrijeme instrukcija</DialogTitle>
      <DialogContent>
      <h3>Profesor: {professor.name}</h3>
        <div style={{margin: "2rem 0"}}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Controlled picker"
            value={value}
            onChange={(newValue) => setValue(newValue)}
          />
        </LocalizationProvider>
        </div>
        <div>
          <Button variant="contained" onClick={handleClose} style={{marginRight: "20px"}}>
            Pošalji zahtjev za instrukcije
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            Odustani
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DateTimeDialog;
