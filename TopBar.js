import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useNavigate } from "react-router-dom";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { ListItemIcon } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { AccountCircle, VerifiedUser } from "@mui/icons-material";

const navItems = ["Logout"];

export default function TopBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);
  const [loggedInUser, setLoggedInUser] = React.useState("User"); // Default user name
  const [role, setRole] = React.useState("");
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  React.useEffect(() => {
    const username = localStorage.getItem("username");
    const userData = localStorage.getItem("user");
    const getrole = JSON.parse(userData);
    // console.log(getrole.role,"ROLE")
    setRole(getrole.role);

    if (username) {
      setLoggedInUser(username);
    }
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickHome = () => {
    navigate("/home");
  };

  const handleNavItemClick = (item) => {
    if (item === "Profile") {
      navigate("/profile"); // Navigate to profile route
    } else if (item === "Settings") {
      navigate("/settings"); // Navigate to settings route
    } else if (item === "Logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("user");
      navigate("/"); // Navigate to home route after logout
    }
    handleClose();
  };

  const handleNotificationsClick = () => {
    // Simulate fetching notifications from an API
    const fetchedNotifications = []; // Replace this with actual notifications
    setNotifications(fetchedNotifications);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        style={{ backgroundColor: "rgb(28 66 109)" }}
      >
        <Toolbar>
          <img
            className="logo-img"
            src="jinne_head.png"
            onClick={handleClickHome}
            style={{ height: "60px" }}
            alt="Jinne Hire"
          />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: "initial", sm: "block" },
            }}
            style={{ marginRight: "24px" }}
          >
            Jinn Hire
          </Typography>
          <IconButton
            onClick={handleNotificationsClick}
            size="small"
            sx={{ mr: 2 }}
            style={{ color: "inherit" }}
          >
            <NotificationsIcon />
            {/* {notifications.length === 0 && <Typography variant="body2" color="text.secondary">0</Typography>} */}
          </IconButton>
          {/* <Tooltip title={loggedInUser}> */}
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            style={{ color: "inherit" }}
          >
            {/* <Avatar sx={{ width: 32, height: 32 }}>{loggedInUser.charAt(0).toUpperCase()}</Avatar> */}
            <AccountCircle />
            <Typography
              variant="body2"
              color="text.primary"
              style={{ color: "inherit" }}
              sx={{ ml: 1 }}
            >
              {loggedInUser.split("@")[0]}
            </Typography>
          </IconButton>
          {/* </Tooltip> */}
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
      >
        {/* <MenuItem onClick={() => handleNavItemClick("Profile")}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem> */}
        {(role === "admin" ||
          role === "manager" ||
          role === "account_manager") && (
          <MenuItem onClick={() => handleNavItemClick("Settings")}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
        )}

        <MenuItem onClick={() => handleNavItemClick("Logout")}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}
