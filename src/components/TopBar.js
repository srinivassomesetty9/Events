import React from 'react';
import { AppBar, Toolbar, Typography, Button, MenuItem, Menu } from '@mui/material';
import { Link } from 'react-router-dom';

const TopBar = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <AppBar className="top-bar" position="fixed" sx={{ backgroundColor: 'white', color:"black" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        <div className="logo-container">
            <a href="/" class="lgx-scroll">
            <img className="logo-img" src="./icon1.png" alt="Dhigna Events" /> 
            <span class="brand-name">Dhigna Events</span> 
            <span class="brand-slogan">Dhigna Events. Sell Tickets.</span>
            </a>
        </div>
        </Typography>
   <Button color='secondary' variant="contained" className="lgx-btn" style={{marginRight: "10px"}} href="/login">
<i className="fas fa-fingerprint"></i> Login
</Button>
<Button color='secondary' variant="contained" style={{marginRight: "10px"}} className="lgx-btn" aria-haspopup="true" onClick={handleClick}>
  <i className="fas fa-user-plus"></i> Register
</Button>
<Menu
  id="register-menu"
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleClose}
>
  <MenuItem>
    <Button href="/register" >Customer Register</Button>
  </MenuItem>
  <MenuItem>
    <Button href="/register">Organizer Register</Button>
  </MenuItem>
  <MenuItem>
    <Button href="/register">Agent Register</Button>
  </MenuItem>
</Menu>
<Button variant="contained" color='secondary' className="lgx-btn" href="/eventsdetail">
  <i className="fas fa-calendar-day"></i> Browse Events
</Button>
      
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
