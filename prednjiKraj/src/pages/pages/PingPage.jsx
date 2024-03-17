import { useState, useEffect } from "react";

function PingComponent() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/ping`)
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error fetching data:", error));
  }, []); 

  return (
    <div className="profilepage-wrapper">
      <div className="profilepage-container">
        <h1>Ping</h1>
        <p>Message from backend: {message}</p>
      </div>
    </div>
  );
}

export default PingComponent;
