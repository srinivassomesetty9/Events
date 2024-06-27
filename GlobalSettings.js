import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TopBar from "./TopBar";
import { Container, Typography, TextField, Button, Alert, Snackbar } from "@mui/material";
import BreadCrumb from "./BreadCrumb";

const GlobalSettings = () => {
  const [globalSurplusCount, setGlobalSurplusCount] = useState(2);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  useEffect(() => {
    const getGlobalSettings = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "https://api.jinnhire.in/jinnhire/data/global-settings/",
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setGlobalSurplusCount(data.global_surplus_count_of_resumes);
        } else {
          throw new Error("Failed to fetch global settings");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getGlobalSettings();
  }, []);

  const handleSurplusCountChange = (event) => {
    setGlobalSurplusCount(event.target.value);
  };

  const handleUpdateSurplusCount = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "https://api.jinnhire.in/jinnhire/data/global-settings/set_settings/",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            global_surplus_count_of_resumes: globalSurplusCount,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setShow(true);
        setSeverity("success");
        setMessage("Global surplus count of resumes updated successfully");
      } else {
        throw new Error("Failed to update global settings");
      }
    } catch (error) {
      console.error("Error:", error);
      setShow(true);
      setSeverity("error");
      if (error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Error updating global surplus count of resumes. Please try again.");
      }
    }
  };

  return (
    <Box>
      <Snackbar
        open={show}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        autoHideDuration={6000}
        message="Success"
        onClose={() => setShow(false)}
      >
        <Alert
          onClose={() => setShow(false)}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
      <Box mt={2}>
        <Typography variant="body1" gutterBottom>
          Global Surplus Count of Resumes
        </Typography>
        <TextField
          id="globalSurplusCount"
          type="number"
          value={globalSurplusCount}
          onChange={handleSurplusCountChange}
          width={50}
          variant="outlined"
          sx={{mr:2}}
        />
        <Button
          id="updateSurplusCountButton"
          variant="contained"
          color="primary"
          onClick={handleUpdateSurplusCount}
          sx={{ mt: 2,backgroundColor: "rgb(31 91 139)" }}
        >
          Update Surplus Count
        </Button>
      </Box>
    </Box>
  );
};

export default GlobalSettings;
