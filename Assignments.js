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
  FormControl,
  Select,
  MenuItem,
  Chip,
  Checkbox,
  ListItemText,
  CircularProgress,
  ListSubheader,
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
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [selectedUsernames, setSelectedUsernames] = useState({});
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const handleActivateDeactivate = async (requirementId, isActive) => {
    const selectedIds =
      selectedUsernames[requirementId]?.map((item) => item.id) || [];
    const url = isActive
      ? "https://api.jinnhire.in/jinnhire/data/assignments/bulk_deactivate_assignments/"
      : "https://api.jinnhire.in/jinnhire/data/assignments/bulk_activate_assignments/";

    try {
      await axios.post(
        url,
        { user_ids: selectedIds, requirement_id: requirementId },
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
      setSelectedUsernames({});
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

    const selectedIds =
      selectedUsernames[requirementId]?.map((item) => item.id) || [];
    const token = localStorage.getItem("token");

    if (assignmentIds.length === 0) {
      setShow(true);
      setSeverity("warning");
      setMessage("No assignments found for the given requirement ID.");
      return;
    }

    try {
      const response = await axios.delete(
        "https://api.jinnhire.in/jinnhire/data/assignments/delete_assignments/",
        {
          data: { assignment_ids: selectedIds },
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setShow(true);
      setSeverity("success");
      setMessage("Deleted assignments successfully!");
      setSelectedUsernames({});
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

  const handleSelectUsername = (requirementId, assignment) => {
    setSelectedUsernames((prevSelectedUsernames) => {
      const newSelected = { ...prevSelectedUsernames };
      if (newSelected[requirementId]?.some((u) => u.id === assignment.id)) {
        newSelected[requirementId] = newSelected[requirementId].filter(
          (u) => u.id !== assignment.id
        );
      } else {
        newSelected[requirementId] = [
          ...(newSelected[requirementId] || []),
          { id: assignment.id, username: assignment.user_username },
        ];
      }
      return newSelected;
    });
  };

  const handleSelectAllUsernames = (requirementId) => {
    setSelectedUsernames((prevSelectedUsernames) => {
      const usernames = assignments
        .filter((assignment) => assignment.requirement_id === requirementId)
        .map((assignment) => ({
          id: assignment.id,
          username: assignment.user_username,
        }));

      const allSelected =
        selectedUsernames[requirementId]?.length === usernames.length;

      return {
        ...prevSelectedUsernames,
        [requirementId]: allSelected ? [] : usernames,
      };
    });
  };

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.requirement_id.toLowerCase().includes(search.toLowerCase())
  );

  const groupedAssignments = filteredAssignments.reduce((acc, assignment) => {
    if (!acc[assignment.requirement_id]) {
      acc[assignment.requirement_id] = [];
    }
    acc[assignment.requirement_id].push(assignment);
    return acc;
  }, {});

  const formatUsername = (username) => {
    if (typeof username !== "string") {
      username = String(username);
    }
    return username.replace(
      /(\w+)\.(\w+)@.+/,
      (_, firstName, lastName) => `${firstName} ${lastName}`
    );
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
            <TableRow>
              <TableCell>SNO</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Requirement ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : Object.keys(groupedAssignments).length === 0 ? (
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
                                {assignment.customer_name}
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
                          {subIndex === 0 && (
                            <TableCell
                              rowSpan={groupedAssignments[requirementId].length}
                            >
                              <FormControl fullWidth>
                                <Select
                                  multiple
                                  value={
                                    selectedUsernames[requirementId]?.map(
                                      (item) => item.id
                                    ) || []
                                  }
                                  onChange={() => {}}
                                  defaultValue={groupedAssignments[
                                    requirementId
                                  ].map((assignment) => assignment.id)}
                                  renderValue={(selected) => (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 0.5,
                                      }}
                                    >
                                      {selected.map((id) => {
                                        const user = selectedUsernames[
                                          requirementId
                                        ]?.find((item) => item.id === id);
                                        return user ? (
                                          <Chip
                                            key={id}
                                            label={formatUsername(
                                              user.username
                                            )}
                                          />
                                        ) : null;
                                      })}
                                    </Box>
                                  )}
                                >
                                  <MenuItem
                                    value="select-all"
                                    onClick={() =>
                                      handleSelectAllUsernames(requirementId)
                                    }
                                  >
                                    <Checkbox
                                      checked={
                                        selectedUsernames[requirementId]
                                          ?.length ===
                                        groupedAssignments[requirementId].length
                                      }
                                    />
                                    <ListItemText primary="Select All" />
                                  </MenuItem>
                                  <ListSubheader>Active</ListSubheader>
                                  {groupedAssignments[requirementId]
                                    .filter((assignment) => assignment.active)
                                    .map((assignment) => (
                                      <MenuItem
                                        key={assignment.id}
                                        value={assignment.id}
                                      >
                                        <Checkbox
                                          checked={selectedUsernames[
                                            requirementId
                                          ]?.some(
                                            (item) => item.id === assignment.id
                                          )}
                                          onChange={() =>
                                            handleSelectUsername(
                                              requirementId,
                                              assignment
                                            )
                                          }
                                        />
                                        <ListItemText
                                          primary={formatUsername(
                                            assignment.user_username
                                          )}
                                        />
                                      </MenuItem>
                                    ))}
                                  <ListSubheader>Non-Active</ListSubheader>
                                  {groupedAssignments[requirementId]
                                    .filter((assignment) => !assignment.active)
                                    .map((assignment) => (
                                      <MenuItem
                                        key={assignment.id}
                                        value={assignment.id}
                                      >
                                        <Checkbox
                                          checked={selectedUsernames[
                                            requirementId
                                          ]?.some(
                                            (item) => item.id === assignment.id
                                          )}
                                          onChange={() =>
                                            handleSelectUsername(
                                              requirementId,
                                              assignment
                                            )
                                          }
                                        />
                                        <ListItemText
                                          primary={formatUsername(
                                            assignment.user_username
                                          )}
                                        />
                                      </MenuItem>
                                    ))}
                                </Select>
                              </FormControl>
                            </TableCell>
                          )}

                          {subIndex === 0 && (
                            <TableCell
                              rowSpan={groupedAssignments[requirementId].length}
                            >
                              <Tooltip
                                title={
                                  assignment.active ? "Deactivate" : "Activate"
                                }
                              >
                                <IconButton
                                  color={
                                    assignment.active ? "warning" : "success"
                                  }
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
                              <Tooltip title="Delete">
                                <IconButton
                                  color="error"
                                  onClick={() => handleDelete(requirementId)}
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
            Are you sure you want to {modalAction} assignments with requirement
            ID {selectedAssignment}?
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
