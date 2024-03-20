import { useState } from 'react';
import { Button, InputLabel, OutlinedInput } from "@mui/material";
import { useEffect } from 'react';

function SettingsPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null); // New state for uploaded file

  const handleSave = async () => {
    // post to server 
    let user = JSON.parse(localStorage.getItem('user'));

    const formData = new FormData();
    formData.append("email", email);
    formData.append("name", name);
    formData.append("surname", surname);
    formData.append("password", password);
    formData.append("profilePicture", profilePicture);

    const response = await fetch(
      import.meta.env.VITE_REACT_BACKEND_URL + "/student/" + user.id,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: formData,
      }
    );
  };

  const fetchUser = async () => {
    let user = JSON.parse(localStorage.getItem('user'));
  
    const response = await fetch(
      import.meta.env.VITE_REACT_BACKEND_URL + "/student/" + user.email,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      }
    );
  
    if (response.ok) {
      const result = await response.json();
      setEmail(result.student.email || "");
      setName(result.student.name || "");
      setSurname(result.student.surname || "");
    }
  }
  

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="profilepage-wrapper">
      <div className="profilepage-container">
        <h1>Settings</h1>
        <InputLabel>Email</InputLabel>
        <OutlinedInput value={email} onChange={(e) => setEmail(e.target.value)} />
        <InputLabel>Name</InputLabel>
        <OutlinedInput value={name} onChange={(e) => setName(e.target.value)} />
        <InputLabel>Surname</InputLabel>
        <OutlinedInput value={surname} onChange={(e) => setSurname(e.target.value)} />
        <InputLabel>Password</InputLabel>
        <OutlinedInput value={password} onChange={(e) => setPassword(e.target.value)} />
        <InputLabel>Profile Picture</InputLabel>
        <input type="file" onChange={(e) => setProfilePicture(e.target.files[0])} />
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}

export default SettingsPage;
