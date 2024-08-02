import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Avatar,
  Tooltip,
  Modal,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
  Skeleton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { grey } from "@mui/material/colors";
import DownloadIcon from "@mui/icons-material/GetApp";
import ApproveIcon from "@mui/icons-material/Check";
import RejectIcon from "@mui/icons-material/Close";

const checkboxStyles = {
  positive: { color: "green" },
  negative: { color: "red" },
};

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

const MyResumes = ({ userID }) => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [show, setShow] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [modalContent, setModalContent] = useState([]);
  const [loading, setLoading] = useState(true);

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
      text: "Candidate is not suitable/ irrelevant",
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

  const handleCheckboxChange = (text, checked) => {
    setSelectedOptions((prev) =>
      checked ? [...prev, text] : prev.filter((option) => option !== text)
    );
  };

  const handleOpenModal = (isSuitable, profile) => {
    setModalContent(isSuitable ? suitableOptions : notSuitableOptions);
    setSelectedProfile(profile);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOptions([]);
    setSelectedOptions([]); // Clear selected reasons on modal close
  };

  const handleSubmit = async () => {
    console.log(selectedProfile, "PP");
    if (!selectedProfile || !selectedOptions.length) return;

    try {
      const token = localStorage.getItem("token");
      const state = selectedOptions.some((option) =>
        suitableOptions.some((suitableOption) => suitableOption.text === option)
      )
        ? "processed"
        : "processing_failed";
      const remarks = selectedOptions.join(", ");

      const resumeResponse = await axios.get(
        `https://api.jinnhire.in/jinnhire/data/resume-insights/get-resume-by-phone/`,
        {
          params: { phone_number: selectedProfile.phone_number },
          headers: { Authorization: `Token ${token}` },
        }
      );

      const resumeData = resumeResponse.data;

      await axios.patch(
        `https://api.jinnhire.in/jinnhire/data/resumes/${resumeData.resume_id}/update-state/`,
        { state, remarks, validity: null, processing_user_id: userID },
        { headers: { Authorization: `Token ${token}` } }
      );

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

      await axios.put(
        `https://api.jinnhire.in/jinnhire/data/candidate-state-machines/${selectedProfile.candidate_phone_number}/`,
        { candidate_processing_state: state },
        { headers: { Authorization: `Token ${token}` } }
      );

      setShow(true);
      setSeverity("success");
      setMessage("Successfully updated candidate state.");
      setSelectedProfile(null);
      fetchData(); // Refresh profiles after submission
    } catch (error) {
      console.error("Error submitting", error);
      setShow(true);
      setSeverity("error");
      setMessage(
        error.response?.data?.message || "Failed to update candidate state."
      );
    }
    handleCloseModal();
    fetchData(); // Refresh profiles after submission
  };

  useEffect(() => {
    fetchData();
  }, [userID]);
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://api.jinnhire.in/jinnhire/data/skip_comments/by_user/",
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          params: { user_id: userID },
        }
      );

      const resumes = {};
      const now = new Date();
      const todayEnd = new Date(now.setHours(23, 59, 59, 999));
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);

      response.data.forEach((item) => {
        const commentDate = new Date(item.comment.created_at);
        if (commentDate >= sevenDaysAgo && commentDate <= todayEnd) {
          if (resumes[item.resume.resume_id]) {
            resumes[item.resume.resume_id].comments.push(item.comment);
          } else {
            resumes[item.resume.resume_id] = {
              ...item.resume,
              comments: [item.comment],
            };
          }
        }
      });
      // Filter out items with state "communication_failed" or requirement_id null
      const filteredResumes = Object.values(resumes).filter(
        (resume) =>
          resume.state === "communication_failed" && resume.requirement_id !== null
      );

      // Sort comments with latest first
      filteredResumes.forEach((resume) => {
        resume.comments.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      });

      setData(filteredResumes);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const formatRecruiterName = (email) => {
    if (!email) return "Unknown Recruiter";
    const name = email.split("@")[0];
    return name.replace(".", " ");
  };

  const handleDownload = (file_link) => {
    window.open(file_link, "_blank");
  };

  return (
    <Box sx={{ padding: 2 }}>
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
      {loading ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[...Array(3)].map((_, index) => (
            <Card
              key={index}
              sx={{ marginBottom: 2, borderRadius: 1, boxShadow: 1 }}
            >
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Skeleton
                      variant="text"
                      width="60%"
                      height={30}
                      sx={{ marginBottom: 1 }}
                    />
                    <Skeleton
                      variant="text"
                      width="80%"
                      height={20}
                      sx={{ marginBottom: 1 }}
                    />
                    <Skeleton
                      variant="text"
                      width="70%"
                      height={20}
                      sx={{ marginBottom: 1 }}
                    />
                    <Skeleton variant="text" width="50%" height={20} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={100}
                      sx={{ borderRadius: 1 }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : data.length === 0 ? (
        <Card sx={{ margin: "auto", padding: 2, textAlign: "center" }}>
          <CardContent>
            <Typography variant="h4">No Data Available</Typography>
          </CardContent>
        </Card>
      ) : (
        data.map((resume, index) => (
          <Card
            key={index}
            sx={{
              marginBottom: 2,
              backgroundColor: grey[100],
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" color="primary">
                    Candidate: {resume.insights[0].first_name}{" "}
                    {resume.insights[0].last_name}
                  </Typography>
                  <Typography variant="body2">
                    Phone: {resume.phone_number}
                  </Typography>
                  <Typography variant="body2">
                    Requirement ID: {resume.requirement_id}
                  </Typography>
                  <Typography variant="body2">
                    Location: {resume.insights[0].current_location}
                  </Typography>
                  <Typography variant="body2">
                    Remarks: {resume.remarks || "N/A"}
                  </Typography>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="body2">Mandatory Skills</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Table size="small">
                        <TableBody>
                          {Object.entries(
                            resume.insights[0].mandatory_skills
                          ).map(([skill, value], idx) => (
                            <TableRow key={idx}>
                              <TableCell>{skill}</TableCell>
                              <TableCell>{value}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">Comments:</Typography>
                  <Box
                    sx={{
                      maxHeight: 100,
                      overflowY: "auto",
                      backgroundColor: grey[100],
                      borderRadius: 1,
                      padding: 1,
                      boxShadow: 0,
                    }}
                  >
                    {resume.comments.map((comment, idx) => (
                      <Box
                        key={idx}
                        display="flex"
                        alignItems="flex-start"
                        mb={1}
                        p={1}
                        borderRadius="12px"
                        border={1}
                        borderColor="divider"
                        sx={{ backgroundColor: grey[50] }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "#3a6db7",
                            mr: 1,
                            width: 30,
                            height: 30,
                          }}
                        >
                          {formatRecruiterName(comment.recruiter_name)
                            .charAt(0)
                            .toUpperCase()}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            mb={0.5}
                          >
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: "medium" }}
                            >
                              {formatRecruiterName(comment.recruiter_name)}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {formatDateTime(comment.created_at)}
                            </Typography>
                          </Box>
                          <Typography variant="caption">
                            {comment.comment || "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ marginTop: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      color="success"
                      startIcon={<ApproveIcon />}
                      sx={{ mx: 0.5 }}
                      onClick={() => handleOpenModal(true, resume)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                      startIcon={<RejectIcon />}
                      sx={{ mx: 0.5 }}
                      onClick={() => handleOpenModal(false, resume)}
                    >
                      Reject
                    </Button>
                    <Tooltip title="Download Resume">
                      <IconButton
                        color="primary"
                        onClick={() => handleDownload(resume.file_link)}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))
      )}

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
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={handleCloseModal}
              variant="contained"
              color="error"
              sx={{ mt: 3, marginRight: 1 }}
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
    </Box>
  );
};

export default MyResumes;
