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
} from "@mui/material";
import TopBar from "./TopBar";
import axios from "axios";
import BreadCrumb from "./BreadCrumb";
import SideBar from "./SideBar";

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

function Profiles() {
  const [profiles, setProfiles] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0); // Default selected tab index
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  useEffect(() => {
    // Fetch profiles based on the selected tab
    fetchProfiles(selectedTab);
  }, [selectedTab]);

  const fetchProfiles = async (tabIndex) => {
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
        additionalParams = { state: "communication_failed" };
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
    }
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

  return (
    <Box sx={{ display: "flex" }}>
      <TopBar />
      <Box component="main" mt={8} sx={{ flexGrow: 1, p: 3 }}>
        <ThemeProvider theme={theme}>
          <Container>
            <BreadCrumb />
            {errorMessage && (
              <Alert
                severity="error"
                onClose={() => setErrorMessage("")}
                style={{ marginLeft: "220px", width: "50%" }}
              >
                {errorMessage}
              </Alert>
            )}
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
                  <Tab label="Profiles Intervention" />
                  <Tab label="Unsuccessful Profiles" />
                  <Tab label="Dormant Profiles" />
                  <Tab label="In-Progress" />
                  <Tab label="No-Response" />
                  <Tab label="Communication Failed" />
                </Tabs>
              </AppBar>
            </Paper>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#4e8daf", color: "#fff" }}>
                    {tableHeaders[selectedTab].map((header, index) => (
                      <TableCell key={index} sx={{ color: "#fff" }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {profiles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="body1" gutterBottom>
                          No data available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    profiles
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((profile, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{profile.jd_id || "N/A"}</TableCell>
                          <TableCell>
                            {profile.candidate_fname || "N/A"}
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
                                {profile.waiting_time || "N/A"}
                              </TableCell>
                            </>
                          )}
                          {selectedTab === 5 && (
                            <TableCell>
                              {profile.follow_up_count || "N/A"}
                            </TableCell>
                          )}
                          <TableCell>
                            <Button variant="contained" color="primary">
                              Action
                            </Button>
                          </TableCell>
                          {selectedTab !== 6 && (
                            <>
                              <TableCell>
                                {profile.questionsList?.join(", ") ||
                                  "No questions"}
                              </TableCell>
                            </>
                          )}
                        </TableRow>
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
            </Paper>
          </Container>
        </ThemeProvider>
      </Box>
    </Box>
  );
}

export default Profiles;
