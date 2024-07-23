import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Card,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  Box,
  Button,
  TablePagination,
  Snackbar,
  Alert,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useLocation } from "react-router-dom";

const ResumeManagement = ({ isValidationDone }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedResumes, setSelectedResumes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const location = useLocation();
  const { requirement_id } = location.state || {};
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // if (isValidationDone) {
      fetchResumes();
    // }
  }, [isValidationDone]);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://api.jinnhire.in/jinnhire/data/requirements/${requirement_id}/resumes`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setResumes(response.data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.detail ||
          "An error occurred while fetching resumes."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAllClick = (resumes, event) => {
    if (event.target.checked) {
      const newSelecteds = resumes.flatMap((resume) =>
        resume.insights.map((detail) => detail.resume_id)
      );
      setSelectedResumes(newSelecteds);
      return;
    }
    setSelectedResumes([]);
  };

  const handleClick = (event, resume_id) => {
    const selectedIndex = selectedResumes.indexOf(resume_id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedResumes, resume_id);
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

  const isSelected = (resume_id) => selectedResumes.indexOf(resume_id) !== -1;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const generateRandomString = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const indianizePhoneNumber = (phoneNumber) => {
    let digits = phoneNumber.replace(/\D/g, "");

    if (digits.length === 12 && digits.startsWith("91")) {
      return `+${digits}`;
    } else if (digits.length === 10) {
      return `+91${digits}`;
    } else {
      console.error("The phone number is not valid:", phoneNumber);
      return null;
    }
  };

  // const showAlertWithSkills = () => {
  //   let skillsString = globalSkills.join(", ");
  //   return skillsString;
  // };

  const createMessage = async (resume, jdId, resumeId) => {
    const token = localStorage.getItem("token");

    try {
      const requirementUrl = `https://api.jinnhire.in/jinnhire/data/requirements/${jdId}/`;
      const requirementData = await axios.get(requirementUrl, {
        headers: { Authorization: `Token ${token} `},
      });
      const customerId = requirementData.data.customer;

      const customerUrl = `https://api.jinnhire.in/jinnhire/data/customer_excels/customer-data/?customer_id=${customerId}`;
      const customerData = await axios.get(customerUrl, {
        headers: { Authorization: `Token ${token} `},
      });

      const tenantId = customerData.data.customer.tenant_id;

      const tenantUrl = `https://api.jinnhire.in/jinnhire/data/tenants/get-tenant/?tenant_id=${tenantId}`;
      const tenantData = await axios.get(tenantUrl, {
        headers: { Authorization: `Token ${token} `},
      });
      const recruiterName = localStorage.getItem("username");

      const data = {
        sessionId: generateRandomString(20),
        request_type: "INITIATE",
        contact_number: indianizePhoneNumber(resume.phone_number),
        recruiter_name: recruiterName.split("@")[0].split(".")[0],
        candidate_fname: resume.insights[0].first_name,
        candidate_lname: resume.insights[0].last_name,
        cust_id: customerId,
        skills: requirementData.data.mandatory_skills,
        JD_id: jdId,
        from_number: "+917337351442",
        domain: customerData.data.customer.industry,
        division: customerData?.data?.customer_excel_data[0].division,
        customer: customerData.data.customer.name,
        requirement_type: requirementData.data.requirement_type,
        job_role: requirementData.data.job_role,
        target_audience:
          customerData.data.customer_excel_data[0].target_audience,
        resume_source: "NAUKRI.COM",
        company_name: tenantData.data.name,
        conversation_type: "sourcing",
      };

      await sendCommunication(data, resumeId);
    } catch (error) {
      setShow(true);
      setSeverity("error");
      setMessage("Error creating message. Please try again.");
      console.error("Error creating message:", error);
      throw error;
    }
  };

  const sendCommunication = (data, resumeId) =>
    new Promise((resolve, reject) => {
      setLoading(true);

      const websocket = new WebSocket(
        "wss://whatsapp.jinnhire.in/ws/initaitewhatsapp/"
      );

      websocket.onopen = () => {
        console.log("WebSocket connection opened. Sending message...");
        websocket.send(JSON.stringify(data));
      };

      websocket.onmessage = async (event) => {
        try {
          let data = JSON.parse(event.data);
          console.log("Response received:", data);

          if (typeof data === "string") {
            // Data might be double-stringified; parse it again
            data = JSON.parse(data);
          }

          if (data.message) {
            const sessionId = data.sessionId;
            console.log("The session id is:", sessionId);

            await updateResumeState(resumeId, "communication_failed", null);
            console.log(
              "Updated resume state to communication success for resume ID:",
              resumeId
            );
            setShow(true);
            setMessage("Communication Success for Resume");
            setSeverity("success");
            resolve();
          } else {
            console.error("Message Not Found", data.message);
            reject(new Error("Message Not Found"));
          }
        } catch (e) {
          console.error("Error parsing response:", e);
          reject(e);
        } finally {
          setLoading(false);
        }
      };

      websocket.onerror = (error) => {
        console.log("WebSocket Error:", error);
        setLoading(false);
        setShow(true);
        setMessage("WebSocket error. Please try again.");
        setSeverity("error");
        reject(error);
      };

      websocket.onclose = (event) => {
        console.log("WebSocket connection closed.", event);
        setLoading(false);
        setShow(true);
        setMessage("WebSocket connection closed.");
        setSeverity("warning");
        reject(new Error("WebSocket connection closed"));
      };
    });

  const handleCommunicate = async (type) => {
    if (selectedResumes.length === 0) {
      setShow(true);
      setMessage("Please select resumes to Communicate.");
      setSeverity("warning");
      return;
    }

    const resumeDataArray = selectedResumes.map((resumeId) => {
      const resume = resumes.find((resume) => resume.resume_id === resumeId);
      return { ...resume };
    });

    setProcessing(true);
    for (let i = 0; i < resumeDataArray.length; i++) {
      const resumeId = resumeDataArray[i].resume_id;
      try {
        await createMessage(resumeDataArray[i], requirement_id, resumeId);
      } catch (error) {
        console.error("Error processing resume:", resumeId, error);
      }
    }
    setProcessing(false);
    setShow(true);
    setMessage(`Communication ${type} request initiated.`);
    setSeverity("success");
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
    };

    try {
      const response = await axios.patch(url, bodyData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Resume state updated successfully:", response.data);
      setLoading(false);
      fetchResumes();
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

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShow(false);
  };

  const renderTableRows = (data) =>
    data
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((resume, index) =>
        resume.insights.map((detail, subIndex) => {
          const isItemSelected = isSelected(resume.resume_id);
          return (
            <TableRow
              key={index}
              hover
              onClick={(event) => handleClick(event, resume.resume_id)}
              role="checkbox"
              aria-checked={isItemSelected}
              selected={isItemSelected}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isItemSelected}
                  className="resume-checkbox"
                  value={detail.first_name}
                  data-last-name={detail.last_name}
                  data-resume-id={detail.resume_id}
                />
              </TableCell>
              <TableCell className="candidate-name">{`${
                detail.first_name
              }${" "}${detail.last_name}`}</TableCell>
              <TableCell>{detail.phone_number}</TableCell>
              <TableCell>{detail.email_id}</TableCell>
              <TableCell>{detail.current_location}</TableCell>
              <TableCell sx={{ maxWidth: 200, padding: 1 }}>
                <Typography variant="body2">{detail.explanation}</Typography>
              </TableCell>
              <TableCell sx={{ maxWidth: 200, padding: 1 }}>
                <Typography variant="body2">{detail.recommendation}</Typography>
              </TableCell>
              <TableCell>
                {detail.mandatory_skills && (
                  <Accordion sx={{ boxShadow: "none", margin: 0 }}>
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      sx={{
                        minHeight: "auto",
                        "& .MuiAccordionSummary-content": { margin: 0 },
                      }}
                    >
                      <Typography variant="body2"> View Skills</Typography>
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
                          {Object.entries(detail.mandatory_skills).map(
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
            </TableRow>
          );
        })
      );

  const unmatchedResumes = resumes.filter(
    (resume) => resume.state === "validation_failed"
  );

  const matchedResumes = resumes.filter(
    (resume) => resume.state === "validation_success"
  );

  return (
    <Grid item xs={12} mt={2}>
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
      <Typography variant="h4" gutterBottom>
        Resume Management
      </Typography>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Unmatched Resumes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Card sx={{ p: 3 }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={
                            selectedResumes.length > 0 &&
                            selectedResumes.length < unmatchedResumes.length
                          }
                          checked={
                            unmatchedResumes.length > 0 &&
                            selectedResumes.length === unmatchedResumes.length
                          }
                          onChange={(event) =>
                            handleSelectAllClick(unmatchedResumes, event)
                          }
                        />
                      </TableCell>
                      <TableCell>Candidate Name</TableCell>
                      <TableCell>Phone Number</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell sx={{ paddingRight: 8 }}>
                        Explanation
                      </TableCell>
                      <TableCell sx={{ paddingRight: 8 }}>
                        Recommendation
                      </TableCell>
                      <TableCell>Mandatory Skills</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ padding: "2px" }}>
                    {unmatchedResumes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          No data available
                        </TableCell>
                      </TableRow>
                    ) : (
                      renderTableRows(unmatchedResumes)
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={unmatchedResumes.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "rgb(31 91 139)" }}
              disabled={loading || processing}
              onClick={() => handleCommunicate("unmatched")}
            >
              {loading || processing ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Communicate"
              )}
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Matched Resumes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Card sx={{ p: 3 }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={
                            selectedResumes.length > 0 &&
                            selectedResumes.length < matchedResumes.length
                          }
                          checked={
                            matchedResumes.length > 0 &&
                            selectedResumes.length === matchedResumes.length
                          }
                          onChange={(event) =>
                            handleSelectAllClick(matchedResumes, event)
                          }
                        />
                      </TableCell>
                      <TableCell>Candidate Name</TableCell>
                      <TableCell>Phone Number</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell sx={{ paddingRight: 8 }}>
                        Explanation
                      </TableCell>
                      <TableCell sx={{ paddingRight: 8 }}>
                        Recommendation
                      </TableCell>
                      <TableCell>Mandatory Skills</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {matchedResumes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          No data available
                        </TableCell>
                      </TableRow>
                    ) : (
                      renderTableRows(matchedResumes)
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={matchedResumes.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "rgb(31 91 139)" }}
              onClick={() => handleCommunicate("matched")}
              disabled={loading || processing}
            >
              {loading || processing ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Communicate"
              )}
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

export default ResumeManagement;