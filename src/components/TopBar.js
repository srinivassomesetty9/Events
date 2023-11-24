// import React from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   MenuItem,
//   Menu,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";

// const TopBar = () => {
//   const [anchorEl, setAnchorEl] = React.useState(null);

//   let navigate = useNavigate();

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };
//   return (
//     <AppBar
//       className="top-bar"
//       position="fixed"
//       sx={{ backgroundColor: "white", color: "black" }}
//     >
//       <Toolbar>
//         <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//           <div className="logo-container">
//             <a onClick={() => navigate("/")} class="lgx-scroll">
//               <img className="logo-img" src="./icon1.png" alt="Dhigna Events" />
//               <span class="brand-name">Dhigna Events</span>
//               <span class="brand-slogan">Dhigna Events. Sell Tickets.</span>
//             </a>
//           </div>
//         </Typography>
//         {/* <div className="search">
//         <input
//           type="text"
//           placeholder="Type Event Name/Venue/City/State"
//           // value={searchTerm}
//           // className="input-search"
//           // onChange={(e) => setSearchTerm(e.target.value)}
//           style={{ width: "60%", padding: "10px" }}
//         />
//         <button type="submit" class="lgx-btn lgx-btn-black">
//           <i class="fas fa-search"></i> Search Event
//         </button>
//       </div> */}
//         <Button
//           color="primary"
//           variant="outlined"
//           className="lgx-btn"
//           style={{ marginRight: "10px" }}
//           onClick={() => navigate("/login")}
//         >
//           <i className="fas fa-fingerprint"></i> Login
//         </Button>
//         <Button
//           color="primary"
//           variant="outlined"
//           style={{ marginRight: "10px" }}
//           className="lgx-btn"
//           aria-haspopup="true"
//           onClick={handleClick}
//         >
//           <i className="fas fa-user-plus"></i> Register
//         </Button>
//         <Menu
//           id="register-menu"
//           anchorEl={anchorEl}
//           open={Boolean(anchorEl)}
//           onClose={handleClose}
//         >
//           <MenuItem>

//             <Button onClick={() => navigate("/register")}>Customer Register</Button>
//           </MenuItem>
//           <MenuItem>

//             <Button onClick={() => navigate("/register")}>Organizer Register</Button>
//           </MenuItem>
//           <MenuItem>

//             <Button onClick={() => navigate("/register")}>Agent Register</Button>
//           </MenuItem>
//         </Menu>
//         <Button
//           variant="outlined"
//           color="primary"
//           className="lgx-btn"
//           onClick={() => navigate("/eventsdetail")}
//         >
//           <i className="fas fa-calendar-day"></i> Browse Events
//         </Button>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default TopBar;

import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useNavigate } from "react-router-dom";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const navItems = ['Login', 'Signup', 'Events'];

export default function SearchAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  let navigate = useNavigate();
  
  const handleNavItemClick = (item) => {
    navigate(`/${item.toLowerCase()}`);
    handleClose();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" color="default">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleClick}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <img onClick={() => navigate("/")} className="logo-img" src="./icon1.png" alt="Dhigna Events" />
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={() => navigate("/")}
            sx={{
              flexGrow: 1,
              display: { xs: "initial", sm: "block" }, // Changed 'none' to 'initial'
            }}
          >
            Dhigna Events
            <span class="brand-slogan">Dhigna Events. Sell Tickets.</span>
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search Events"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
            {navItems.map((item) => (
              <Button key={item} style={{marginRight: "4px"}}variant="outlined" size="small" sx={{ color: "inherit"}} onClick={() => handleNavItemClick(item)}>
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menu for Navigation Items */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        {navItems.map((item) => (
          <MenuItem key={item} onClick={() => handleNavItemClick(item)}>
            {item}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
