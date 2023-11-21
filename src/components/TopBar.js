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
    <AppBar className="top-bar" position="fixed" sx={{ backgroundColor: '#00192f' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        <div className="logo-container">
            <a href="/" class="lgx-scroll">
            <img className="logo-img" src="./icon.png" alt="Dhigna Events" /> 
            <span class="brand-name">Dhigna Events</span> 
            <span class="brand-slogan">Sell Tickets</span>
            </a>
        </div>
        </Typography>
   <Button color="inherit" href="/login">
<i className="fas fa-fingerprint"></i> Login
</Button>
<Button color="inherit" aria-haspopup="true" onClick={handleClick}>
  <i className="fas fa-user-plus"></i> Register
</Button>
<Menu
  id="register-menu"
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleClose}
>
  <MenuItem>
    <Link href="/register">Customer Register</Link>
  </MenuItem>
  <MenuItem>
    <Link href="/register">Organizer Register</Link>
  </MenuItem>
  <MenuItem>
    <Link href="/register">Agent Register</Link>
  </MenuItem>
</Menu>
<Button color="inherit" href="/" className='lgx-btn'>
  <i className="fas fa-calendar-day"></i> Browse Events
</Button>
      
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;

// import React from 'react';
// import { AppBar, Toolbar, IconButton, Typography, Button, Link, MenuItem, Menu } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';

// const Navbar = () => {
//   const [anchorEl, setAnchorEl] = React.useState(null);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <AppBar position="fixed" sx={{ backgroundColor: '#2196f3' }}>
//       <Toolbar>
//         <IconButton
//           size="large"
//           edge="start"
//           color="inherit"
//           aria-label="menu"
//           onClick={handleClick}
//           sx={{ mr: 2 }}
//         >
//           <MenuIcon />
//         </IconButton>
//         <Menu
//           id="menu-appbar"
//           anchorEl={anchorEl}
//           anchorOrigin={{
//             vertical: 'top',
//             horizontal: 'right',
//           }}
//           keepMounted
//           transformOrigin={{
//             vertical: 'top',
//             horizontal: 'right',
//           }}
//           open={Boolean(anchorEl)}
//           onClose={handleClose}
//         >
//           {/* Your menu items go here */}
//           <MenuItem onClick={handleClose}>
//             <Link href="/">Home</Link>
//           </MenuItem>
//           <MenuItem onClick={handleClose}>
//             <Link href="/events">Events</Link>
//           </MenuItem>
//           <MenuItem onClick={handleClose}>
//             <Link href="/registration">Registration</Link>
//           </MenuItem>
//           <MenuItem onClick={handleClose}>
//             <Link href="/cart">Cart</Link>
//           </MenuItem>
//         </Menu>
//         <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//           Your Event Name
//         </Typography>
//         <Button color="inherit" href="/">
//           <i className="fas fa-fingerprint"></i> Login
//         </Button>
//         <Button color="inherit" aria-haspopup="true" onClick={handleClick}>
//           <i className="fas fa-user-plus"></i> Register
//         </Button>
//         <Menu
//           id="register-menu"
//           anchorEl={anchorEl}
//           open={Boolean(anchorEl)}
//           onClose={handleClose}
//         >
//           <MenuItem>
//             <Link href="/">Customer Register</Link>
//           </MenuItem>
//           <MenuItem>
//             <Link href="/">Organizer Register</Link>
//           </MenuItem>
//           <MenuItem>
//             <Link href="/">Agent Register</Link>
//           </MenuItem>
//         </Menu>
//         <Button color="inherit" href="/">
//           <i className="fas fa-calendar-day"></i> Browse Events
//         </Button>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;
