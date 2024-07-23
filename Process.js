import React, { useState, useEffect } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Container,
  Alert,
  Paper,
  TablePagination,
  Box,
  ThemeProvider,
  createTheme,
  IconButton,
  Modal,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Tooltip,
  CircularProgress,
  Divider,
  Switch,
  Menu,
  MenuItem as MenuActionItem
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  ExpandMore,
  Check,
  RemoveRedEye,
  Lock,
  LockOpen,
  Download,
  DownloadDone,
  MoreVert,
} from "@mui/icons-material";
import axios from "axios";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useHref } from "react-router-dom";

// Define a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#f0f4f7",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#0288d1",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: "bold",
        },
      },
    },
  },
});

// const modalStyle = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "90%",
//   maxWidth: 450,
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
//   textAlign: "center",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   borderRadius: "20px",
// };

// const checkboxContainerStyle = {
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "flex-start",
//   width: "100%",
// };

// const buttonContainerStyle = {
//   marginTop: "auto",
//   display: "flex",
//   justifyContent: "space-between",
//   width: "100%",
// };

// Styles for the vertical tabs and checkboxes
const verticalTabsStyles = {
  display: "flex",
  height: "60vh",
  bgcolor: "#f5f5f5",
  borderRadius: 3,
  border: "1px solid #e0e0e0",
};

const tabStyles = {
  borderRight: 1,
  borderColor: "divider",
  minWidth: "180px",
  bgcolor: "#eeeeee",
};

const checkboxStyles = (checked) => ({
  color: checked ? "primary.main" : "default",
});

const tableContainerStyles = {
  flexGrow: 1,
  padding: "16px",
  bgcolor: "#ffffff",
  borderRadius: 3,
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  // overflowX: "hidden",  // Enable horizontal scrolling
  // overflowY: "auto", // Disable vertical scrolling
};


const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const checkboxContainerStyle = {
  display: "flex",
  flexDirection: "column",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
};
const Process = ({ optedInRequirements }) => {
  const [profiles, setProfiles] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0); // Default selected tab index
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [expandedAccordion, setExpandedAccordion] = useState(false); // Track which accordion is expanded
  const [selectedProfileQuestions, setSelectedProfileQuestions] = useState([]);
  const [jdModalOpen, setJdModalOpen] = useState(false);
  const [jdContent, setJdContent] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null); // Track selected profile for modal actions
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [lockStatus, setLockStatus] = useState({});
  const [fileLinks, setFileLinks] = useState({});
  const [optedIn, setOptedIn] = useState(
    optedInRequirements.reduce((acc, req) => ({ ...acc, [req]: true }), {})
  );
  const [anchorEl, setAnchorEl] = useState(null);

  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [loading, setLoading] = useState(true);

  const tableHeaders = {
    0: [
      "SNO",
      "Job Description ID",
      "Candidate Name",
      "Phone",
      "Remarks",
      "Skills",
      "Actions",
    ],
    1: [
      "SNO",
      "Job Description ID",
      "Candidate Name",
      "Phone",
      "Email Address",
      "Current Question",
      "Actions",
      "Questions List",
    ],
    2: [
      "SNO",
      "Job Description ID",
      "Candidate Name",
      "Phone",
      "Email Address",
      "Current Question",
      "Reason for Intervention",
      "Actions",
      "Questions List",
    ],
    3: [
      "SNO",
      "Job Description ID",
      "Candidate Name",
      "Phone",
      "Email Address",
      "Current Question",
      "Reason for Failure",
      "Actions",
      "Questions List",
    ],
    4: [
      "SNO",
      "Job Description ID",
      "Candidate Name",
      "Phone",
      "Email Address",
      "Current Question",
      "Last Follow-up Time",
      "Waiting Time",
      "Actions",
      "Questions List",
    ],
    5: [
      "SNO",
      "Job Description ID",
      "Candidate Name",
      "Phone",
      "Current Question",
      "Follow-up Count",
      "Actions",
      "Questions List",
    ],
    6: [
      "SNO",
      "Job Description ID",
      "Candidate Name",
      "Phone",
      "Email Address",
      "Current Question",
      "Waiting Time",
      "Actions",
      "Questions List",
    ],
  };

  const suitableOptions = [
    {
      text: "Candidate is interested in the position",
      style: checkboxStyles.positive,
    },
    { text: "Candidate is strong technically", style: checkboxStyles.positive },
    { text: "Candidate will join", style: checkboxStyles.positive },
    { text: "Candidate can join immediately", style: checkboxStyles.positive },
    { text: "Candidate seems genuine", style: checkboxStyles.positive },
  ];

  const notSuitableOptions = [
    {
      text: "Candidate is not interested in the role",
      style: checkboxStyles.negative,
    },
    { text: "Candidate has high expectations", style: checkboxStyles.negative },
    { text: "Candidate may not join", style: checkboxStyles.negative },
    { text: "Candidate notice period is high", style: checkboxStyles.negative },
    { text: "Candidate is not responding", style: checkboxStyles.negative },
    {
      text: "Candidate is not suitable/ irrelevent",
      style: checkboxStyles.negative,
    },
    {
      text: "Candidate is not looking for change",
      style: checkboxStyles.negative,
    },
    { text: "Candidate might not relocate", style: checkboxStyles.negative },
    {
      text: "Candidate is not having good communication skills",
      style: checkboxStyles.negative,
    },
    {
      text: "Candidate is not having good technical skills",
      style: checkboxStyles.negative,
    },
  ];

  const userData = localStorage.getItem("user");
  const parsedUserData = JSON.parse(userData);

  useEffect(() => {
    // Fetch profiles based on the selected tab
    fetchProfiles(selectedTab);
  }, [selectedTab]);

  useEffect(() => {
    if (profiles.length > 0) {
      updateLockStatus();
    }
  }, [profiles]);

  // useEffect(() => {
  //   // Update data every 30 seconds
  //   const intervalId = setInterval(() => {
  //     fetchProfiles(selectedTab);
  //   }, 30000);

  //   return () => clearInterval(intervalId);
  // }, [selectedTab]);

  const fetchProfiles = async (tabIndex) => {
    // setLoading(true);
    let reasonForConversationStopping = "";
    let additionalParams = {};

    switch (tabIndex) {
      case 0:
        fetchCommunicationFailedProfiles();
        return;
      case 1:
        reasonForConversationStopping = "success";
        break;
      case 2:
        reasonForConversationStopping = "not_interested";
        break;
      case 3:
        reasonForConversationStopping = "not_qualified";
        break;
      case 4:
        reasonForConversationStopping = "continuing";
        break;
      case 5:
        reasonForConversationStopping = "waiting";
        additionalParams = { conversation_continuing: "YES" };
        break;
      case 6:
        reasonForConversationStopping = "waiting";
        additionalParams = { conversation_continuing: "FUTURE" };
        break;
      default:
        break;
    }

    try {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      const response = await axios.get(
        `https://api.jinnhire.in/jinnhire/data/candidate-state-machines/?username=${username}&reason_for_conversation_stopping=${reasonForConversationStopping}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
          params: additionalParams,
        }
      );
      const data = response.data;
      setProfiles(data);
    } catch (error) {
      setErrorMessage("Error fetching profiles");
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunicationFailedProfiles = async (jdId) => {
    const token = localStorage.getItem("token");
    const cacheBuster = new Date().getTime();

    try {
      const resumesResponse = await fetchResumesByStatus(
        "communication_failed"
      );

      if (!Array.isArray(resumesResponse) || resumesResponse.length === 0) {
        console.error("No resumes found with communication_failed status");
        setProfiles([]);
        setLoading(false);
        return;
      }
      const requirements = optedInRequirements;

      const profilesData = resumesResponse.map((resume) => ({
        resume_id: resume.resume_id,
        jd_id: resume.requirement_id,
        candidate_fname: resume.insights[0]?.first_name || "",
        candidate_last_name: resume.insights[0]?.last_name || "",
        candidate_phone_number: resume.phone_number || "",
        emailAddress: resume.insights[0]?.email_id || "",
        state: resume.state,
        file_link: resume.file_link,
        remarks: resume.remarks,
        skills: resume.insights[0].mandatory_skills,
      }));

      console.log("Fetched Profiles:", profilesData); // Debugging log
      setProfiles(profilesData);
    } catch (error) {
      console.error("Failed to fetch resumes:", error);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchResumesByStatus = async (status) => {
    const token = localStorage.getItem("token");

    const cacheBuster = new Date().getTime();

    const response = await fetch(
      `https://api.jinnhire.in/jinnhire/data/requirements/resumes_by_state_and_user?state=${status}&user_id=${parsedUserData.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  };

  const handleTabChange = (event, tabIndex) => {
    setSelectedTab(tabIndex);
    fetchProfiles(tabIndex);
    setLoading(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (isSuitable, profile) => {
    setModalContent(isSuitable ? suitableOptions : notSuitableOptions);
    setSelectedProfile(profile);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProfile(null);
    setSelectedOptions([]); // Clear selected reasons on modal close
  };

  // Function to handle checkbox change
  const handleCheckboxChange = (option, isChecked) => {
    if (isChecked) {
      setSelectedOptions([...selectedOptions, option]);
    } else {
      setSelectedOptions(selectedOptions?.filter((item) => item !== option));
    }
  };

  const handleAccordionChange = (index) => {
    setExpandedAccordion(expandedAccordion === index ? null : index);
  };

  const handleJobDescriptionClick = (jdId) => {
    fetchJD(jdId);
    setJdModalOpen(true);
  };

  const handleOptInChange = (requirementId) => {
    setOptedIn((prevOptedIn) => ({
      ...prevOptedIn,
      [requirementId]: !prevOptedIn[requirementId],
    }));
  };

  const handleMenuOpen = (event, profile) => {
    setAnchorEl(event.currentTarget);
    setSelectedProfile(profile);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProfile(null);
  };

  const fetchJD = async (jdId) => {
    try {
      const response = await axios.get(
        `https://api.jinnhire.in/media/${jdId}/JD_${jdId}_body.txt`
      );
      setJdContent(response.data);
    } catch (error) {
      console.error("Error fetching JD", error);
    }
  };

  const handleCloseJdModal = () => {
    setJdModalOpen(false);
  };

  const parseQuestionsList = (questionsList) => {
    if (typeof questionsList !== "string") {
      console.error("Invalid questionsList input:", questionsList);
      return [];
    }

    const parsedQuestions = [];
    const regex = /"([^"]*)"/g;
    const matches = [...questionsList.matchAll(regex)].map((match) => match[1]);

    for (let i = 0; i < matches.length; i += 2) {
      const question = matches[i];
      const answer = matches[i + 1] || "N/A";
      parsedQuestions.push({ question, answer });
    }
    return parsedQuestions;
  };

  const getDifferenceInMinutesFromIST = (timestamp) => {
    const utcDate = new Date(timestamp);
    const now = new Date();
    const diff = Math.abs(now - utcDate);
    return Math.floor(diff / 1000 / 60); // Convert milliseconds to minutes
  };

  const fetchResumes = async (jd_id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `https://api.jinnhire.in/jinnhire/data/requirements/${jd_id}/resumes/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching resumes:", error);
      return [];
    }
  };

  const handleSubmit = async () => {
    console.log("cliked");
    if (!selectedProfile || !selectedOptions.length) return;

    try {
      const token = localStorage.getItem("token");
      const state = selectedOptions.some((selectedOption) =>
        suitableOptions.some(
          (suitableOption) => suitableOption.text === selectedOption
        )
      )
        ? "processed"
        : "processing_failed";
      const remarks = selectedOptions.join(", ");

      // Call the first API to get the resume by phone number
      const resumeResponse = await axios.get(
        `https://api.jinnhire.in/jinnhire/data/resume-insights/get-resume-by-phone/`,
        {
          params: {
            phone_number: selectedProfile.candidate_phone_number,
          },
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const resumeData = resumeResponse.data;

      // Call the second API to update the resume state
      await axios.patch(
        `https://api.jinnhire.in/jinnhire/data/resumes/${resumeData.resume_id}/update-state/`,
        {
          state: state,
          remarks: remarks,
          validity: null,
          processing_user_id: parsedUserData.id,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      // Call the third API to unlock the resume
      await axios.post(
        `https://api.jinnhire.in/jinnhire/data/resumes/${resumeData.resume_id}/unlock/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      // Call the fourth API to update the candidate processing state
      await axios.put(
        `https://api.jinnhire.in/jinnhire/data/candidate-state-machines/${selectedProfile.candidate_phone_number}/`,
        {
          candidate_processing_state: state,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      setShow(true);
      setSeverity("success");
      setMessage("Successfully updated candidate state.");

      fetchProfiles(selectedTab); // Refresh profiles after submission
      // Close the modal after submission

      setSelectedOptions([]);
      setSelectedProfile(null);
    } catch (error) {
      console.error("Error submitting", error);
      setSelectedOptions([]);
      setShow(true);
      setSeverity("error");
      if (error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Failed to update candidate state.");
      }
    }
    handleCloseModal();
  };

  const updateLockStatus = async (phoneNumber, jd_id) => {
    const token = localStorage.getItem("token");
    const uniqueJdIds = [...new Set(profiles.map((profile) => profile.jd_id))];
    const lockStatusMap = {};
    const fileLinksMap = {};

    try {
      for (const jd_id of uniqueJdIds) {
        const resumes = await fetchResumes(jd_id);
        resumes.forEach((resume) => {
          lockStatusMap[resume.phone_number] = !!resume.locked_by?.id;
          fileLinksMap[resume.phone_number] = resume.file_link; // Assuming file_link is the correct field
        });
      }
      console.log(lockStatusMap, "LOCK STATUS");
      setLockStatus(lockStatusMap);
      setFileLinks(fileLinksMap);
    } catch (error) {
      console.error("Error updating lock status:", error);
      setShow(true);
      setMessage("Error updating lock status");
      setSeverity("error");
    }
  };

  const handleLockUnlock = async (phoneNumber, isLocked) => {
    const token = localStorage.getItem("token");

    try {
      // Step 1: Fetch resume details by phone number
      const response = await axios.get(
        `https://api.jinnhire.in/jinnhire/data/resume-insights/get-resume-by-phone/?phone_number=${phoneNumber}`,
        { headers: { Authorization: `Token ${token}` } }
      );

      const resumeId = response.data.resume_id;

      // Step 2: Lock or unlock the resume based on current lock status
      if (lockStatus[phoneNumber]) {
        await axios.post(
          `https://api.jinnhire.in/jinnhire/data/resumes/${resumeId}/unlock/`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        );
        setShow(true);
        setMessage("Resume unlocked successfully.");
        setSeverity("success");
      } else {
        await axios.post(
          `https://api.jinnhire.in/jinnhire/data/resumes/${resumeId}/lock/`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        );
        setShow(true);
        setMessage("Resume locked successfully.");
        setSeverity("success");
      }

      // Step 3: Update lock status in state
      setLockStatus((prevLockStatus) => ({
        ...prevLockStatus,
        [phoneNumber]: !lockStatus[phoneNumber],
      }));
    } catch (error) {
      console.error("Error locking/unlocking resume:", error);
      setShow(true);
      setMessage("Error locking/unlocking resume.");
      setSeverity("error");
    }
  };
  console.log(optedInRequirements, "OPIn");
  return (
    <ThemeProvider theme={theme}>
      <Container style={{ backgroundColor: "#ffff", boxShadow: "none" }}>
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
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}></Box>

        <Box sx={{ display: 'flex', height: '60vh' }}>
          {/* Vertical Tabs */}
          <Box sx={{ width: '200px', mr: 2 }}>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={false}
              aria-label="Vertical tabs"
              sx={{
                borderRadius: '8px',
                backgroundColor: '#fcfcfc',
                borderColor: '#e0e0e0',
                borderStyle: 'solid',
                borderWidth: '1px',
                maxHeight:"60vh",
                color:"black"
              }}
            >
              <Typography variant="h6" sx={{ flexGrow: 1, padding: "20px", fontWeight: 'bold' , backgroundColor:"rgb(28, 66, 109)", color:"white"}}>
                Requirements
              </Typography>
              <Divider />
              {optedInRequirements.map((requirement, index) => (
                <React.Fragment key={requirement.requirement_id}>
                  <Tab
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                          width: "170px",
                        }}
                      >
                        <Switch
                          checked={optedIn[requirement.requirement_id] || false}
                          onChange={() =>
                            handleOptInChange(requirement.requirement_id)
                          }
                          color={optedIn[requirement.requirement_id] ? "primary" : "default"}
                        />
                        <Typography variant="body2">
                          {requirement.requirement_id}
                        </Typography>
                      </Box>
                    }
                  />
                  {index < optedInRequirements.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Tabs>
          </Box>

          {/* Table with Horizontal Scroll */}
          <Box sx={{ flexGrow: 1 ,
                borderRadius: '8px',
                backgroundColor: '#fcfcfc',
                borderColor: '#e0e0e0',
                borderStyle: 'solid',
                borderWidth: '1px',
             }}>
            {/* Header for Select Dropdown (acts as a table heading) */}
            {/* <Box sx={{ }}>
              <FormControl sx={{ width: 300, borderColor: '#e0e0e0', borderStyle: 'solid', borderWidth: '1px', borderRadius: '4px' }}>
                <Select
                  labelId="profile-status-select-label"
                  id="profile-status-select"
                  value={selectedTab}
                  onChange={handleTabChange}
                  sx={{ borderColor: '#e0e0e0' }}
                >
                  <MenuItem value={0}>Communication Failed</MenuItem>
                  <MenuItem value={1}>Suitable Profiles</MenuItem>
                  <MenuItem value={2}>Profiles Needing Intervention</MenuItem>
                  <MenuItem value={3}>Unsuccessful Profiles</MenuItem>
                  <MenuItem value={4}>In-Progress</MenuItem>
                  <MenuItem value={5}>No-Response</MenuItem>
                  <MenuItem value={6}>Dormant Profiles</MenuItem>
                </Select>
              </FormControl>
            </Box> */}
            <Paper sx={{ bgcolor: "#e3f2fd"}}>
          <AppBar position="static">
        <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="scrollable"
              aria-label="Profile tabs"
              sx={{ bgcolor: "#0696cb" }}
            >
              <Tab label="Communication Failed" />
              <Tab label="Suitable Profiles" />
              <Tab label="Profiles Needing Intervention" />
              <Tab label="Unsuccessful Profiles" />
              <Tab label="In-Progress" />
              <Tab label="No-Response" />
              <Tab label="Dormant Profiles" />
            </Tabs>
          </AppBar>
        </Paper>
            <Table size="small" sx={{ borderColor: '#e0e0e0', borderStyle: 'solid', borderWidth: '1px' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#4e8daf", color: "#fff" }}>
                  {tableHeaders[selectedTab].map((header, index) => (
                    <TableCell
                      key={index}
                      sx={{
                        color: "#fff",
                        ...(header === "Current Question" && {
                          width: "300px",
                        }),
                        ...(header === "Actions" && { width: "160px" }),
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={tableHeaders[selectedTab].length}
                      align="center"
                    >
                      <Typography variant="body1" gutterBottom>
                        <CircularProgress color="secondary" size={24} /> Loading profiles...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : profiles.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={tableHeaders[selectedTab].length}
                      align="center"
                    >
                      <Typography variant="body1" gutterBottom>
                        No data available
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  profiles
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((profile, index) => (
                      <React.Fragment key={profile.candidate_phone_number}>
                        <TableRow>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell
                            onClick={() =>
                              handleJobDescriptionClick(profile.jd_id)
                            }
                            style={{ cursor: "pointer", color: "blue" }}
                          >
                            {profile.jd_id || "N/A"}
                          </TableCell>
                          <TableCell
                            style={{
                              padding: "12px 16px",
                              borderBottom: "1px solid #e0e0e0",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center" }}>
                              {`${profile.candidate_fname} ${profile.candidate_last_name}` || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell>
                            {profile.candidate_phone_number || "N/A"}
                          </TableCell>
                          {selectedTab === 0 && (
                            <TableCell>
                              {profile.remarks && profile.remarks.length > 0 ? profile.remarks : "N/A"}
                            </TableCell>
                          )}
                          {selectedTab === 0 && (
                            <TableCell>
                              {profile.skills && (
                                <Accordion sx={{ boxShadow: "none", margin: 0 }}>
                                  <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    sx={{
                                      minHeight: "auto",
                                      "& .MuiAccordionSummary-content": {
                                        margin: 0,
                                      },
                                    }}
                                  >
                                    <Typography variant="body2">View Skills</Typography>
                                  </AccordionSummary>
                                  <AccordionDetails sx={{ padding: 0 }}>
                                    <Table size="small">
                                      <TableHead>
                                        <TableRow>
                                          <TableCell>Skill</TableCell>
                                          <TableCell>Occurrence</TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {Object.entries(profile.skills).map(
                                          ([skill, occurrence], skillIndex) => (
                                            <TableRow key={skillIndex}>
                                              <TableCell>{skill}</TableCell>
                                              <TableCell>{occurrence}</TableCell>
                                            </TableRow>
                                          )
                                        )}
                                      </TableBody>
                                    </Table>
                                  </AccordionDetails>
                                </Accordion>
                              )}
                            </TableCell>
                          )}
                          {selectedTab !== 0 && (
                            <TableCell>{profile.current_question}</TableCell>
                          )}
                          {selectedTab !== 0 && (
                            <>
                              <TableCell>
                                {profile.questions_asked_count || "N/A"}
                              </TableCell>
                              <TableCell>
                                {profile.answer_count || "N/A"}
                              </TableCell>
                              <TableCell>
                                {profile.unanswered_question_count || "N/A"}
                              </TableCell>
                            </>
                          )}
                          {selectedTab === 3 && (
                            <TableCell>{profile.reason || "N/A"}</TableCell>
                          )}
                          <TableCell>
                            <IconButton
                              onClick={(event) => handleMenuOpen(event, profile)}
                            >
                              <MoreVert />
                            </IconButton>
                            <Menu
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl && selectedProfile === profile)}
                              onClose={handleMenuClose}
                            >
                              <MenuActionItem
                                onClick={() => {
                                  const fileLink =
                                    profile.file_link ||
                                    fileLinks[profile.candidate_phone_number];
                                  if (fileLink) {
                                    window.open(fileLink, "_blank");
                                  } else {
                                    console.error("File link is not available");
                                  }
                                  handleMenuClose();
                                }}
                
                              >
                                <Tooltip title="Download Resume" placement="top">
                                  <Download fontSize="small" color="primary"/>
                                </Tooltip>
                                Download Resume
                              </MenuActionItem>
                              <MenuActionItem
                                onClick={() => {
                                  handleLockUnlock(profile);
                                  handleMenuClose();
                                }}
                              >
                                <Tooltip
                                  title={lockStatus[profile.candidate_phone_number] ? "Unlock" : "Lock"}
                                  placement="top"
                                >
                                  {profile.locked ? (
                                    <LockOpen fontSize="small" color="primary" />
                                  ) : (
                                    <Lock fontSize="small" />
                                  )}
                                </Tooltip>
                               {lockStatus[profile.candidate_phone_number] ? "Unlock" : "Lock"}
                              </MenuActionItem>
                              <MenuActionItem onClick={handleMenuClose}>
                                <Tooltip title="Close" placement="top">
                                  <Cancel fontSize="small" color="error" />
                                </Tooltip>
                                Close
                              </MenuActionItem>
                            </Menu>
                          </TableCell>
                          {/* <TableCell>
                            {profile.file_link ||
                                fileLinks[profile.candidate_phone_number] .some(
                              (link) =>
                                link.profile_id === profile.profile_id
                            ) ? (
                              <Check color="success" />
                            ) : (
                              <Cancel color="error" />
                            )}
                          </TableCell> */}
                          {/* <TableCell>
                            <Accordion
                              expanded={expandedAccordion === profile.profile_id}
                              onChange={() =>
                                handleAccordionChange(profile.profile_id)
                              }
                              sx={{
                                boxShadow: "none",
                                "&:before": { display: "none" },
                              }}
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMore />}
                                sx={{
                                  minHeight: "auto",
                                  padding: "0",
                                  "& .MuiAccordionSummary-content": {
                                    margin: 0,
                                  },
                                }}
                              />
                              <AccordionDetails sx={{ padding: "0" }}>
                                <Box
                                  sx={{
                                    backgroundColor: "#f5f5f5",
                                    borderTop: "1px solid #ddd",
                                  }}
                                >
                                  {parseQuestionsList(profile.questions_list)}
                                </Box>
                              </AccordionDetails>
                            </Accordion>
                          </TableCell> */}
                        </TableRow>
                      </React.Fragment>
                    ))
                )}
              </TableBody>
            </Table>

            {/* Table Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={profiles.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    
  );
};

export default Process;
