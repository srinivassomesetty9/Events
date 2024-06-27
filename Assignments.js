import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Modal,
  IconButton,
  TextField,
  TablePagination,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  ToggleOff as ToggleOffIcon,
  ToggleOn as ToggleOnIcon,
} from "@mui/icons-material";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [modalAction, setModalAction] = useState("");
  const [search, setSearch] = useState(""); // New state for search input
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(
        `https://api.jinnhire.in/jinnhire/data/assignments/list_assignments`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setAssignments(response.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const handleActivateDeactivate = async (requirementId, isActive) => {
    const assignmentIds = assignments
      .filter((assignment) => assignment.requirement_id === requirementId)
      .map((assignment) => assignment.id);

    const url = isActive
      ? "https://api.jinnhire.in/jinnhire/data/assignments/bulk_deactivate_assignments/"
      : "https://api.jinnhire.in/jinnhire/data/assignments/bulk_activate_assignments/";

    try {
      await axios.post(
        url,
        { user_ids: assignmentIds, requirement_id: requirementId},
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setShow(true);
      setSeverity("success");
      setMessage(
        `${isActive ? "Deactivated" : "Activated"} assignments successfully!`
      );
      fetchAssignments();
    } catch (error) {
      console.error(
        `Error ${isActive ? "deactivating" : "activating"} assignments:`,
        error
      );
      setShow(true);
      setSeverity("error");
      setMessage(
        error.response?.data?.message ||
          `Error ${
            isActive ? "deactivating" : "activating"
          } assignments. Please try again.`
      );
    }
  };

  const handleDelete = async (requirementId) => {
    const assignmentIds = assignments
      .filter((assignment) => assignment.requirement_id === requirementId)
      .map((assignment) => assignment.id);

    try {
      await axios.post(
        "https://api.jinnhire.in/jinnhire/data/assignments/delete_assignment/",
        { assignment_id: assignmentIds },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setShow(true);
      setSeverity("success");
      setMessage("Deleted assignments successfully!");
      fetchAssignments();
    } catch (error) {
      console.error("Error deleting assignments:", error);
      setShow(true);
      setSeverity("error");
      setMessage(
        error.response?.data?.message ||
          "Error deleting assignments. Please try again."
      );
    }
  };

  const handleOpenModal = (requirementId, action) => {
    setSelectedAssignment(requirementId);
    setModalAction(action);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAssignment(null);
    setModalAction("");
  };

  const handleModalAction = () => {
    if (modalAction === "deactivate") {
      handleActivateDeactivate(selectedAssignment, true);
    } else if (modalAction === "delete") {
      handleDelete(selectedAssignment);
    }
    handleCloseModal();
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.requirement_id.toLowerCase().includes(search.toLowerCase())
  );

  // Grouping assignments by requirement_id
  const groupedAssignments = filteredAssignments.reduce((acc, assignment) => {
    if (!acc[assignment.requirement_id]) {
      acc[assignment.requirement_id] = [];
    }
    acc[assignment.requirement_id].push(assignment);
    return acc;
  }, {});

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
      <Typography variant="h4" align="center" gutterBottom>
        Assignment List
      </Typography>
      <TextField
        label="Search by Requirement ID"
        variant="outlined"
        value={search}
        onChange={handleSearchChange}
        margin="normal"
        size="small"
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ color: "#fff" }}>
              <TableCell>SNO</TableCell>
              <TableCell>Requirement ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(groupedAssignments).length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body1" gutterBottom>
                    No data available
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              Object.keys(groupedAssignments)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((requirementId, index) => (
                  <React.Fragment key={requirementId}>
                    {groupedAssignments[requirementId].map(
                      (assignment, subIndex) => (
                        <TableRow key={assignment.id}>
                          {subIndex === 0 && (
                            <>
                              <TableCell
                                rowSpan={
                                  groupedAssignments[requirementId].length
                                }
                              >
                                {page * rowsPerPage + index + 1}
                              </TableCell>
                              <TableCell
                                rowSpan={
                                  groupedAssignments[requirementId].length
                                }
                              >
                                {assignment.requirement_id}
                              </TableCell>
                            </>
                          )}
                          <TableCell>{assignment.user_username}</TableCell>
                          <TableCell>{assignment.customer_name}</TableCell>
                          {subIndex === 0 && (
                            <TableCell
                              rowSpan={
                                groupedAssignments[requirementId].length
                              }
                            >
                              <Tooltip
                                title={
                                  assignment.active
                                    ? "Deactivate All"
                                    : "Activate All"
                                }
                              >
                                <IconButton
                                  color={assignment.active ? "warning" : "success"}
                                  onClick={() =>
                                    handleActivateDeactivate(
                                      requirementId,
                                      assignment.active
                                    )
                                  }
                                >
                                  {assignment.active ? (
                                    <ToggleOffIcon />
                                  ) : (
                                    <ToggleOnIcon />
                                  )}
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete All">
                                <IconButton
                                  color="error"
                                  onClick={() =>
                                    handleOpenModal(requirementId, "delete")
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          )}
                        </TableRow>
                      )
                    )}
                  </React.Fragment>
                ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={Object.keys(groupedAssignments).length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            {modalAction === "delete"
              ? "Delete Assignments"
              : "Deactivate Assignments"}
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Are you sure you want to {modalAction} assignments with requirement ID {selectedAssignment}?
          </Typography>
          <Box mt={4} display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="primary"
              onClick={handleModalAction}
            >
              Yes
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCloseModal}
            >
              No
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Assignments;
