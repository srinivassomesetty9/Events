import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NoAuth = () => {
  const navigate = useNavigate();
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <img src="/access_denied.png" height={500} alt="No Auth" />
      <Typography variant="h4" mt={2}>
        You do not have the necessary permissions to access this page.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        Back to Login
      </Button>
    </Box>
  );
};

export default NoAuth;
