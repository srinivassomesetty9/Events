import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  Fragment,
} from "react";
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
  MenuItem as MenuActionItem,
  TextField,
  Avatar,
  RadioGroup,
  Radio,
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
import { AppContext } from "./AppContext";
import { grey, blue, green, red } from "@mui/material/colors";
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

const Process = ({ optedInRequirements, handleToggle }) => {
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
  const [resumeId, setResumeID] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null); // Track selected profile for modal actions
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [lockStatus, setLockStatus] = useState({});
  const [fileLinks, setFileLinks] = useState({});
  const [optedIn, setOptedIn] = useState(
    optedInRequirements.reduce((acc, req) => ({ ...acc, [req]: true }), {})
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const initialRender = useRef(true);
  const { resumeAssignmentStrategy } = useContext(AppContext);
  const previousTab = useRef(selectedTab);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);

  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [loading, setLoading] = useState(true);
  const [selectedComment, setSelectedComment] = useState("");

  const predefinedComments = [
    "Candidate is not answering the calls",
    "Another recruiter is already working on this profile",
    "Candidate asked to call back later",
    "Candidate phone is off",
    "Other (Please specify below)",
  ];
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

  const handleSkip = async (comments) => {
    const token = localStorage.getItem("token");
    if (!resumeId) {
      console.warn("resumeId is empty, skipping API call");
      return;
    }

    try {
      const response = await axios.post(
        "https://api.jinnhire.in/jinnhire/data/resumes/skip_resume/",
        {
          resume_id: resumeId,
          comment: commentInput,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log("Resume skipped successfully", response.data);
      // Add the new comment to the comments list
      setComments([...comments, response.data]);
      setCommentInput("");
    } catch (error) {
      console.error("Error skipping resume", error);
      // Optionally handle error (e.g., show an error message)
    }
  };

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

  
  useEffect(() => {
    if (initialRender.current) {
      // Call fetchProfiles only once on initial render
      fetchProfiles(selectedTab);
      initialRender.current = false; // Set to false to avoid fetching on subsequent renders
    } else {
      // Handle tab change: call handleSkip if tab changes from 0 to another tab
      if (previousTab.current === 0 && selectedTab !== 0) {
        handleSkip();
      }
    }

    // Update previousTab ref to the current selectedTab
    previousTab.current = selectedTab;
  }, [selectedTab, handleSkip, fetchProfiles]);

  useEffect(() => {
    if (profiles.length > 0) {
      updateLockStatus();
    }
  }, [profiles]);


  const fetchCommunicationFailedProfiles = async (jdId) => {
    const token = localStorage.getItem("token");
    const cacheBuster = new Date().getTime();

    try {
      // const resumesResponse = await fetchResumesByStatus(
      //   "communication_failed"
      // );

      const resumesResponse = await (resumeAssignmentStrategy !== "pool_based"
        ? fetchResumesByStatus("communication_failed")
        : fetchResumesFromPool());

      // if (!Array.isArray(resumesResponse) || resumesResponse.length === 0) {
      //   console.error("No resumes found with communication_failed status");
      //   setProfiles([]);
      //   setLoading(false);
      //   return;
      // }
      const requirements = optedInRequirements;

      // const profilesData = resumesResponse.map((resume) => ({
      //   resume_id: resume.resume_id,
      //   jd_id: resume.requirement_id,
      //   candidate_fname: resume.insights[0]?.first_name || "",
      //   candidate_last_name: resume.insights[0]?.last_name || "",
      //   candidate_phone_number: resume.phone_number || "",
      //   emailAddress: resume.insights[0]?.email_id || "",
      //   state: resume.state,
      //   file_link: resume.file_link,
      //   remarks: resume.remarks,
      //   skills: resume.insights[0].mandatory_skills,
      // }));

      let profilesData = [];

      if (Array.isArray(resumesResponse)) {
        // Case where fetchResumesFromPool returns an array of resumes
        profilesData = resumesResponse.map((resumeData) => ({
          resume_id: resumeData.resume_id,
          jd_id: resumeData.requirement_id,
          candidate_fname: resumeData.insights[0]?.first_name || "",
          candidate_last_name: resumeData.insights[0]?.last_name || "",
          candidate_phone_number: resumeData.phone_number || "",
          emailAddress: resumeData.insights[0]?.email_id || "",
          state: resumeData.state || "",
          file_link: resumeData.file_link,
          remarks: resumeData.remarks || "",
          skills: resumeData.insights[0]?.mandatory_skills || {},
        }));
      } else if (resumesResponse && resumesResponse.resume) {
        // Case where fetchResumesFromPool returns an object with a single resume
        const resumeData = resumesResponse.resume;
        profilesData = [
          {
            resume_id: resumeData.resume_id,
            jd_id: resumeData.requirement_id,
            candidate_fname: resumeData.insights[0]?.first_name || "",
            candidate_last_name: resumeData.insights[0]?.last_name || "",
            candidate_phone_number: resumeData.phone_number || "",
            emailAddress: resumeData.insights[0]?.email_id || "",
            state: resumeData.state || "",
            file_link: resumeData.file_link,
            remarks: resumeData.remarks || "",
            skills: resumeData.insights[0]?.mandatory_skills || {},
          },
        ];
      } else {
        console.error(
          "Invalid response format from fetchResumesFromPool:",
          resumesResponse
        );
        throw new Error("Invalid response format");
      }

      console.log("Fetched Profiles:", profilesData); // Debugging log
      setProfiles(profilesData);
      fetchComments(profilesData[0].resume_id);
      // setResumeID(profilesData[0].resume_id);
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

  const fetchResumesFromPool = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `https://api.jinnhire.in/jinnhire/data/resumes/assign_resume_from_pool/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      console.log(response.data, "POOL");
      setResumeID(response.data.resume.resume_id);
      return response.data;
    } catch (error) {
      console.error("Error fetching resumes from pool:", error);
      throw error;
    }
  };



  const handleTabChange = (event, tabIndex) => {
    if (selectedTab !== tabIndex) {
      setSelectedTab(tabIndex);
      // setLoading(true);
    }
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

  const handleOpenCommentsModal = () => setCommentsModalOpen(true);
  const handleCloseCommentsModal = () => setCommentsModalOpen(false);

  const handleCommentChange = (event) => {
    const value = event.target.value;
    setSelectedComment(value);
    if (value !== "Other (Please specify below)") {
      setCommentInput(value); // Set comment input to the selected predefined comment
    } else {
      setCommentInput(""); // Clear the input if "Other" is selected
    }
  };

  const handleInputChange = (event) => {
    setCommentInput(event.target.value);
  };
  const handleCommentSubmit = () => {
    handleSkip(commentInput, resumeId);
    fetchCommunicationFailedProfiles();
    setCommentsModalOpen(false);
    setCommentInput(""); // Clear the input after submission
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

  // useEffect(() => {
  //   fetchComments();
  // }, []);

  const fetchComments = async (resumeId) => {
    try {
      console.log(profiles, "Cmmm");
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://api.jinnhire.in/jinnhire/data/skip_comments/",
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          params: { resume_id: resumeId },
        }
      );
      setComments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
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
      setProfiles([]);
      setSelectedOptions([]);
      setSelectedProfile(null);
    } catch (error) {
      console.error("Error submitting", error);
      setProfiles([]);
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

  const renderTableHeader = () => (
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
  );

  const renderLoadingRow = () => (
    <TableRow>
      <TableCell colSpan={tableHeaders[selectedTab].length} align="center">
        <Typography variant="body1" gutterBottom>
          <CircularProgress color="secondary" size={24} /> Loading profiles...
        </Typography>
      </TableCell>
    </TableRow>
  );

  const renderNoDataRow = () => (
    <TableRow>
      <TableCell colSpan={tableHeaders[selectedTab].length} align="center">
        <Typography variant="body1" gutterBottom>
          No data available
        </Typography>
      </TableCell>
    </TableRow>
  );

  const formatRecruiterName = (email) => {
    if (!email) return "Unknown Recruiter";
    const name = email.split("@")[0];
    return name.replace(".", " ");
  };

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

        <Box sx={{ display: "flex", "min-height": "60vh" }}>
          {/* Vertical Tabs */}
          <Box sx={{ width: "200px", mr: 2 }}>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={false}
              aria-label="Vertical tabs"
              sx={{
                borderRadius: "8px",
                backgroundColor: "#fcfcfc",
                borderColor: "#e0e0e0",
                borderStyle: "solid",
                borderWidth: "1px",
                maxHeight: "60vh",
                color: "black",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  flexGrow: 1,
                  padding: "20px",
                  fontWeight: "bold",
                  backgroundColor: "rgb(28, 66, 109)",
                  color: "white",
                }}
              >
                Requirements
              </Typography>
              <Divider />
              {optedInRequirements
                .filter((requirement) => requirement.active) // Filter opted-in requirements first
                .concat(
                  optedInRequirements.filter(
                    (requirement) => !requirement.active
                  )
                ) // Concatenate non-opted-in requirements
                .map((requirement, index) => (
                  <div key={requirement.requirement_id}>
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
                          <span>
                            <Switch
                              checked={requirement.active || false}
                              onChange={(event) =>
                                handleToggle(requirement, event)
                              }
                              color={
                                requirement.active
                                  ? "success"
                                  : requirement.users_opted.length >= 5
                                  ? "text.disabled"
                                  : "error"
                              }
                              size="small"
                              disabled={
                                requirement.users_opted.length >= 5 &&
                                !requirement.active
                              }
                            />
                          </span>

                          <Typography variant="body2">
                            {requirement.requirement_id}
                          </Typography>
                        </Box>
                      }
                    />
                    {index < optedInRequirements.length - 1 && <Divider />}
                  </div>
                ))}
            </Tabs>
          </Box>

          {/* Table with Horizontal Scroll */}
          {resumeAssignmentStrategy !== "pool_based" ? (
            <Box>
              {/* Add your pool based specific UI here */}
              <Paper sx={{ bgcolor: "#e3f2fd", marginBottom: "20px" }}>
                <AppBar position="static">
                  <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    aria-label="Profile tabs"
                    sx={{ bgcolor: "#4e8daf" }}
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
              <Box sx={{ overflowX: "auto" }}>
                <Table>
                  {renderTableHeader()}
                  <TableBody>
                    {loading
                      ? renderLoadingRow()
                      : profiles.length === 0
                      ? renderNoDataRow()
                      : profiles
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((profile, index) => (
                            <>
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
                                <TableCell
                                  style={{
                                    padding: "12px 16px",
                                    borderBottom: "1px solid #e0e0e0",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {`${profile.candidate_fname} ${profile.candidate_last_name}` ||
                                      "N/A"}
                                  </div>
                                </TableCell>

                                <TableCell>
                                  {profile.candidate_phone_number || "N/A"}
                                </TableCell>
                                {selectedTab === 0 && (
                                  <TableCell>
                                    {profile.remarks &&
                                    profile.remarks.length > 0
                                      ? profile.remarks
                                      : "N/A"}
                                  </TableCell>
                                )}
                                {selectedTab === 0 && (
                                  <TableCell>
                                    {profile.skills && (
                                      <Accordion
                                        sx={{ boxShadow: "none", margin: 0 }}
                                      >
                                        <AccordionSummary
                                          expandIcon={<ExpandMore />}
                                          sx={{
                                            minHeight: "auto",
                                            "& .MuiAccordionSummary-content": {
                                              margin: 0,
                                            },
                                          }}
                                        >
                                          <Typography variant="body2">
                                            {" "}
                                            View Skills
                                          </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ padding: 0 }}>
                                          <Table size="small">
                                            <TableHead>
                                              <TableRow>
                                                <TableCell>Skill</TableCell>
                                                <TableCell>
                                                  Occurrence
                                                </TableCell>
                                              </TableRow>
                                            </TableHead>
                                            <TableBody>
                                              {Object.entries(
                                                profile.skills
                                              ).map(
                                                (
                                                  [skill, occurrence],
                                                  skillIndex
                                                ) => (
                                                  <TableRow key={skillIndex}>
                                                    <TableCell>
                                                      {skill}
                                                    </TableCell>
                                                    <TableCell>
                                                      {occurrence}
                                                    </TableCell>
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
                                  <TableCell>
                                    {profile.current_question}
                                  </TableCell>
                                )}
                                {selectedTab === 1 && (
                                  <TableCell>
                                    {profile.reason_for_conversation_stopping ||
                                      "N/A"}
                                  </TableCell>
                                )}
                                {selectedTab === 2 && (
                                  <TableCell>
                                    {profile.reason_for_failure || "N/A"}
                                  </TableCell>
                                )}
                                {selectedTab === 3 && (
                                  <TableCell>
                                    {profile.waiting_time || "N/A"}
                                  </TableCell>
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
                                  {!lockStatus[
                                    profile.candidate_phone_number
                                  ] ? (
                                    <Tooltip title="Lock to Approve or Reject">
                                      <IconButton disabled>
                                        <Check />
                                      </IconButton>
                                      <IconButton disabled>
                                        <Cancel />
                                      </IconButton>
                                    </Tooltip>
                                  ) : (
                                    <>
                                      <Tooltip title="Approve">
                                        <IconButton
                                          color="success"
                                          onClick={() =>
                                            handleOpenModal(true, profile)
                                          }
                                        >
                                          <Check />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Reject">
                                        <IconButton
                                          color="error"
                                          onClick={() =>
                                            handleOpenModal(false, profile)
                                          }
                                        >
                                          <Cancel />
                                        </IconButton>
                                      </Tooltip>
                                    </>
                                  )}
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
                                          lockStatus[
                                            profile.candidate_phone_number
                                          ]
                                        )
                                      }
                                    >
                                      {lockStatus[
                                        profile.candidate_phone_number
                                      ] ? (
                                        <Lock color="action" />
                                      ) : (
                                        <LockOpen />
                                      )}
                                    </IconButton>
                                  </Tooltip>

                                  <Tooltip title="Download Resume">
                                    <IconButton
                                      color="info"
                                      onClick={() => {
                                        const fileLink =
                                          profile.file_link ||
                                          fileLinks[
                                            profile.candidate_phone_number
                                          ];
                                        if (fileLink) {
                                          window.open(fileLink, "_blank");
                                        } else {
                                          console.error(
                                            "File link is not available"
                                          );
                                        }
                                      }}
                                    >
                                      <Download />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>

                                {selectedTab !== 0 && (
                                  <TableCell>
                                    <Accordion
                                      expanded={expandedAccordion === index + 1}
                                      onChange={() =>
                                        handleAccordionChange(index + 1)
                                      }
                                    >
                                      <AccordionSummary
                                        expandIcon={<RemoveRedEye />}
                                      >
                                        View
                                      </AccordionSummary>
                                    </Accordion>
                                  </TableCell>
                                )}
                              </TableRow>
                              {selectedTab !== 0 && (
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
                                                <TableCell>
                                                  {qIndex + 1}
                                                </TableCell>
                                                <TableCell>
                                                  {question.question}
                                                </TableCell>
                                                <TableCell>
                                                  {question.answer}
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </Box>
                                    </Collapse>
                                  </TableCell>
                                </TableRow>
                              )}
                            </>
                          ))}
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
            </Box>
          ) : (
            <Box
              sx={{
                flexGrow: 1,
                borderRadius: "16px",
                backgroundColor: "#fcfcfc",
                borderColor: "#e0e0e0",
                borderStyle: "solid",
                borderWidth: "1px",
              }}
            >
              <Paper sx={{ bgcolor: "#e3f2fd" }}>
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
              <Table
                size="small"
                sx={{
                  borderColor: "#e0e0e0",
                  borderStyle: "solid",
                  borderWidth: "1px",
                }}
              >
                {renderTableHeader()}
                <TableBody>
                  {loading
                    ? renderLoadingRow()
                    : profiles.length === 0
                    ? renderNoDataRow()
                    : profiles
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((profile, index) => (
                          <Fragment key={profile.candidate_phone_number}>
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
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {`${profile.candidate_fname} ${profile.candidate_last_name}` ||
                                    "N/A"}
                                </div>
                              </TableCell>
                              <TableCell>
                                {profile.candidate_phone_number || "N/A"}
                              </TableCell>
                              {selectedTab === 0 && (
                                <TableCell>
                                  {profile.remarks && profile.remarks.length > 0
                                    ? profile.remarks
                                    : "N/A"}
                                </TableCell>
                              )}
                              {selectedTab === 0 && (
                                <TableCell>
                                  {profile.skills && (
                                    <Accordion
                                      sx={{ boxShadow: "none", margin: 0 }}
                                    >
                                      <AccordionSummary
                                        expandIcon={<ExpandMore />}
                                        sx={{
                                          minHeight: "auto",
                                          "& .MuiAccordionSummary-content": {
                                            margin: 0,
                                          },
                                        }}
                                      >
                                        <Typography variant="body2">
                                          View Skills
                                        </Typography>
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
                                              (
                                                [skill, occurrence],
                                                skillIndex
                                              ) => (
                                                <TableRow key={skillIndex}>
                                                  <TableCell>{skill}</TableCell>
                                                  <TableCell>
                                                    {occurrence}
                                                  </TableCell>
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
                                <TableCell>
                                  {profile.current_question}
                                </TableCell>
                              )}
                              {selectedTab === 1 && (
                                <TableCell>
                                  {profile.reason_for_conversation_stopping ||
                                    "N/A"}
                                </TableCell>
                              )}
                              {selectedTab === 2 && (
                                <TableCell>
                                  {profile.reason_for_failure || "N/A"}
                                </TableCell>
                              )}
                              {selectedTab === 3 && (
                                <TableCell>
                                  {profile.waiting_time || "N/A"}
                                </TableCell>
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
                                <IconButton
                                  onClick={(event) =>
                                    handleMenuOpen(event, profile)
                                  }
                                >
                                  <MoreVert />
                                </IconButton>
                                <Menu
                                  anchorEl={anchorEl}
                                  open={Boolean(
                                    anchorEl && selectedProfile === profile
                                  )}
                                  onClose={handleMenuClose}
                                >
                                  <Tooltip
                                    title={
                                      lockStatus[profile.candidate_phone_number]
                                        ? "Approve"
                                        : "Lock to approve"
                                    }
                                    placement="top"
                                  >
                                    <span>
                                      <MenuItem
                                        onClick={() => {
                                          // if (
                                          //   lockStatus[
                                          //     profile.candidate_phone_number
                                          //   ]
                                          // ) {
                                          handleOpenModal(true, profile);
                                          // }
                                          // handleMenuClose();
                                        }}
                                        disabled={
                                          !lockStatus[
                                            profile.candidate_phone_number
                                          ]
                                        }
                                      >
                                        <Check
                                          fontSize="small"
                                          color="success"
                                        />
                                        Approve
                                      </MenuItem>
                                    </span>
                                  </Tooltip>
                                  <Tooltip
                                    title={
                                      lockStatus[profile.candidate_phone_number]
                                        ? "Reject"
                                        : "Lock to reject"
                                    }
                                    placement="top"
                                  >
                                    <span>
                                      <MenuItem
                                        onClick={() => {
                                          // if (
                                          //   lockStatus[
                                          //     profile.candidate_phone_number
                                          //   ]
                                          // ) {
                                          handleOpenModal(false, profile);
                                          // }
                                          // handleMenuClose();
                                        }}
                                        disabled={
                                          !lockStatus[
                                            profile.candidate_phone_number
                                          ]
                                        }
                                      >
                                        <Cancel
                                          fontSize="small"
                                          color="error"
                                        />
                                        Reject
                                      </MenuItem>
                                    </span>
                                  </Tooltip>
                                  <MenuItem
                                    onClick={() => {
                                      const fileLink =
                                        profile.file_link ||
                                        fileLinks[
                                          profile.candidate_phone_number
                                        ];
                                      if (fileLink) {
                                        window.open(fileLink, "_blank");
                                      } else {
                                        console.error(
                                          "File link is not available"
                                        );
                                      }
                                      handleMenuClose();
                                    }}
                                  >
                                    <Tooltip
                                      title="Download Resume"
                                      placement="top"
                                    >
                                      <Download fontSize="small" color="info" />
                                    </Tooltip>
                                    Download
                                  </MenuItem>
                                  {/* <MenuItem
                                  onClick={() => {
                                    handleLockUnlock(
                                      profile.candidate_phone_number,
                                      profile.phone,
                                      lockStatus[profile.candidate_phone_number]
                                    );
                                    handleMenuClose();
                                  }}
                                >
                                  <Tooltip
                                    title={
                                      lockStatus[profile.candidate_phone_number]
                                        ? "Unlock"
                                        : "Lock"
                                    }
                                    placement="top"
                                  >
                                    {lockStatus[
                                      profile.candidate_phone_number
                                    ] ? (
                                      <LockOpen fontSize="small" />
                                    ) : (
                                      <Lock fontSize="small" color="action" />
                                    )}
                                  </Tooltip>
                                  {lockStatus[profile.candidate_phone_number]
                                    ? "Unlock"
                                    : "Lock"}
                                </MenuItem> */}
                                </Menu>
                              </TableCell>

                              {selectedTab !== 0 && (
                                <TableCell>
                                  <Accordion
                                    expanded={expandedAccordion === index + 1}
                                    onChange={() =>
                                      handleAccordionChange(index + 1)
                                    }
                                  >
                                    <AccordionSummary
                                      expandIcon={<RemoveRedEye />}
                                    >
                                      View
                                    </AccordionSummary>
                                  </Accordion>
                                </TableCell>
                              )}
                            </TableRow>
                            {selectedTab !== 0 && (
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
                                              <TableCell>
                                                {qIndex + 1}
                                              </TableCell>
                                              <TableCell>
                                                {question.question}
                                              </TableCell>
                                              <TableCell>
                                                {question.answer}
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </Box>
                                  </Collapse>
                                </TableCell>
                              </TableRow>
                            )}
                            {/* Add the comments section */}
                            <TableRow>
                              <TableCell colSpan={6} style={{ padding: 0 }}>
                                <Collapse in={true}>
                                  <Box sx={{ margin: 2 }}>
                                    <Typography
                                      variant="h5"
                                      sx={{ mb: 2, fontWeight: "bold" }}
                                    >
                                      Comments
                                    </Typography>
                                    {loadingComments ? (
                                      <Typography
                                        variant="body1"
                                        sx={{ color: "text.primary" }}
                                      >
                                        Loading...
                                      </Typography>
                                    ) : comments.length === 0 ? (
                                      <Typography
                                        variant="body1"
                                        sx={{ color: "text.secondary" }}
                                      >
                                        No Comments
                                      </Typography>
                                    ) : (
                                      comments.map((comment, cIndex) => (
                                        <Box
                                          key={cIndex}
                                          display="flex"
                                          alignItems="flex-start"
                                          mb={1}
                                          p={1}
                                          borderRadius="20px"
                                          border={1}
                                          borderColor="divider"
                                        >
                                          <Avatar
                                            sx={{
                                              bgcolor: "#3a6db7",
                                              mr: 2,
                                              width: 40,
                                              height: 40,
                                            }}
                                          >
                                            {/* {formatRecruiterName(comment.recruiter_name)} */}
                                          </Avatar>
                                          <Box sx={{ flexGrow: 1 }}>
                                            <Box
                                              display="flex"
                                              justifyContent="space-between"
                                              mb={1}
                                            >
                                              <Typography
                                                variant="subtitle1"
                                                sx={{ fontWeight: "medium" }}
                                              >
                                                {formatRecruiterName(
                                                  comment.recruiter_name
                                                )}
                                              </Typography>
                                              <Typography
                                                variant="caption"
                                                color="textSecondary"
                                              >
                                                {new Date(
                                                  comment.created_at
                                                ).toLocaleString()}
                                              </Typography>
                                            </Box>
                                            <Typography
                                              variant="body2"
                                              sx={{ lineHeight: 1.6 }}
                                            >
                                              {comment.comment || "N/A"}
                                            </Typography>
                                          </Box>
                                        </Box>
                                      ))
                                    )}
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          </Fragment>
                        ))}
                </TableBody>
              </Table>
              {/* Table Pagination */}
              {profiles.length >= 5 && (
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={profiles.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              )}

              {/* Buttons Section */}
              {selectedTab === 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end", // Aligns items to the right
                    alignItems: "center",
                    // marginTop: 2,
                    padding: 2,
                    borderTop: "1px solid #e0e0e0",
                  }}
                >
                  <button
                    onClick={handleOpenCommentsModal}
                    style={{
                      backgroundColor: "transparent",
                      color: "#1976d2",
                      border: "2px solid #1976d2",
                      borderRadius: "4px",
                      padding: "8px 16px",
                      fontSize: "16px",
                      cursor: "pointer",
                      marginRight: "8px",
                    }}
                  >
                    Skip
                  </button>
                  <button
                    onClick={fetchCommunicationFailedProfiles}
                    style={{
                      backgroundColor:
                        profiles.length === 0 ? "#dc004e" : "transparent",
                      color: profiles.length === 0 ? "#fff" : "GrayText",
                      border: profiles.length === 0 ? "none" : "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "8px 16px",
                      fontSize: "16px",
                      cursor: profiles.length === 0 ? "pointer" : "not-allowed",
                    }}
                    disabled={profiles.length !== 0}
                  >
                    Next
                  </button>
                </Box>
              )}
            </Box>
          )}
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
              onClick={handleCloseModal}
              variant="contained"
              color="error"
              sx={{ mt: 3 }}
            >
              Close
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="success"
              sx={{ mt: 3 }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={commentsModalOpen}
        onClose={handleCloseCommentsModal}
        aria-labelledby="modal-comments-title"
        aria-describedby="modal-comments-description"
      >
        <Box sx={modalStyle}>
          <Typography
            id="modal-comments-title"
            variant="h6"
            component="h2"
            color={blue[700]}
          >
            Provide Your Comments
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mt: 2 }}>
            <FormControl component="fieldset">
              <RadioGroup
                value={selectedComment}
                onChange={handleCommentChange}
              >
                {predefinedComments.map((comment, index) => (
                  <FormControlLabel
                    key={index}
                    value={comment}
                    control={
                      <Radio
                        sx={{
                          color: blue[700],
                          "&.Mui-checked": { color: blue[900] },
                        }}
                      />
                    }
                    label={comment}
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        color: grey[800],
                      },
                      mb: 1,
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
          {selectedComment === "Other (Please specify below)" && (
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Comments"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                value={commentInput}
                onChange={handleInputChange}
                placeholder="Enter your comment here"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderColor: grey[500],
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: grey[500],
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: blue[700],
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: blue[900],
                  },
                }}
              />
            </Box>
          )}
          <Box sx={buttonContainerStyle}>
            <Button
              onClick={handleCloseCommentsModal}
              variant="contained"
              sx={{
                backgroundColor: red[700],
                color: "white",
                "&:hover": { backgroundColor: red[800] },
              }}
            >
              Close
            </Button>
            <Button
              onClick={handleCommentSubmit}
              variant="contained"
              sx={{
                backgroundColor: green[700],
                color: "white",
                "&:hover": { backgroundColor: green[800] },
              }}
            >
              Submit
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
