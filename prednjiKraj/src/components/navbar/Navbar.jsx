import { Button } from "@mui/material";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { logout } from "../../api/AuthApi";

function HomePage() {
  const token = localStorage.getItem("token");
  let loggedIn = Boolean(token);

  let user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <div className="navbar-container">
        <div className="flex-row navbar-wrapper">
          <div>
            <Link to="/">
              <img src="/logo/dotInstrukcije-logo.png" />
            </Link>
          </div>

          <div className="flex-row navbar-options">
            {loggedIn ? (
              <>
                <Link to="/">
                  <Button variant="contained">Pretraži</Button>
                </Link>
                <Link to="/profile">
                  <Button variant="contained">Moje instrukcije</Button>
                </Link>
                <Link to="/settings">
                  <Button variant="contained">Postavke</Button>
                </Link>
                {user.status === "professor" && (
                  <Link to="/new">
                    <Button variant="contained">Novi predmet</Button>
                  </Link>
                )}
                <Button variant="contained" onClick={logout}>
                  Odjavi se
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="contained">Prijavi se</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
