import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Typography,
  Button,
  Grid,
  TextField,
  CircularProgress,
  IconButton,
  Box,
  Toolbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Checkbox,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import {
  Visibility,
  Delete,
  CopyAll,
  RemoveRedEye,
  Upload,
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import axios from "axios";
import SideBar from "./SideBar";
import BreadCrumb from "./BreadCrumb";
import ResumeManagement from "./ResumeManagement";
import TopBar from "./TopBar";
// import pdfjs from 'pdfjs-dist';
import mammoth from "mammoth";
import JSZip from "jszip";
import UploadModal from "./UploadModal";
// import pdfParser from 'pdf-parse';

export default function FileManagement() {
  const location = useLocation();
  const {
    requirement_id,
    experience,
    location: locationData,
    requirement_type,
    requirement_source,
    job_role,
    summary,
    experince,
    salary,
    description,
    country_of_job,
    search_string,
    notice_period,
    date_time_posted,
    requirement_priority,
    customer_name,
    mandatory_skills,
    current_candidate_location,
    joining_requirements,
    salary_offered_by_customer,
    shift_requirements,
    gender_requirement,
    num_resumes_required,
    num_resumes_submitted,
    bounty,
    stars,
    resumes,
    remarks_for_processing,
    remarks_for_sourcing,
  } = location.state || {};

  const [uploadedResumes, setUploadedResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResumes, setSelectedResumes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchString, setSearchString] = useState(search_string || "");
  const [jdDialogOpen, setJdDialogOpen] = useState(false);
  const [jdText, setJdText] = useState("");
  const [info, setInfo] = useState({
    requirement_id: requirement_id || "",
    experience: experience || "",
    location: locationData || "",
    salary: salary || "",
    notice_period: notice_period || "",
    requirement_priority: requirement_priority || "",
    shift_requirements: shift_requirements || "",
    gender_requirement: gender_requirement || "",
    bounty: bounty || 0,
    stars: stars || 0,
    requirement_type: requirement_type || "",
    requirement_source: requirement_source || "",
    job_role: job_role || "",
    summary: summary || "",
    description: description || "",
    country_of_job: country_of_job || "",
    // date_time_posted: date_time_posted || "",
    customer_name: customer_name || "",
    mandatory_skills: mandatory_skills || "",
    current_candidate_location: current_candidate_location || "",
    joining_requirements: joining_requirements || "",
    salary_offered_by_customer: salary_offered_by_customer || "",
    num_resumes_required: num_resumes_required || 0,
    num_resumes_submitted: num_resumes_submitted || 0,
    remarks_for_processing: remarks_for_processing || "",
    remarks_for_sourcing: remarks_for_sourcing || "",
  });
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [role, setRole] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isValidationDone, setIsValidationDone] = useState(false);
  const [failedUploads, setFailedUploads] = useState([]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    fetchUploadedResumes();
    const userData = localStorage.getItem("user");
    const getrole = JSON.parse(userData);
    // console.log(getrole.role,"ROLE")
    setRole(getrole.role);
    fetchFailedUploads();
  }, []);

  const userData = localStorage.getItem("user");
  const parsedUserData = JSON.parse(userData);

  const fetchUploadedResumes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://api.jinnhire.in/jinnhire/data/requirements/${requirement_id}/resumes/?state=parse_failed`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setUploadedResumes(response.data);
    } catch (error) {
      console.error("Error fetching uploaded resumes", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFailedUploads = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://api.jinnhire.in/jinnhire/data/failed-uploads`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setFailedUploads(response.data);
    } catch (error) {
      console.error("Error fetching failed uploads", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJD = async () => {
    try {
      const response = await axios.get(
        `https://api.jinnhire.in/media/${requirement_id}/JD_${requirement_id}_body.txt`
      );
      setJdText(response.data);
    } catch (error) {
      console.error("Error fetching JD", error);
    }
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("requirement_id", requirement_id);

    try {
      const token = localStorage.getItem("token");
      const data = await axios.post(
        "https://api.jinnhire.in/jinnhire/data/resumes/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
        }
      );
      setShow(true);
      setSeverity("success");

      // Check the status code of the response
      if (data.status === 201) {
        // Success status code
        setSeverity("success");
        const successMessage =
          data.data[0]?.message || "File uploaded successfully!";
        setMessage(successMessage);
      } else if (data.status === 207) {
        // Multi-Status code, handle the specific error
        const errorData = data.data[0];
        if (errorData.error.includes("not in a processable state")) {
          setSeverity("error");
          setMessage(
            `Resume with phone number ${errorData.existing_number} exists but is not in a processable state.`
          );
        } else {
          setSeverity("error");
          setMessage(errorData.error);
        }
      } else {
        // Other status codes
        setSeverity("error");
        setMessage("Unexpected response from the server.");
      }
      fetchUploadedResumes();
    } catch (error) {
      console.error("Error uploading file", error.response);
      setShow(true);
      const errorMessage1 = error.response.data.error;
      if (error.response.data.message) {
        const errorMessage = error.response.data.message;
        if (errorMessage.includes("already exists")) {
          // Extract common words to show the success message
          const candidateInfo = errorMessage.match(
            /resume for (.*) with this phone number (.*) already exists/
          );
          if (candidateInfo && candidateInfo.length > 2) {
            const candidateName = candidateInfo[1];
            const phoneNumber = candidateInfo[2];
            setMessage(
              `Candidate ${candidateName} with phone number ${phoneNumber} already exists. The state will be updated accordingly.`
            );
          } else {
            setMessage(
              "Candidate already exists. The state will be updated accordingly."
            );
          }
          setSeverity("warning"); // Set severity to warning for candidate already exists
        } else {
          setSeverity("error");
          setMessage("Error uploading file. Please try again.");
        }
      } else if (errorMessage1.includes("not in a processable state")) {
        const existingNumber = error.response.data.existing_number;
        setSeverity("error");
        setMessage(
          `Resume with phone number ${existingNumber} exists but is not in a processable state.`
        );
      } else {
        setSeverity("error");
        setMessage("Error uploading file. Please try again.");
      }
    }
  };

  const isResumeSelected = (resume_id) => {
    return selectedResumes.some((resume) => resume.resume_id === resume_id);
  };
  const updateResumeInsightByPhone = async (phoneNumber, updateData) => {
    try {
      const apiUrl = `https://api.jinnhire.in/jinnhire/data/resume-insights/update-by-phone/${phoneNumber}/`;
      const token = localStorage.getItem("token");
      const response = await axios.patch(apiUrl, updateData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(
        "Resume insight updated successfully by phone number:",
        response.data
      );
    } catch (error) {
      console.error("Error updating resume insight by phone number:", error);
    }
  };

  const updateResumeState = async (
    resumeId,
    newState,
    remarks = null,
    validity = null
  ) => {
    const url = `https://api.jinnhire.in/jinnhire/data/resumes/${resumeId}/update-state/`;
    const token = localStorage.getItem("token");
    const bodyData = {
      state: newState,
      remarks: remarks,
      validity: validity,
      sourcing_user_id: parsedUserData.id,
    };

    try {
      const response = await axios.patch(url, bodyData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Resume state updated successfully:", response.data);
      fetchUploadedResumes();
      setIsValidationDone(true);
      setShow(true);
      setMessage("Resume state updated successfully");
      setSeverity("success");
    } catch (error) {
      console.error("Error updating resume state:", error);
      setShow(true);
      setMessage("Error updating resume state");
      setSeverity("error");
    }
  };
  const displayResumesForRequirement = () => {};
  const displayValidatedResumes = () => {};

  const handleValidate = async () => {
    if (selectedResumes.length === 0) {
      setShow(true);
      setMessage("Please select resumes to validate.");
      setSeverity("warning");
      return;
    }

    const selectedResumeIds = selectedResumes.map((resume) =>
      parseInt(resume.split("-")[0])
    );
    setLoading(true);

    const resumeDataArray = selectedResumeIds.map((index) => {
      const resume = uploadedResumes[index];
      return resume;
    });

    const sessionId =
      "session_" +
      new Date().getTime() +
      "_" +
      Math.random().toString(36).substring(2, 15);

    const token = localStorage.getItem("token");
    setLoading(true);
    const jdResponse = await axios.get(
      `https://api.jinnhire.in/jinnhire/data/requirements/${requirement_id}/mandatory-skills/`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    const jdData = jdResponse.data.mandatory_skills;

    for (const resumeData of resumeDataArray) {
      try {
        setLoading(true);
        const resumeId = resumeData.resume_id;
        const resumeLink = resumeData.file_link;

        let resumeText = "";
        let resumeLinkString = "";

        if (typeof resumeLink === "string") {
          resumeLinkString = resumeLink;
        } else if (typeof resumeData === "object" && resumeData.file_link) {
          resumeLinkString = resumeData.file_link;
        } else {
          console.error("Unsupported document format:", resumeLink);
          continue;
        }

        if (resumeLinkString.endsWith(".pdf")) {
          try {
            const pdfResponse = await fetch(resumeLinkString);
            const pdfBlob = await pdfResponse.blob();
            resumeText = await extractTextFromPDF(pdfBlob);
          } catch (error) {
            console.error("Error parsing PDF:", error);
            continue;
          }
        } else if (resumeLinkString.endsWith(".docx")) {
          try {
            const docxResponse = await fetch(resumeLinkString);
            const docxBlob = await docxResponse.blob();
            resumeText = await extractTextFromDOCX(docxBlob);
          } catch (error) {
            console.error("Error parsing DOCX:", error);
            continue;
          }
        } else if (resumeLinkString.endsWith(".doc")) {
          try {
            const docResponse = await fetch(resumeLinkString);
            const docBlob = await docResponse.blob();
            resumeText = await extractTextFromDOC(docBlob);
          } catch (error) {
            console.error("Error parsing DOC:", error);
            continue;
          }
        } else {
          console.error("Unsupported document format:", resumeLinkString);
          continue;
        }

        console.log(resumeText, "HERE resumeText");

        await sendResumeText(sessionId, resumeText, jdData, resumeId);
        fetchUploadedResumes();
      } catch (error) {
        setLoading(false);
        console.error("Error validating resume:", error);
      }
    }
  };

  const extractTextFromPDF = async (pdfBlob) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(pdfBlob);
    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          const pdfData = new Uint8Array(reader.result);
          const pdf = await window.pdfjsLib.getDocument({ data: pdfData })
            .promise;
          let text = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const pageText = await page.getTextContent();
            pageText.items.forEach((item) => {
              text += item.str + " ";
            });
          }
          resolve(text);
        } catch (error) {
          reject("Error extracting text from PDF:", error);
        }
      };
      reader.onerror = reject;
    });
  };

  const extractTextFromDOCX = async (docxBlob) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(docxBlob);
    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          const docxArray = new Uint8Array(reader.result);
          const zip = await JSZip.loadAsync(docxArray);
          const documentFile = zip.files["word/document.xml"];
          if (!documentFile) {
            reject("word/document.xml not found in the ZIP archive.");
          }
          const fileContent = await documentFile.async("string");
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(fileContent, "application/xml");
          const textNodes = xmlDoc.getElementsByTagName("w:t");
          let extractedText = "";
          for (let i = 0; i < textNodes.length; i++) {
            extractedText += textNodes[i].textContent + " ";
          }
          resolve(extractedText.trim());
        } catch (error) {
          reject("Error extracting text from DOCX:", error);
        }
      };
      reader.onerror = reject;
    });
  };

  const extractTextFromDOC = async (docBlob) => {
    const formData = new FormData();
    formData.append("file", docBlob);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://api.jinnhire.in/jinnhire/data/resumes/extract-doc/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
        }
      );
      return response.data.text;
    } catch (error) {
      throw new Error("Error extracting text from DOC:", error);
    }
  };

  const sendResumeText = async (sessionId, resumeText, jdData, resumeId) => {
    setLoading(true);
    const ws = new WebSocket("wss://jinnhire.com/ws/validateresume/");

    ws.onopen = () => {
      console.log("WebSocket connection opened. Sending message...");
      const message = {
        sessionId: sessionId,
        resumeData: resumeText,
        jdData: jdData,
      };
      ws.send(JSON.stringify(message));
    };

    ws.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received data:", data);
        // Handle response data from the server
        if (data.sessionId && data.message) {
          const messageObject = JSON.parse(data.message);
          const message = messageObject.message;
          console.log("Processed message:", message);

          if (message && typeof message === "object") {
            const normalizedMatchType = message.match_type.trim().toLowerCase();
            console.log(
              "Normalized matchType for comparison:",
              normalizedMatchType
            );

            const updateData = {
              explanation: message.explanation,
              recommendation: message.recommendation,
              match_type: message.match_type,
              mandatory_skills: message.mandatory_skills,
            };
            console.log("Update data being sent to the server:", updateData);

            // Assuming these functions are defined and imported
            await updateResumeInsightByPhone(message.phone_number, updateData);
            if (normalizedMatchType === "nomatch") {
              console.log("Message type is NOT Matched. Resume ID:", resumeId);
              await updateResumeState(
                resumeId,
                "validation_failed",
                null,
                false
              );
              setLoading(false);
            } else {
              console.log("Message type is Matched. Resume ID:", resumeId);
              await updateResumeState(
                resumeId,
                "validation_success",
                null,
                true
              );
              setLoading(false);
            }
            // message.resume_id = resume.resume_id;
            // Assuming these functions are defined and imported
            // displayResumesForRequirement(jdId);
            // displayValidatedResumes(message, jdId);
            // fetchUploadedResumes();
          } else {
            console.error("Message is not an object:", message);
          }
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (e) {
        setLoading(false);
        console.error("Error parsing response:", e);
      }
    };

    ws.onerror = (error) => {
      setLoading(false);
      console.log("WebSocket Error:", error);
    };

    ws.onclose = (event) => {
      setLoading(false);
      console.log(
        "WebSocket connection closed. Code:",
        event.code,
        ", Reason:",
        event.reason
      );
    };
  };

  const handleDelete = async (resumeId, phoneNumber) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://api.jinnhire.in/jinnhire/data/resumes/${resumeId}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      // Assuming success handling
      console.log(`Resume deleted successfully.`);

      // Update state or display a success message
      setShow(true);
      setMessage(`Resume deleted successfully.`);
      setSeverity("success");

      // Optionally update your UI or state to reflect the deletion
      fetchUploadedResumes();
    } catch (error) {
      console.error("Error deleting resume", error);

      // Handle error response
      setShow(true);
      setSeverity("error");

      if (error.response && error.response.status === 404) {
        setMessage(`Resume not found.`);
      } else {
        setMessage("Error deleting resume. Please try again.");
      }

      // Optionally update your UI or state to reflect the error
    }
  };

  const handleDeleteUploadFailed = async (id, filename) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://api.jinnhire.in/jinnhire/data/failed-uploads/${id}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      // Update state for success message
      setShow(true);
      setMessage(`Resume ${filename} deleted successfully.`);
      setSeverity("success");

      // Refresh the list of failed uploads
      fetchFailedUploads();
    } catch (error) {
      console.error("Error deleting resume ${filename}", error);

      // Update state for error message
      setShow(true);
      setMessage(`Error deleting resume ${filename}. Please try again.`);
      setSeverity("error");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = uploadedResumes.flatMap((resume, index) =>
        resume.insights.map((_, subIndex) => `${index}-${subIndex}`)
      );
      setSelectedResumes(newSelecteds);
      return;
    }
    setSelectedResumes([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selectedResumes.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedResumes, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedResumes.slice(1));
    } else if (selectedIndex === selectedResumes.length - 1) {
      newSelected = newSelected.concat(selectedResumes.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedResumes.slice(0, selectedIndex),
        selectedResumes.slice(selectedIndex + 1)
      );
    }

    setSelectedResumes(newSelected);
  };

  const isSelected = (name) => selectedResumes.indexOf(name) !== -1;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUpdateString = () => {
    if (searchString === "") {
      setShow(true);
      setMessage(`Search String can't be Empty`);
      setSeverity("warning");
    } else if (searchString === search_string) {
      setShow(true);
      setMessage(
        `Please check the input search string; it is the same as the old one`
      );
      setSeverity("warning");
    } else {
      updateString(requirement_id, searchString, () => {
        setShow(true);
        setMessage(`Search string updated to: ${searchString}`);
        setSeverity("success");
      });
    }
  };

  const updateString = async (requirementId, searchString, callback) => {
    const token = localStorage.getItem("token");
    const buttonElement = document.querySelector(
      `button[data-requirement-id="${requirementId}"]`
    );

    try {
      const response = await axios.patch(
        `https://api.jinnhire.in/jinnhire/data/requirements/${requirementId}/update-fields/`,
        { search_string: searchString },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Update successful, server responded with:", response.data);
        if (buttonElement) buttonElement.style.backgroundColor = "green";
        saveUpdatedRequirementId(requirementId);
        callback();
        displayRequirementDetails(requirementId);
      }
    } catch (error) {
      console.error("Failed to update search string:", error);
      alert("Failed to update the search string.");
      if (buttonElement) buttonElement.style.backgroundColor = "red";
    }
  };

  const saveUpdatedRequirementId = (requirementId) => {
    let updatedRequirements =
      JSON.parse(localStorage.getItem("updatedRequirements")) || [];
    if (!updatedRequirements.includes(requirementId)) {
      updatedRequirements.push(requirementId);
      localStorage.setItem(
        "updatedRequirements",
        JSON.stringify(updatedRequirements)
      );
    }
  };

  const displayRequirementDetails = async (requirementId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `https://api.jinnhire.in/jinnhire/data/requirements/${requirementId}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const searchStringInput = document.getElementById("searchStringInput");
      searchStringInput.placeholder =
        response.data.search_string || "No search string set";
    } catch (error) {
      console.error("Failed to fetch requirement details:", error);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(searchString).then(() => {
      // alert("Search string copied to clipboard");
      setShow(true);
      setMessage("Search string copied to clipboard");
      setSeverity("success");
    });
  };

  const handleUpdateInfo = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `https://api.jinnhire.in/jinnhire/data/requirements/${requirement_id}/update-fields/`,
        info,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log("Info updated:", response.data);
      // alert("Information updated successfully!");
      setShow(true);
      setMessage("Information updated successfully!");
      setSeverity("success");
    } catch (error) {
      console.error("Error updating info:", error);
      // alert("Error updating information. Please try again.");
      setShow(true);
      setMessage("Error updating information. Please try again.");
      setSeverity("error");
    } finally {
      setLoading(false);
    }
  };

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleJdDialogOpen = () => {
    fetchJD();
    setJdDialogOpen(true);
  };

  const handleJdDialogClose = () => {
    setJdDialogOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <TopBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container>
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
          <BreadCrumb />
          <Typography variant="h4" gutterBottom>
            File Management
          </Typography>
          <Grid container spacing={3} alignItems="flex-start">
            {(role === "recruiter_sourcing" || role === "lead_sourcing") && (
              <Grid item xs={12} md={12}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Search String
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <TextField
                      id="searchStringInput"
                      name="searchString"
                      variant="outlined"
                      placeholder="Stored search string..."
                      fullWidth
                      size="small"
                      value={searchString}
                      onChange={(e) => setSearchString(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      color="secondary"
                      size="medium"
                      sx={{ backgroundColor: "#2792b0" }}
                      onClick={handleCopyText}
                    >
                      <CopyAll />
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ ml: 2, backgroundColor: "rgb(37 86 145)" }}
                      onClick={handleUpdateString}
                      className="button"
                    >
                      Update String
                    </Button>
                  </Box>
                </Card>
              </Grid>
            )}

            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6">Job Description</Typography>
                  <Button
                    variant="contained"
                    onClick={handleJdDialogOpen}
                    sx={{ backgroundColor: "rgb(31 91 139)" }}
                  >
                    <RemoveRedEye />
                    View JD
                  </Button>
                </Box>
                <Box mt={2}>
                  <Grid container spacing={2}>
                    {role === "admin" || role === "account_manager" ? (
                      <>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Requirement ID"
                            value={info.requirement_id}
                            variant="outlined"
                            fullWidth
                            size="small"
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            name="requirement_type"
                            label="Requirement Type"
                            value={info.requirement_type}
                            onChange={handleInfoChange}
                            variant="outlined"
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            name="requirement_source"
                            label="Requirement Source"
                            value={info.requirement_source}
                            onChange={handleInfoChange}
                            variant="outlined"
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            name="job_role"
                            label="Job Role"
                            value={info.job_role}
                            onChange={handleInfoChange}
                            variant="outlined"
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            name="summary"
                            label="Summary"
                            value={info.summary}
                            onChange={handleInfoChange}
                            variant="outlined"
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            name="experience"
                            label="Experience"
                            value={info.experience}
                            onChange={handleInfoChange}
                            variant="outlined"
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            name="location"
                            label="Location"
                            value={info.location}
                            onChange={handleInfoChange}
                            variant="outlined"
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            name="description"
                            label="Description"
                            value={info.description}
                            onChange={handleInfoChange}
                            variant="outlined"
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            name="country_of_job"
                            label="Country of Job"
                            value={info.country_of_job}
                            onChange={handleInfoChange}
                            variant="outlined"
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            name="notice_period"
                            label="Notice Period"
                            value={info.notice_period}
                            onChange={handleInfoChange}
                            variant="outlined"
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Date Time Posted"
                            value={info.date_time_posted}
                            variant="outlined"
                            fullWidth
                            size="small"
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            name="requirement_priority"
                            label="Requirement Priority"
                            value={info.requirement_priority}
                            onChange={handleInfoChange}
                            variant="outlined"
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Customer Name"
                            value={info.customer_name}
                            variant="outlined"
                            fullWidth
                            size="small"
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            name="mandatory_skills"
                            label="Mandatory Skills"
                            value={info.mandatory_skills}
                            onChange={handleInfoChange}
                            variant="outlined"
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            name="current_candidate_location"
                            label="Current Candidate Location"
                            value={info.current_candidate_location}
                            onChange={handleInfoChange}
                            variant="outlined"
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            name="joining_requirements"
                            label="Joining Requirements"
                            value={info.joining_requirements}
                            onChange={handleInfoChange}
                            variant="outlined"
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            name="salary_offered_by_customer"
                            label="Salary Offered by Customer"
                            value={info.salary_offered_by_customer}
                            onChange={handleInfoChange}
                            variant="outlined"
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            name="shift_requirements"
                            label="Shift Requirements"
                            value={info.shift_requirements}
                            onChange={handleInfoChange}
                            variant="outlined"
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            name="gender_requirement"
                            label="Gender Requirement"
                            value={info.gender_requirement}
                            onChange={handleInfoChange}
                            variant="outlined"
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            name="num_resumes_required"
                            label="Number of Resumes Required"
                            value={info.num_resumes_required}
                            onChange={handleInfoChange}
                            variant="outlined"
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            name="num_resumes_submitted"
                            label="Number of Resumes Submitted"
                            value={resumes?.length}
                            onChange={handleInfoChange}
                            variant="outlined"
                            fullWidth
                            size="small"
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            name="bounty"
                            label="Bounty"
                            value={info.bounty}
                            onChange={handleInfoChange}
                            variant="outlined"
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            name="stars"
                            label="Stars"
                            value={info.stars}
                            onChange={handleInfoChange}
                            variant="outlined"
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            name="remarks_for_sourcing"
                            label="Remarks for Sourcing"
                            multiline
                            rows={4}
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={info.remarks_for_sourcing}
                            onChange={handleInfoChange}
                          />
                        </Grid>
                        {/* Remarks for Processing */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            name="remarks_for_processing"
                            label="Remarks for Processing"
                            multiline
                            rows={4}
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={info.remarks_for_processing}
                            onChange={handleInfoChange}
                          />
                        </Grid>
                      </>
                    ) : (
                      <>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            name="requirementId"
                            label="Requirement Id"
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={info.requirement_id}
                            onChange={handleInfoChange}
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            name="experience"
                            label="Experience"
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={info.experience}
                            onChange={handleInfoChange}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            name="notice_period"
                            label="Notice Period"
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={info.notice_period}
                            onChange={handleInfoChange}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            name="current_candidate_location"
                            label="Current Candidate Location"
                            value={info.current_candidate_location}
                            onChange={handleInfoChange}
                            variant="outlined"
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        {(role === "recruiter_sourcing" ||
                          role === "lead_sourcing" ||
                          role === "recruiter_processing" ||
                          role === "lead_processing"||
                          role === "manager") && (
                          <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              name="salary_offered_by_customer"
                              label="Salary Offered by Customer"
                              value={info.salary_offered_by_customer}
                              onChange={handleInfoChange}
                              variant="outlined"
                              fullWidth
                              size="small"
                              disabled
                            />
                          </Grid>
                        )}
                        {(role === "recruiter_sourcing" ||
                          role === "lead_sourcing") && (
                          <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              name="remarks_for_sourcing"
                              label="Remarks for Sourcing"
                              multiline
                              rows={4}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={info.remarks_for_sourcing}
                              onChange={handleInfoChange}
                              disabled
                            />
                          </Grid>
                        )}
                        {/* Remarks for Processing */}
                        {(role === "recruiter_processing" ||
                          role === "lead_processing") && (
                          <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              name="remarks_for_processing"
                              label="Remarks for Processing"
                              multiline
                              rows={4}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={info.remarks_for_processing}
                              onChange={handleInfoChange}
                              disabled
                            />
                          </Grid>
                        )}
                      </>
                    )}
                  </Grid>
                </Box>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    variant="contained"
                    onClick={handleUpdateInfo}
                    sx={{ backgroundColor: "rgb(31 91 139)" }}
                  >
                    Update
                  </Button>
                </Box>
              </Card>
            </Grid>
            {(role === "recruiter_sourcing" || role === "lead_sourcing") && (
              <>
                <Grid item xs={12}>
                  <Card sx={{ p: 3 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Typography variant="h6">
                        Parsing Failed Resumes
                      </Typography>
                      <Box></Box>
                      <Button
                        onClick={handleOpenModal}
                        variant="contained"
                        sx={{ backgroundColor: "rgb(31 91 139)" }}
                      >
                        <Upload />
                        Upload Resume
                      </Button>
                      <UploadModal
                        open={modalOpen}
                        onClose={handleCloseModal}
                        onUpload={handleUpload}
                      />
                    </Box>
                    {/* CODE FOR VALIDATE BUTTON */}
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <TableContainer>
                        {/* <Typography variant="h5">
                          Parsing Failed Resumes
                        </Typography> */}
                        <Table>
                          <TableHead>
                            <TableRow sx={{ color: "#fff" }}>
                              <TableCell padding="checkbox">
                                <Checkbox
                                  indeterminate={
                                    selectedResumes.length > 0 &&
                                    selectedResumes.length <
                                      uploadedResumes.length
                                  }
                                  checked={
                                    uploadedResumes.length > 0 &&
                                    selectedResumes.length ===
                                      uploadedResumes.length
                                  }
                                  onChange={handleSelectAllClick}
                                />
                              </TableCell>
                              <TableCell>Requirement Id</TableCell>
                              <TableCell>Phone No</TableCell>
                              <TableCell>View</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Delete</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {uploadedResumes.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={8} align="center">
                                  <Typography variant="body1" gutterBottom>
                                    No data available
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ) : (
                              uploadedResumes
                                .slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage
                                )
                                .map((resume, index) => {
                                  const isItemSelected = isSelected(`${index}`);
                                  return (
                                    <TableRow
                                      key={`${index}`}
                                      hover
                                      onClick={(event) =>
                                        handleClick(event, `${index}`)
                                      }
                                      role="checkbox"
                                      aria-checked={isItemSelected}
                                    >
                                      <TableCell padding="checkbox">
                                        <Checkbox checked={isItemSelected} />
                                      </TableCell>
                                      <TableCell>
                                        {resume.requirement_id}
                                      </TableCell>
                                      <TableCell>
                                        {resume.phone_number}
                                      </TableCell>
                                      <TableCell>
                                        <Tooltip title="View Resume">
                                          <IconButton
                                            color="info"
                                            href={resume.file_link}
                                          >
                                            <Visibility />
                                          </IconButton>
                                        </Tooltip>
                                      </TableCell>
                                      {resume.state === "parse_failed" ? (
                                        <TableCell>
                                          <Chip
                                            label="Parsing Failed"
                                            color="warning"
                                          />
                                        </TableCell>
                                      ) : (
                                        <TableCell>
                                          <Chip label="Failed" />
                                        </TableCell>
                                      )}
                                      <TableCell>
                                        <Tooltip title="Delete Resume">
                                          <IconButton
                                            color="error"
                                            onClick={() =>
                                              handleDelete(resume.resume_id)
                                            }
                                          >
                                            <Delete />
                                          </IconButton>
                                        </Tooltip>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={uploadedResumes.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card sx={{ p: 3 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Typography variant="h6">
                        Upload Failed Resumes
                      </Typography>
                      <Box></Box>
                    </Box>
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ color: "#fff" }}>
                              <TableCell>Requirement ID</TableCell>
                              <TableCell>File Name</TableCell>
                              <TableCell>Date</TableCell>
                              <TableCell>Error Message</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Delete</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {failedUploads.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={8} align="center">
                                  <Typography variant="body1" gutterBottom>
                                    No data available
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ) : (
                              failedUploads
                                .slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage
                                )
                                .map((upload, index) => {
                                  // Extract the relevant part of the error message
                                  const errorMessageMatch =
                                    upload.error_message.match(
                                      /UPLOAD error: (.*?) by/
                                    );
                                  const errorMessage = errorMessageMatch
                                    ? errorMessageMatch[1]
                                    : upload.error_message;

                                  const formattedDate = new Date(
                                    upload.date_of_posting
                                  ).toLocaleString();
                                  return (
                                    <TableRow key={upload.id}>
                                      <TableCell>
                                        {upload.requirement_name}
                                      </TableCell>
                                      <TableCell>
                                        {upload.resume_filename}
                                      </TableCell>
                                      <TableCell>{formattedDate}</TableCell>
                                      <TableCell>{errorMessage}</TableCell>
                                      <TableCell>
                                        <Chip
                                          label="Upload Failed"
                                          color="warning"
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Tooltip title="Delete Failed Upload">
                                          <IconButton
                                            color="error"
                                            onClick={() =>
                                              handleDeleteUploadFailed(
                                                upload.id,
                                                upload.resume_filename
                                              )
                                            }
                                          >
                                            <Delete />
                                          </IconButton>
                                        </Tooltip>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={failedUploads.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                    {/* <Box display="flex" justifyContent="flex-end" mt={2}>
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: "rgb(31 91 139)" }}
                        disabled={loading}
                        onClick={handleValidate}
                      >
                        {loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          "Validate"
                        )}
                      </Button>
                    </Box> */}
                  </Card>
                </Grid>
                <ResumeManagement isValidationDone={isValidationDone} />
              </>
            )}
          </Grid>
        </Container>
      </Box>
      <Dialog open={jdDialogOpen} scroll="paper" maxWidth="md" fullWidth>
        <DialogTitle>Job Description</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ whiteSpace: "pre-wrap" }}>
            <Typography variant="body1" gutterBottom>
              {jdText}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleJdDialogClose}
            color="error"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
