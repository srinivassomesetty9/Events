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

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 450,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: "20px",
};

const checkboxContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  width: "100%",
};

const buttonContainerStyle = {
  marginTop: "auto",
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
};

// Define custom styles for checkboxes
const checkboxStyles = {
  positive: {
    "&.Mui-checked": {
      color: "green",
    },
    color: "green",
  },
  negative: {
    "&.Mui-checked": {
      color: "red",
    },
    color: "red",
  },
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

  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [loading, setLoading] = useState(false);

  const tableHeaders = {
    0: [
      "SNO",
      "Job Description ID",
      "Candidate Name",
      "Phone",
      "Email Address",
      "Current Question",
      "Actions",
      "Questions List",
    ],
    1: [
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
    2: [
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
    3: [
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
      "Email Address",
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
      "Actions",
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
    { text: "Candidate is not looking for change", style: checkboxStyles.negative },
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

  const fetchProfiles = async (tabIndex) => {
    setLoading(true);
    let reasonForConversationStopping = "";
    let additionalParams = {};

    switch (tabIndex) {
      case 0:
        reasonForConversationStopping = "success";
        break;
      case 1:
        reasonForConversationStopping = "not_interested";
        break;
      case 2:
        reasonForConversationStopping = "not_qualified";
        break;
      case 3:
        reasonForConversationStopping = "waiting";
        additionalParams = { conversation_continuing: "FUTURE" };
        break;
      case 4:
        reasonForConversationStopping = "continuing";
        break;
      case 5:
        reasonForConversationStopping = "waiting";
        additionalParams = { conversation_continuing: "YES" };
        break;
      case 6:
        fetchCommunicationFailedProfiles();
        return;
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

  const fetchCommunicationFailedProfiles = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const cacheBuster = new Date().getTime();

    try {
      // Fetch all requirements
      // const requirementsResponse = await fetch(
      //   `https://api.jinnhire.in/jinnhire/data/requirements/?t=${cacheBuster}`,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Token ${token}`,
      //     },
      //   }
      // );

      // if (!requirementsResponse.ok) {
      //   throw new Error(`HTTP error! Status: ${requirementsResponse.status}`);
      // }

      const requirements =  optedInRequirements;
      const allProfiles = [];

      for (let req of requirements) {
        const requirementId = req.requirement_id;

        if (!requirementId) {
          console.error("Requirement ID is missing from the data:", req);
          continue;
        }

        try {
          const resumesResponse = await fetchResumesByStatus(
            requirementId,
            "communication_failed"
          );

          if (!Array.isArray(resumesResponse) || resumesResponse.length === 0) {
            continue;
          }

          const profilesData = resumesResponse.map((resume) => ({
            resume_id: resume.resume_id,
            jd_id: requirementId,
            candidate_fname: resume.insights[0]?.first_name || "",
            candidate_last_name: resume.insights[0]?.last_name || "",
            candidate_phone_number: resume.phone_number || "",
            emailAddress: resume.insights[0]?.email_id || "",
            state: resume.state,
          }));

          allProfiles.push(...profilesData);
        } catch (error) {
          console.error("Failed to fetch resumes:", error);
        }
      }

      console.log("Fetched Profiles:", allProfiles); // Debugging log
      setProfiles(allProfiles);
    } catch (error) {
      console.error("Failed to fetch requirements:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResumesByStatus = async (requirementId, status) => {
    const token = localStorage.getItem("token");

    const cacheBuster = new Date().getTime();

    const response = await fetch(
      `https://api.jinnhire.in/jinnhire/data/requirements/${requirementId}/resumes_by_state_and_user?state=${status}&user_id=${parsedUserData.id}`,
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

      // Call the third API to update the candidate processing state
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

  console.log(optedInRequirements,"OPTED REQID")
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
        <Paper sx={{ bgcolor: "#e3f2fd", marginBottom: "20px" }}>
          <AppBar position="static">
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="scrollable"
              aria-label="Profile tabs"
              sx={{ bgcolor: "#4e8daf" }}
            >
              <Tab label="Suitable Profiles" />
              <Tab label="Profiles Needing Intervention" />
              <Tab label="Unsuccessful Profiles" />
              <Tab label="Dormant Profiles" />
              <Tab label="In-Progress" />
              <Tab label="No-Response" />
              <Tab label="Communication Failed" />
            </Tabs>
          </AppBar>
        </Paper>
        <Box sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#4e8daf", color: "#fff" }}>
                {tableHeaders[selectedTab].map((header, index) => (
                  <TableCell
                    key={index}
                    sx={{
                      color: "#fff",
                      ...(header === "Current Question" && { width: "300px" }),
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
                    <CircularProgress
                      color="secondary"
                      size={24}
                    /> Loading profiles...
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
                    <React.Fragment>
                      <TableRow key={profile.candidate_phone_number}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell
                          onClick={() =>
                            handleJobDescriptionClick(profile.jd_id)
                          }
                          style={{ cursor: "pointer", color: "blue" }}
                        >
                          {profile.jd_id || "N/A"}
                        </TableCell>
                        {/* <TableCell >
                        <a href={fileLinks[profile.candidate_phone_number]} target="_blank" rel="noopener noreferrer"> {`${profile.candidate_fname} ${profile.candidate_last_name}` ||
                            "N/A"} </a>
                        </TableCell> */}
                        <TableCell
                          style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid #e0e0e0",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {`${profile.candidate_fname} ${profile.candidate_last_name}` ||
                              "N/A"}
                          </div>
                        </TableCell>

                        <TableCell>
                          {profile.candidate_phone_number || "N/A"}
                        </TableCell>
                        <TableCell>{profile.emailAddress || "N/A"}</TableCell>
                        {selectedTab !== 6 && (
                          <TableCell>{profile.current_question}</TableCell>
                        )}
                        {selectedTab === 1 && (
                          <TableCell>
                            {profile.reason_for_conversation_stopping || "N/A"}
                          </TableCell>
                        )}
                        {selectedTab === 2 && (
                          <TableCell>
                            {profile.reason_for_failure || "N/A"}
                          </TableCell>
                        )}
                        {selectedTab === 3 && (
                          <TableCell>{profile.waiting_time || "N/A"}</TableCell>
                        )}
                        {selectedTab === 4 && (
                          <>
                            <TableCell>
                              {profile.last_follow_up_time || "N/A"}
                            </TableCell>
                            <TableCell>
                              {getDifferenceInMinutesFromIST(
                                profile.candidate_response_time
                              ) + " mins" || "N/A"}
                            </TableCell>
                          </>
                        )}
                        {selectedTab === 5 && (
                          <TableCell>
                            {profile.follow_up_count || "N/A"}
                          </TableCell>
                        )}
                        <TableCell>
                          <Tooltip title="Approve">
                            <IconButton
                              color="success"
                              onClick={() => handleOpenModal(true, profile)}
                            >
                              <Check />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <IconButton
                              color="error"
                              onClick={() => handleOpenModal(false, profile)}
                            >
                              <Cancel />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title={
                              lockStatus[profile.candidate_phone_number]
                                ? "Unlock"
                                : "Lock"
                            }
                          >
                            <IconButton
                              onClick={() =>
                                handleLockUnlock(
                                  profile.candidate_phone_number,
                                  profile.phone,
                                  lockStatus[profile.candidate_phone_number]
                                )
                              }
                            >
                              {lockStatus[profile.candidate_phone_number] ? (
                                <Lock color="action" />
                              ) : (
                                <LockOpen />
                              )}
                            </IconButton>
                          </Tooltip>
                          {fileLinks[profile.candidate_phone_number] && (
                            <Tooltip title="Download Resume">
                              <IconButton
                                color="info"
                                onClick={() => {
                                  const fileLink =
                                    fileLinks[profile.candidate_phone_number];
                                  if (fileLink) {
                                    window.open(fileLink, "_blank");
                                  } else {
                                    console.error("File link is not available");
                                    // Optionally, you can show a message or handle this case
                                  }
                                }}
                              >
                                <Download />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                        {selectedTab !== 6 && (
                          <TableCell>
                            <Accordion
                              expanded={expandedAccordion === index + 1}
                              onChange={() => handleAccordionChange(index + 1)}
                            >
                              <AccordionSummary expandIcon={<RemoveRedEye />}>
                                View
                              </AccordionSummary>
                            </Accordion>
                          </TableCell>
                        )}
                      </TableRow>
                      {selectedTab !== 6 && (
                        <TableRow>
                          <TableCell
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                            colSpan={10}
                          >
                            <Collapse in={expandedAccordion}>
                              <Box sx={{ margin: 1 }}>
                                <Typography variant="h6">
                                  Questions List
                                </Typography>
                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>SNO</TableCell>
                                      <TableCell>Question</TableCell>
                                      <TableCell>Answer</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {parseQuestionsList(
                                      profile.questions_list
                                    ).map((question, qIndex) => (
                                      <TableRow key={qIndex}>
                                        <TableCell>{qIndex + 1}</TableCell>
                                        <TableCell>
                                          {question.question}
                                        </TableCell>
                                        <TableCell>{question.answer}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
              )}
            </TableBody>
          </Table>

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
      </Container>
      <Modal
        open={modalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Candidate Evaluation
          </Typography>
          <Box sx={checkboxContainerStyle}>
            {modalContent.map((option, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    sx={option.style}
                    checked={selectedOptions.includes(option.text)}
                    onChange={(e) =>
                      handleCheckboxChange(option.text, e.target.checked)
                    }
                  />
                }
                label={option.text}
              />
            ))}
          </Box>
          <Box sx={buttonContainerStyle}>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="success"
              sx={{ mt: 3 }}
            >
              Submit
            </Button>
            <Button
              onClick={handleCloseModal}
              variant="contained"
              color="error"
              sx={{ mt: 3 }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
      <Dialog open={jdModalOpen} scroll="paper" maxWidth="md" fullWidth>
        <DialogTitle>Job Description</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ whiteSpace: "pre-wrap" }}>
            <Typography variant="body1" gutterBottom>
              {jdContent}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseJdModal}
            color="error"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default Process;
