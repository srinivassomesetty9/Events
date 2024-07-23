import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { Typography, TextField, Button, Alert, Snackbar, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const GlobalSettings = () => {
  const [globalSurplusCount, setGlobalSurplusCount] = useState(2);
  const [assignmentStrategy, setAssignmentStrategy] = useState("ROUNDROBIN_OPTED_USERS");
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
          setAssignmentStrategy(data.resume_assignment_strategy);
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
            global_assignment_type: assignmentStrategy,  // Using the combined select value
            resume_assignment_strategy: assignmentStrategy,  // Using the combined select value
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setShow(true);
        setSeverity("success");
        setMessage("Global settings updated successfully");
      } else {
        throw new Error("Failed to update global settings");
      }
    } catch (error) {
      console.error("Error:", error);
      setShow(true);
      setSeverity("error");
      setMessage("Error updating global settings. Please try again.");
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
          sx={{ mr: 2 }}
        />
        <Typography variant="body1" gutterBottom>
          Assignment Strategy
        </Typography>
        <FormControl variant="outlined" sx={{ mr: 2, minWidth: 200 }}>
          <Select
            labelId="assignment-strategy-label"
            id="assignmentStrategy"
            value={assignmentStrategy}
            onChange={(e) => setAssignmentStrategy(e.target.value)}
            // label="Assignment Strategy"
          >
            <MenuItem value="roundrobin_global_active_byload">Round Robin Global Active by Load</MenuItem>
            <MenuItem value="ROUNDROBIN_OPTED_USERS">Round Robin Opted Users</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Button
          id="updateSurplusCountButton"
          variant="contained"
          color="primary"
          onClick={handleUpdateSurplusCount}
          sx={{ mt: 2, backgroundColor: "rgb(31 91 139)" }}
        >
          Update Global Settings
        </Button>
    </Box>
  );
};

export default GlobalSettings;
