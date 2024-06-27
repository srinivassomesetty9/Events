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
  Pagination,
  Typography,
  Box,
  Modal,
  IconButton,
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

const UserAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [modalAction, setModalAction] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAssignments();
  }, [page]);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(
        `https://api.jinnhire.in/jinnhire/data/users/?page=${page}`,
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

  const handleActivate = async (requirementId) => {
    try {
      await axios.post(
        `https://api.jinnhire.in/jinnhire/data/users/${requirementId}/assignment_activate/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      );
      setShow(true);
      setSeverity("success");
      setMessage("Actived assignment successfully!");
      fetchAssignments();
    } catch (error) {
      console.error("Error activating assignment:", error);
      setShow(true);
      setSeverity("error");
      if (error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Error activating assignment. Please try again.");
      }
    }
  };

  const handleDeactivate = async (requirementId) => {
    try {
      console.log(requirementId, "RID");
      await axios.post(
        `https://api.jinnhire.in/jinnhire/data/users/${requirementId}/assignment_deactivate/`,
        {},
        {
          headers: {
            Authorization: ` Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setShow(true);
      setSeverity("success");
      setMessage("Deleted assignment successfully!");
      fetchAssignments();
    } catch (error) {
      console.error("Error deactivating assignment:", error);
      setShow(true);
      setSeverity("error");
      if (error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Error deactivating assignment. Please try again.");
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (assignment, action) => {
    setSelectedAssignment(assignment);
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
      handleDeactivate(selectedAssignment.user_profile_id);
    }
    handleCloseModal();
  };

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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SNO</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body1" gutterBottom>
                    No data available
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              assignments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((assignment, index) => (
                  <TableRow key={index}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{assignment.username}</TableCell>
                    <TableCell>{assignment.role}</TableCell>
                    <TableCell>
                      <Tooltip
                        title={
                          assignment.is_active_for_assignment
                            ? "Deactivate"
                            : "Activate"
                        }
                      >
                        <IconButton
                          color={
                            assignment.is_active_for_assignment
                              ? "success"
                              : "warning"
                          }
                          onClick={() =>
                            assignment.is_active_for_assignment
                              ? handleOpenModal(assignment, "deactivate")
                              : handleActivate(assignment.id)
                          }
                        >
                          {assignment.is_active_for_assignment ? (
                            <ToggleOffIcon />
                          ) : (
                            <ToggleOnIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={assignments.length}
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
              ? "Delete Assignment"
              : "Deactivate Assignment"}
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Are you sure you want to {modalAction} this assignment?
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

export default UserAssignments;
