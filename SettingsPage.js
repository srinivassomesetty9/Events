import React from "react";
import Box from "@mui/material/Box";
import SettingsTab from "./SettingsTab";
import TopBar from "./TopBar";

const SettingsPage = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <TopBar />
      <SettingsTab />
    </Box>
  );
};

export default SettingsPage;
