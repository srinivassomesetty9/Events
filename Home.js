import React, { useState, useEffect } from "react";
import {
  Alert,
  Container,
  Card,
  CardContent,
  Typography,
  Tab,
  Tabs,
  Box,
  Grid,
  Button,
  Toolbar,
  Skeleton,
  Chip,
  Rating,
  Pagination,
  Switch,
  Divider,
  Paper,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TablePagination,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import { Refresh, Search, ViewList, ViewModule } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import TopBar from "./TopBar";
import BreadCrumb from "./BreadCrumb";
import Process from "./Process";
import Reports from "./Reports";

const opt_in_url_template = `https://api.jinnhire.in/jinnhire/data/requirements/{{requirement_id}}/opt/`;
const opt_out_url_template = `https://api.jinnhire.in/jinnhire/data/requirements/{{requirement_id}}/opt-out/`;

function Home() {
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [requirements, setRequirements] = useState([]);
  const [optInCounts, setOptInCounts] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [queryTime, setQueryTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [listPage, setListPage] = useState(0);
  const [viewMode, setViewMode] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 6;
  const navigate = useNavigate();
  const [loginRole, setLoginRole] = useState("");
  const [userId, setUserId] = useState(null);
  const [globalSurplusCount, setGlobalSurplusCount] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setLoginRole(parsedUserData.role);
      setUserId(parsedUserData.id);
      setQueryTime(Date.now());
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchRequirements();
    }
  }, [queryTime, userId]);

  useEffect(() => {
    fetchGlobalSettings();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setQueryTime(Date.now());
    }, 60000); // Fetch data every minute

    return () => clearInterval(interval);
  }, []);

  const fetchGlobalSettings = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "https://api.jinnhire.in/jinnhire/data/global-settings/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setGlobalSurplusCount(response.data.global_surplus_count_of_resumes);
    } catch (error) {
      console.error("Error fetching global settings:", error);
      setErrorMessage("Error fetching global settings");
    }
  };

  const fetchRequirements = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://api.jinnhire.in/jinnhire/data/requirements/?t=${queryTime}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const requirementsData = response.data;

      const requirementsWithActiveState = requirementsData.map(
        (requirement) => {
          const isActive = requirement.users_opted.includes(userId);
          return { ...requirement, active: isActive };
        }
      );

      setRequirements(requirementsWithActiveState);

      const optInCountsData = {};
      await Promise.all(
        requirementsData.map(async (requirement) => {
          const count = requirement.users_opted.length;
          optInCountsData[requirement.requirement_id] = count;
        })
      );
      setOptInCounts(optInCountsData);
      setLoading(false); 
    } catch (error) {
      setErrorMessage(
        error.response?.data?.detail ||
          "An error occurred while fetching requirements."
      );
      setLoading(false);
    }
  };

  const optInRequirement = async (requirement_id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        opt_in_url_template.replace("{{requirement_id}}", requirement_id),
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Opt-In Error:", error);
    }
  };

  const optOutRequirement = async (requirement_id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        opt_out_url_template.replace("{{requirement_id}}", requirement_id),
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Opt-Out Error:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleUpdate = () => {
    setQueryTime(Date.now());
  };

  const handleCardClick = (requirement) => {
    const {
      requirement_id,
      requirement_type,
      requirement_source,
      job_role,
      summary,
      experience,
      location,
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
    } = requirement;
    navigate(`/files`, {
      state: {
        requirement_id,
        requirement_type,
        requirement_source,
        job_role,
        summary,
        experience,
        location,
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
      },
    });
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleToggle = async (requirement, event) => {
    const isOptIn = event.target.checked;
    const token = localStorage.getItem("token");

    try {
      if (isOptIn) {
        await axios.post(
          opt_in_url_template.replace(
            "{{requirement_id}}",
            requirement.requirement_id
          ),
          {},
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setOptInCounts((prevCounts) => ({
          ...prevCounts,
          [requirement.requirement_id]:
            (prevCounts[requirement.requirement_id] || 0) + 1,
        }));
      } else {
        await axios.post(
          opt_out_url_template.replace(
            "{{requirement_id}}",
            requirement.requirement_id
          ),
          {},
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setOptInCounts((prevCounts) => ({
          ...prevCounts,
          [requirement.requirement_id]:
            (prevCounts[requirement.requirement_id] || 0) - 1,
        }));
      }

      setRequirements((prevRequirements) =>
        prevRequirements.map((req) =>
          req.requirement_id === requirement.requirement_id
            ? { ...req, active: isOptIn }
            : req
        )
      );
      setShow(true);
      setSeverity("success");
      setMessage(`${isOptIn ? "Opted-IN" : "Opted-Out"}  successfully!`);
    } catch (error) {
      console.error("Opt-In/Opt-Out Error:", error);
      setShow(true);
      setSeverity("error");
      setMessage(
        error.response?.data?.message ||
          `Error ${isOptIn ? "Opt-IN" : "Opt-Out"}. Please try again.`
      );
    }
  };

  const isRequirementDeactivated = (requirement) => {
    return (
      requirement.resumes.filter(
        (resume) => resume.resume_processed_by
      ).length >
      requirement.num_resumes_required + globalSurplusCount
    );
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleListPageChange = (event, newPage) => {
    setListPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setListPage(0);
  };

  const filteredRequirements = requirements.filter((requirement) =>
    requirement.requirement_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const optedInRequirements = requirements.filter(
    (requirement) => requirement.active
  );

  const displayedRequirements =
    viewMode === "card"
      ? filteredRequirements.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )
      : filteredRequirements.slice(
          listPage * rowsPerPage,
          listPage * rowsPerPage + rowsPerPage
        );

  const totalPages = Math.ceil(filteredRequirements.length / itemsPerPage);

  return (
    <Box sx={{ display: "flex" }}>
      <TopBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
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
        <Container>
          <BreadCrumb />

          {activeTab === 0 ? (
            <Button
              variant="contained"
              onClick={handleUpdate}
              sx={{ float: "right", mb: 2, backgroundColor: "rgb(31 91 139)" }}
            >
              <Refresh sx={{ color: "white" }} />
            </Button>
          ) : (
            ""
          )}

          {errorMessage ? (
            <Alert
              show={errorMessage}
              onClose={() => setErrorMessage(false)}
              dismissible
              sx={{ mb: 2 }}
              severity="warning"
            >
              {errorMessage}
            </Alert>
          ) : null}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="Tabs"
            sx={{ mb: 3 }}
          >
            <Tab label="Source" />
            {loginRole !== "recruiter_sourcing" &&
            loginRole !== "lead_sourcing" &&
            loginRole !== "account_manager" ? (
              <Tab label="Process" />
            ) : (
              <Tab label="Process" disabled />
            )}
            <Tab label="Evaluate" disabled />
            {loginRole === "manager" || loginRole === "account_manager" ? (
              <Tab label="Reports" />
            ) : (
              ""
            )}
          </Tabs>
          <TabPanel value={activeTab} index={0}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Requirements</Typography>
              <Box display="flex" alignItems="center">
                <TextField
                  label="Search by ID"
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  sx={{ mr: 2 }}
                  InputProps={{
                    endAdornment: (
                      <IconButton>
                        <Search />
                      </IconButton>
                    ),
                  }}
                  style={{ borderRadius: "20px" }}
                />
                <IconButton
                  color={viewMode === "card" ? "primary" : "default"}
                  onClick={() => setViewMode("card")}
                >
                  <ViewModule />
                </IconButton>
                <IconButton
                  color={viewMode === "list" ? "primary" : "default"}
                  onClick={() => setViewMode("list")}
                >
                  <ViewList />
                </IconButton>
              </Box>
            </Box>
            {loading ? (
              <Grid container spacing={2}>
                {[...Array(6)].map((_, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        mb: 2,
                        height: 200,
                        bgcolor: "rgb(255 255 255)",
                        border: 1,
                        borderColor: "#ccc",
                        borderRadius: 8,
                        p: 2,
                      }}
                    >
                      <CardContent>
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="80%" />
                        <Skeleton variant="rectangular" height={80} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : requirements.length === 0 ? (
              <Card sx={{ mb: 2, bgcolor: "#ffff" }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    No Data Available!
                  </Typography>
                </CardContent>
              </Card>
            ) : filteredRequirements.length === 0 ? (
              <Card sx={{ mb: 2, bgcolor: "#ffff" }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    No results found!
                  </Typography>
                </CardContent>
              </Card>
            ) : viewMode === "card" ? (
              <>
                <Grid container spacing={2} sx={{ bgcolor: "#ffff" }}>
                  {displayedRequirements.map((requirement) => (
                    <Grid
                      item
                      key={requirement.requirement_id}
                      xs={12}
                      sm={6}
                      md={4}
                    >
                      <Card
                        sx={{
                          mb: 2,
                          height: 260,
                          bgcolor: "rgb(255 255 255)",
                          border: 1,
                          borderColor: "#ccc",
                          borderRadius: 8,
                          p: 2,
                          position: "relative",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                          },
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          pointerEvents: isRequirementDeactivated(requirement)
                            ? "none"
                            : "auto",
                          opacity: isRequirementDeactivated(requirement)
                            ? 0.5
                            : 1,
                        }}
                      >
                        <CardContent>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={2}
                          >
                            <Box display="flex" alignItems="center">
                              <img
                                src="./briefcase__2_.png"
                                height={50}
                                width={50}
                                alt="Briefcase"
                              />
                            </Box>
                            <Box>
                              <Rating
                                name="read-only"
                                value={requirement.stars}
                                readOnly
                              />
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 2,
                            }}
                          >
                            <Typography
                              variant="h7"
                              sx={{ cursor: "pointer", fontWeight: 700 }}
                              onClick={() => handleCardClick(requirement)}
                            >
                              {requirement.job_role}
                            </Typography>
                            <Chip
                              label={`Bounty: ${requirement.bounty}`}
                              color="primary"
                              size="small"
                              sx={{ fontWeight: "bold", fontSize: 12 }}
                            />
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: 12 }}
                          >
                            Requirement ID: {requirement.requirement_id}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: 12, mb: 1 }}
                          >
                            Experience: {requirement.experience} years
                          </Typography>
                          <Divider />
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 2,
                            }}
                          >
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: 12, fontWeight: "bold" }}
                            >
                              Resumes Submitted:{" "}
                              {
                                requirement.resumes.filter(
                                  (resume) => resume.resume_processed_by
                                ).length
                              }
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: 12, fontWeight: "bold" }}
                            >
                              Resumes Required:{" "}
                              {requirement.num_resumes_required}
                            </Typography>
                          </Box>
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            mb={2}
                          >
                            {(loginRole === "recruiter_processing" ||
                              loginRole === "lead_processing") && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color={
                                    requirement.active
                                      ? "success.main"
                                      : "error.main"
                                  }
                                  sx={{
                                    fontSize: 12,
                                    fontWeight: "bold",
                                    marginRight: 1,
                                  }}
                                >
                                  {requirement.active ? "Opt-In" : "Opt-Out"}
                                </Typography>
                                <Switch
                                  checked={requirement.active || false}
                                  onChange={(e) => handleToggle(requirement, e)}
                                  color="primary"
                                  size="small"
                                />
                              </Box>
                            )}
                            {(loginRole === "recruiter_sourcing" ||
                              loginRole === "lead_sourcing") &&
                              (requirement.resumes.length >= 1 ? (
                                <Chip
                                  label={`Explored`}
                                  color="success"
                                  size="small"
                                  sx={{ fontWeight: "bold", fontSize: 12 }}
                                />
                              ) : (
                                " "
                              ))}
                            <Chip
                              label={`Opt-Ins: ${
                                optInCounts[requirement.requirement_id] || 0
                              }`}
                              color="secondary"
                              size="small"
                              sx={{ fontWeight: "bold", fontSize: 12 }}
                            />
                          </Box>
                          {isRequirementDeactivated(requirement) ? (
                            <Box
                              sx={{
                                position: "absolute",
                                top: 10,
                                right: 10,
                              }}
                            >
                              <Chip
                                label="Deactivated"
                                color="warning"
                                size="small"
                              />
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                position: "absolute",
                                top: 10,
                                right: 10,
                              }}
                            >
                              <Chip
                                label={`${requirement.requirement_priority}`}
                                color={
                                  requirement.requirement_priority === "High"
                                    ? "error"
                                    : "default"
                                }
                                size="small"
                              />
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>SNO</TableCell>
                      <TableCell>Requirement ID</TableCell>
                      <TableCell>Job Role</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Experience</TableCell>
                      {(loginRole === "recruiter_processing" ||
                        loginRole === "lead_processing") && (
                        <TableCell>Opt-In Status</TableCell>
                      )}
                      <TableCell>Priority</TableCell>
                      <TableCell>Opt-In Count</TableCell>
                      <TableCell>Resumes Submitted / Required</TableCell>
                      {(loginRole === "recruiter_sourcing" ||
                        loginRole === "lead_sourcing") && (
                        <TableCell>Explored</TableCell>
                      )}
                      {(loginRole === "recruiter_processing" ||
                        loginRole === "lead_processing") && (
                        <TableCell>Action</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedRequirements.map((requirement, index) => (
                      <TableRow key={requirement.requirement_id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell
                          onClick={() => handleCardClick(requirement)}
                          style={{ cursor: "pointer", color: "blue" }}
                        >
                          {requirement.requirement_id}
                        </TableCell>
                        <TableCell>{requirement.job_role}</TableCell>
                        <TableCell>{requirement.location}</TableCell>
                        <TableCell>{requirement.experience}</TableCell>
                        {(loginRole === "recruiter_processing" ||
                          loginRole === "lead_processing") && (
                          <TableCell>
                            <Chip
                              label={
                                requirement.active ? "Opted In" : "Opted Out"
                              }
                              color={requirement.active ? "success" : "default"}
                            />
                          </TableCell>
                        )}
                        <TableCell>
                          <Chip
                            label={`${requirement.requirement_priority}`}
                            color={
                              requirement.requirement_priority === "High"
                                ? "error"
                                : "default"
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {optInCounts[requirement.requirement_id] || 0}
                        </TableCell>
                        <TableCell>
                          {
                            requirement.resumes.filter(
                              (resume) => resume.resume_processed_by
                            ).length
                          }{" "}
                          / {requirement.num_resumes_required}
                        </TableCell>
                        {(loginRole === "recruiter_processing" ||
                          loginRole === "lead_processing") && (
                          <TableCell>
                            <Switch
                              checked={requirement.active}
                              onChange={(event) =>
                                handleToggle(requirement, event)
                              }
                            />
                            {isRequirementDeactivated(requirement) && (
                              <Alert severity="warning" sx={{ mt: 2 }}>
                                Deactivated
                              </Alert>
                            )}
                          </TableCell>
                        )}
                        {(loginRole === "recruiter_sourcing" ||
                          loginRole === "lead_sourcing") && (
                          <TableCell>
                            {requirement.resumes.length >= 1 ? (
                              <Chip
                                label="Yes"
                                color="success"
                                size="small"
                                sx={{ fontWeight: "bold", fontSize: 12 }}
                              />
                            ) : (
                              <Chip
                                label="No"
                                color="warning"
                                size="small"
                                sx={{ fontWeight: "bold", fontSize: 12 }}
                              />
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                  component="div"
                  count={filteredRequirements.length}
                  page={listPage}
                  onPageChange={handleListPageChange}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            )}
            {viewMode === "card" && (
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                style={{
                  marginTop: 16,
                  display: "flex",
                  justifyContent: "center",
                }}
              />
            )}
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <Process optedInRequirements={optedInRequirements}/>
          </TabPanel>
          <TabPanel value={activeTab} index={3}>
            <Reports />
          </TabPanel>
        </Container>
      </Box>
    </Box>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Paper style={{ boxShadow: "none" }}>{children}</Paper>
        </Box>
      )}
    </div>
  );
}

export default Home;
