import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import { Typography, TextField, Button, Alert, Snackbar, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { AppContext } from "./AppContext";

const GlobalSettings = () => {
  const [globalSurplusCount, setGlobalSurplusCount] = useState(2);
  const [globalAssignmentType, setGlobalAssignmentType] = useState("");
  const { resumeAssignmentStrategy, setResumeAssignmentStrategy } = useContext(AppContext);
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
          setGlobalAssignmentType(data.global_assignment_type);
          setResumeAssignmentStrategy(data.resume_assignment_strategy);
        } else {
          throw new Error("Failed to fetch global settings");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getGlobalSettings();
  }, [setResumeAssignmentStrategy]);

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
            global_assignment_type: globalAssignmentType,
            resume_assignment_strategy: resumeAssignmentStrategy,
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
      if (error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Error updating global settings. Please try again.");
      }
    }
  };
console.log(resumeAssignmentStrategy,"ASSIGNMENt")
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
        <Box>
          <Typography id="global-assignment-type-label">Assignment Type</Typography>
          <Select
            labelId="global-assignment-type-label"
            id="globalAssignmentType"
            value={globalAssignmentType}
            onChange={(e) => setGlobalAssignmentType(e.target.value)}
          >
            <MenuItem value="roundrobin_global_active_byload">Round Robin Global Active by Load</MenuItem>
            {/* <MenuItem value="another_type">Another Type</MenuItem> */}
          </Select>
        </Box>
        <Box>
          <Typography id="resume-assignment-strategy-label">Assignment Strategy</Typography>
          <Select
            labelId="resume-assignment-strategy-label"
            id="resumeAssignmentStrategy"
            value={resumeAssignmentStrategy}
            onChange={(e) => setResumeAssignmentStrategy(e.target.value)}
          >
            <MenuItem value="roundrobin_opted_users">Round Robin Opted Users</MenuItem>
            <MenuItem value="pool_based">Pool Based</MenuItem>
            {/* Add more options as needed */}
          </Select>
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
    </Box>
  );
};

export default GlobalSettings;
