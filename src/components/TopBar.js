import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  MenuItem,
  Menu,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  let navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <AppBar
      className="top-bar"
      position="fixed"
      sx={{ backgroundColor: "white", color: "black" }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <div className="logo-container">
            <a onClick={() => navigate("/")} class="lgx-scroll">
              <img className="logo-img" src="./icon1.png" alt="Dhigna Events" />
              <span class="brand-name">Dhigna Events</span>
              <span class="brand-slogan">Dhigna Events. Sell Tickets.</span>
            </a>
          </div>
        </Typography>
        <Button
          color="primary"
          variant="contained"
          className="lgx-btn"
          style={{ marginRight: "10px" }}
          onClick={() => navigate("/login")}
        >
          <i className="fas fa-fingerprint"></i> Login
        </Button>
        <Button
          color="primary"
          variant="contained"
          style={{ marginRight: "10px" }}
          className="lgx-btn"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <i className="fas fa-user-plus"></i> Register
        </Button>
        <Menu
          id="register-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem>
            onClick={() => navigate("/register")}
            <Button>Customer Register</Button>
          </MenuItem>
          <MenuItem>
            onClick={() => navigate("/register")}
            <Button>Organizer Register</Button>
          </MenuItem>
          <MenuItem>
            onClick={() => navigate("/register")}
            <Button>Agent Register</Button>
          </MenuItem>
        </Menu>
        <Button
          variant="contained"
          color="primary"
          className="lgx-btn"
          onClick={() => navigate("/eventsdetail")}
        >
          <i className="fas fa-calendar-day"></i> Browse Events
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
