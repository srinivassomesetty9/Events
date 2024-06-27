import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import BreadCrumb from "./BreadCrumb";
import Assignments from "./Assignments";
import UserAssignments from "./UserAssignments";
import { Alert, Select, Snackbar, Tooltip } from "@mui/material";
import GlobalSettings from "./GlobalSettings";

const SettingsTab = () => {
  const [value, setValue] = useState(0);
  const [userTabValue, setUserTabValue] = useState(0); // For nested User tab
  const [clients, setClients] = useState([]);
  const [excelFiles, setExcelFiles] = useState([]);
  const [customerAssignments, setCustomerAssignments] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [domain, setDomain] = useState("");
  const [industry, setIndustry] = useState("");
  const [aboutCustomer, setAboutCustomer] = useState("");
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerPDF, setCustomerPDF] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailId, setEmailId] = useState("");
  const [role, setRole] = useState("");
  const [loginrole, setLoginRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+12707478852");
  const [customerAssignment, setCustomerAssignment] = useState([]);

  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [tenantData, setTenantData] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleUserTabChange = (event, newValue) => {
    setUserTabValue(newValue);
  };

  const handleCustomerSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", customerName);
    formData.append("address", address);
    formData.append("domain", domain);
    formData.append("industry", industry);
    formData.append("about_customer", aboutCustomer);
    formData.append("tenant", tenantData.id);
    formData.append("customer_pdf", customerPDF); // Append customerPDF to formData

    // Append Excel file data
    excelFiles.forEach((file, index) => {
      formData.append(`division`, file.divisionName);
      formData.append(`target_audience`, file.targetAudience);
      formData.append(`customer_enablement_excel[]`, file.excel);
    });

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://api.jinnhire.in/jinnhire/data/customers/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setShow(true);
      setSeverity("success");
      setMessage("Customer created successfully!");

      // Reset input fields after successful creation
      setCustomerSuggestions([]);
      setCustomerName("");
      setAddress("");
      setDomain("");
      setIndustry("");
      setAboutCustomer("");
      setCustomerPDF(null); // Reset file input
      setExcelFiles([]); // Reset excel files input
      fetchCustomerAssignments();
    } catch (error) {
      console.error("Error creating customer:", error);
      setShow(true);
      setSeverity("error");
      if (error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Failed to create customer.");
      }
    }
  };

  const handleUserSubmit = async (event) => {
    event.preventDefault();
    console.log(customerAssignment, "CA");
    const customerIds = customerAssignment.map((ca) => ca.id);

    const payload = {
      first_name: firstName,
      last_name: username,
      username,
      password,
      email: emailId,
      role,
      phone_number: phoneNumber,
      customer_ids: customerIds,
      is_active_for_assignment: true,
    };

    const loggedInUserEmail = localStorage.getItem("username");
    const loggedInUserDomain = loggedInUserEmail.split("@")[1];

    const newUserDomain = emailId.split("@")[1];

    if (newUserDomain !== loggedInUserDomain) {
      console.error(
        "The new user email domain does not match the logged-in user domain."
      );

      setShow(true);
      setSeverity("warning");
      setMessage(
        "The new user email domain must match the logged-in user domain."
      );
    } else {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://api.jinnhire.in/jinnhire/data/tenants/current/?domain=${loggedInUserDomain}`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const tenantData = response.data;
        payload.tenant_id = tenantData.id;

        await axios.post(
          "https://api.jinnhire.in/jinnhire/data/users/",
          payload,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setShow(true);
        setSeverity("success");
        setMessage("User created successfully!");

        // Reset input fields after successful creation
        setFirstName("");
        setLastName("");
        setUsername("");
        setPassword("");
        setEmailId("");
        setRole("");
        setPhoneNumber("+12707478852");
        setCustomerAssignment([]);
      } catch (error) {
        console.error("Error creating user:", error);

        setShow(true);
        setSeverity("error");
        if (error.response.data.message) {
          setMessage(error.response.data.message);
        } else {
          setMessage("Failed to create user.");
        }
      }
    }
  };

  const handleAddClient = () => {
    if (clients.length === 0) {
      setClients([{ name: "", about: "", relationship: "", pdf: null }]);
    }
  };

  const handleDeleteClient = (index) => {
    setClients(clients.filter((_, i) => i !== index));
  };

  const handleAddExcelFile = () => {
    setExcelFiles([
      ...excelFiles,
      { divisionName: "", targetAudience: "", excel: null },
    ]);
  };

  const handleDeleteExcelFile = (index) => {
    setExcelFiles(excelFiles.filter((_, i) => i !== index));
  };

  const handleCustomerSearch = async (name) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://api.jinnhire.in/jinnhire/data/customers/search/?name=${name}&tenant=${tenantData.id}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setCustomerSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching customer suggestions:", error);
    }
  };

  const handleCustomerNameChange = (event, value) => {
    setCustomerName(value);
    if (value.length > 2) {
      handleCustomerSearch(value);
    }
  };

  const handleCustomerSelect = (event, value) => {
    if (value) {
      setSelectedCustomer(value);
      setCustomerName(value.name);
      setAddress(value.address);
      setDomain(value.domain);
      setIndustry(value.industry);
      setAboutCustomer(value.about);
    }
  };

  const fetchCustomerAssignments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://api.jinnhire.in/jinnhire/data/customers/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setCustomerAssignments(response.data);
      console.log("PRINT ID", response.data);
    } catch (error) {
      console.error("Error fetching customer assignments:", error);
    }
  };

  useEffect(() => {
    fetchCustomerAssignments();
    fetchTenantData();
    const userData = localStorage.getItem("user");
    const getrole = JSON.parse(userData);
    // console.log(getrole.role,"ROLE")
    setLoginRole(getrole.role);
  }, []);

  const fetchTenantData = async () => {
    try {
      const token = localStorage.getItem("token");
      const loggedInUserEmail = localStorage.getItem("username");
      const loggedInUserDomain = loggedInUserEmail.split("@")[1];
      const response = await axios.get(
        `https://api.jinnhire.in/jinnhire/data/tenants/current/?domain=${loggedInUserDomain}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setTenantData(response.data);
      console.log("Tenant data:", response.data);
    } catch (error) {
      console.error("Error fetching tenant data:", error);
    }
  };

  const handleExcelFileChange = (index, field, value) => {
    const updatedExcelFiles = [...excelFiles];
    updatedExcelFiles[index][field] = value;
    console.log(updatedExcelFiles, "EXCEL DATA");
    setExcelFiles(updatedExcelFiles);
  };

  const validateExcelFileName = (index) => {
    console.log(industry, "INDUSTRY");
    const industryValue = industry.trim();
    const customerNameValue = customerName.trim();
    const targetAudience = excelFiles[index].targetAudience.trim();
    const divisionName = excelFiles[index].divisionName.trim();
    const expectedFormat = `${industryValue}_${customerNameValue}_${targetAudience}_${divisionName}.xlsx`;
    const fileInput = document.getElementById(
      `customerEnablementExcel-${index}`
    );
    const fileName = fileInput.files[0].name;
    if (fileName !== expectedFormat) {
      setShow(true);
      setSeverity("warning");
      setMessage(`The file must be named exactly as ${expectedFormat}`);
      fileInput.value = ""; // Clear the file input
    }
  };

  return (
    <Container>
      <Box mt={12} sx={{ width: "100%", typography: "body1" }}>
        <BreadCrumb />
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
        <Box>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="settings tabs"
            centered
            sx={{ mb: 3 }}
          >
            {loginrole !== "manager" ? <Tab label="Customer" /> : ""}
            {loginrole !== "account_manager" && <Tab label="User" />}
            <Tab label="Assignment" />
            {(loginrole === "admin" || loginrole === "account_manager") && (
              <Tab label="Global Settings" />
            )}
          </Tabs>
        </Box>
        {loginrole === "account_manager" ? (
          <>
            <TabPanel value={value} index={0}>
              <Paper sx={{ p: 4, backgroundColor: "" }}>
                <Typography variant="h5" gutterBottom>
                  Add Customer
                </Typography>
                <form onSubmit={handleCustomerSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">Customer Name</Typography>
                      <Autocomplete
                        freeSolo
                        options={customerSuggestions}
                        getOptionLabel={(option) => option.name || ""}
                        onInputChange={handleCustomerNameChange}
                        onChange={handleCustomerSelect}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            placeholder="Type to search for existing customers..."
                            fullWidth
                            required
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">Address</Typography>
                      <TextField
                        id="address"
                        size="small"
                        fullWidth
                        required
                        multiline
                        rows={4}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">
                        Customer Mail Assignment
                      </Typography>
                      <TextField
                        id="domain"
                        size="small"
                        fullWidth
                        required
                        value={domain}
                        placeholder="Input dell if the mail-id is dell.demands@nexiiconsulting.online"
                        onChange={(e) => setDomain(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">Industry</Typography>
                      <TextField
                        id="industry"
                        size="small"
                        fullWidth
                        required
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1">About Customer</Typography>
                      <TextField
                        id="aboutCustomer"
                        size="small"
                        fullWidth
                        multiline
                        rows={4}
                        value={aboutCustomer}
                        onChange={(e) => setAboutCustomer(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1">Customer PDF</Typography>
                      <input
                        type="file"
                        id="customerPDF"
                        name="customer_pdf"
                        accept="application/pdf"
                        onChange={(e) => setCustomerPDF(e.target.files[0])}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6">
                        Customer Enablement Excel
                      </Typography>
                      {excelFiles.length === 0 && (
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: "rgb(31 91 139)" }}
                          onClick={handleAddExcelFile}
                          startIcon={<AddIcon />}
                        >
                          Add Excel File
                        </Button>
                      )}
                    </Grid>
                    {excelFiles.map((file, index) => (
                      <React.Fragment key={index}>
                        <Typography variant="h6">
                          Customer {index + 1}
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="body1">
                              Division Name
                            </Typography>
                            <TextField
                              id={`divisionName${index}`}
                              value={file.divisionName}
                              onChange={(e) =>
                                handleExcelFileChange(
                                  index,
                                  "divisionName",
                                  e.target.value
                                )
                              }
                              size="small"
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="body1">
                              Target Audience
                            </Typography>
                            <TextField
                              id={`targetAudience${index}`}
                              value={file.targetAudience}
                              onChange={(e) =>
                                handleExcelFileChange(
                                  index,
                                  "targetAudience",
                                  e.target.value
                                )
                              }
                              size="small"
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="body1">
                              Customer Enablement Excel
                            </Typography>
                            <input
                              type="file"
                              id={`customerEnablementExcel-${index}`}
                              onChange={(e) => {
                                handleExcelFileChange(
                                  index,
                                  "excel",
                                  e.target.files[0]
                                );
                                validateExcelFileName(index);
                              }}
                              accept=".xlsx,.xls"
                              multiple
                            />
                            <Button
                              variant="contained"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteExcelFile(index)}
                              sx={{ mt: 1 }}
                            >
                              Delete
                            </Button>
                          </Grid>
                        </Grid>
                      </React.Fragment>
                    ))}
                    {/* <Grid
                  item
                  xs={12}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6">Clients</Typography>
                  {clients.length === 0 && (
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "rgb(31 91 139)" }}
                      onClick={handleAddClient}
                      startIcon={<AddIcon />}
                    >
                      Add Client
                    </Button>
                  )}
                </Grid>
                {clients.map((client, index) => (
                  <React.Fragment key={index}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6">Client {index + 1}</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1">Client Name</Typography>
                        <TextField
                          id={`clientName-${index}`}
                          size="small"
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1">About Client</Typography>
                        <TextField
                          id={`aboutClient-${index}`}
                          size="small"
                          fullWidth
                          multiline
                          rows={4}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1">Relationship</Typography>
                        <TextField
                          id={`relationship-${index}`}
                          select
                          size="small"
                          fullWidth
                          required
                        >
                          <MenuItem value="Permanent">Permanent</MenuItem>
                          <MenuItem value="Contract">Contract</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1">Client PDF</Typography>
                        <input
                          type="file"
                          id={`clientPDF-${index}`}
                          name={`client_pdf_${index}`}
                          accept="application/pdf"
                        />
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteClient(index)}
                          sx={{ mt: 1 }}
                        >
                          Delete
                        </Button>
                      </Grid>
                    </Grid>
                  </React.Fragment>
                ))} */}
                    <Grid item xs={12}>
                      <Button variant="contained" type="submit" color="success">
                        Create Customer
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Paper sx={{ p: 4, backgroundColor: "" }}>
                <Typography variant="h5" gutterBottom>
                  Assignment Management
                </Typography>
                <Assignments />
              </Paper>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Paper sx={{ p: 4, backgroundColor: "" }}>
                <GlobalSettings />
              </Paper>
            </TabPanel>
          </>
        ) : loginrole === "manager" ? (
          <>
            <TabPanel value={value} index={0}>
              <Paper sx={{ p: 4, backgroundColor: "" }}>
                <Typography variant="h5" gutterBottom>
                  User Management
                </Typography>
                <Tabs
                  value={userTabValue}
                  onChange={handleUserTabChange}
                  aria-label="user management tabs"
                  centered
                  sx={{ mb: 3 }}
                >
                  <Tab label="Add New User" />
                  <Tab label="User Assignment" />
                </Tabs>
                <TabPanel value={userTabValue} index={0}>
                  <Paper sx={{ p: 4, backgroundColor: "" }}>
                    <div id="createUser" className="user-form">
                      <form onSubmit={handleUserSubmit}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body1">First Name</Typography>
                            <TextField
                              id="firstName"
                              size="small"
                              fullWidth
                              required
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body1">Last Name</Typography>
                            <TextField
                              id="lastName"
                              size="small"
                              fullWidth
                              required
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1">Username</Typography>
                            <TextField
                              id="username"
                              size="small"
                              fullWidth
                              required
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1">Password</Typography>
                            <TextField
                              id="password"
                              type="password"
                              size="small"
                              fullWidth
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1">Email ID</Typography>
                            <TextField
                              id="emailId"
                              type="email"
                              size="small"
                              fullWidth
                              required
                              value={emailId}
                              onChange={(e) => setEmailId(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1">Role</Typography>
                            <TextField
                              id="role"
                              select
                              size="small"
                              fullWidth
                              required
                              value={role}
                              onChange={(e) => setRole(e.target.value)}
                            >
                              <MenuItem value="recruiter_sourcing">
                                Recruiter-Sourcing
                              </MenuItem>
                              <MenuItem value="recruiter_processing">
                                Recruiter-Processing
                              </MenuItem>
                              <MenuItem value="lead_sourcing">
                                Lead-Sourcing
                              </MenuItem>
                              <MenuItem value="lead_processing">
                                Lead-Processing
                              </MenuItem>
                              <MenuItem value="admin">Admin</MenuItem>
                              <MenuItem value="manager">Manager</MenuItem>
                              <MenuItem value="account_manager">
                                Account-Manager
                              </MenuItem>
                            </TextField>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1">
                              Phone Number
                            </Typography>
                            <TextField
                              id="phoneNumber"
                              size="small"
                              fullWidth
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1">
                              Customer Assignment
                            </Typography>
                            <Tooltip
                              title="Select one or more customers to assign to this user"
                              placement="top"
                            >
                              <Select
                                id="customerAssignment"
                                multiple
                                fullWidth
                                value={customerAssignment}
                                onChange={(e) =>
                                  setCustomerAssignment(e.target.value)
                                }
                                renderValue={(selected) =>
                                  selected.map((ca) => ca.name).join(", ")
                                }
                                sx={{
                                  backgroundColor: "#f0f0f0",
                                  "& .MuiSelect-select": {
                                    padding: "10px",
                                    minHeight: "40px",
                                  },
                                  "& .MuiSelect-icon": {
                                    top: "auto",
                                    color: "#666",
                                    right: 0,
                                    left: "auto",
                                  },
                                }}
                              >
                                {customerAssignments.map((customer) => (
                                  <MenuItem key={customer.id} value={customer}>
                                    {customer.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </Tooltip>
                          </Grid>
                          <Grid item xs={12}>
                            <Button
                              type="submit"
                              variant="contained"
                              color="success"
                            >
                              Create User
                            </Button>
                          </Grid>
                        </Grid>
                      </form>
                    </div>
                    {/* <div id="updateUser" className="user-form" style={{ display: 'none' }}>
       <h3>Update Existing User</h3>
       <form id="updateUserForm" onSubmit={handleUserSubmit}>
         
         <Button type="submit" variant="contained">Update User</Button>
       </form>
     </div> */}
                  </Paper>
                </TabPanel>
                <TabPanel value={userTabValue} index={1}>
                  <UserAssignments />
                </TabPanel>
              </Paper>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Paper sx={{ p: 4, backgroundColor: "" }}>
                <Typography variant="h5" gutterBottom>
                  Assignment Management
                </Typography>
                <Assignments />
              </Paper>
            </TabPanel>
          </>
        ) : (
          <>
            <TabPanel value={value} index={0}>
              <Paper sx={{ p: 4, backgroundColor: "" }}>
                <Typography variant="h5" gutterBottom>
                  Add Customer
                </Typography>
                <form onSubmit={handleCustomerSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">Customer Name</Typography>
                      <Autocomplete
                        freeSolo
                        options={customerSuggestions}
                        getOptionLabel={(option) => option.name || ""}
                        onInputChange={handleCustomerNameChange}
                        onChange={handleCustomerSelect}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            placeholder="Type to search for existing customers..."
                            fullWidth
                            required
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">Address</Typography>
                      <TextField
                        id="address"
                        size="small"
                        fullWidth
                        required
                        multiline
                        rows={4}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">
                        Customer Mail Assignment
                      </Typography>
                      <TextField
                        id="domain"
                        size="small"
                        fullWidth
                        required
                        value={domain}
                        placeholder="Input dell if the mail-id is dell.demands@nexiiconsulting.online"
                        onChange={(e) => setDomain(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">Industry</Typography>
                      <TextField
                        id="industry"
                        size="small"
                        fullWidth
                        required
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1">About Customer</Typography>
                      <TextField
                        id="aboutCustomer"
                        size="small"
                        fullWidth
                        multiline
                        rows={4}
                        value={aboutCustomer}
                        onChange={(e) => setAboutCustomer(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1">Customer PDF</Typography>
                      <input
                        type="file"
                        id="customerPDF"
                        name="customer_pdf"
                        accept="application/pdf"
                        onChange={(e) => setCustomerPDF(e.target.files[0])}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6">
                        Customer Enablement Excel
                      </Typography>
                      {excelFiles.length === 0 && (
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: "rgb(31 91 139)" }}
                          onClick={handleAddExcelFile}
                          startIcon={<AddIcon />}
                        >
                          Add Excel File
                        </Button>
                      )}
                    </Grid>
                    {excelFiles.map((file, index) => (
                      <React.Fragment key={index}>
                        <Typography variant="h6">
                          Customer {index + 1}
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="body1">
                              Division Name
                            </Typography>
                            <TextField
                              id={`divisionName${index}`}
                              value={file.divisionName}
                              onChange={(e) =>
                                handleExcelFileChange(
                                  index,
                                  "divisionName",
                                  e.target.value
                                )
                              }
                              size="small"
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="body1">
                              Target Audience
                            </Typography>
                            <TextField
                              id={`targetAudience${index}`}
                              value={file.targetAudience}
                              onChange={(e) =>
                                handleExcelFileChange(
                                  index,
                                  "targetAudience",
                                  e.target.value
                                )
                              }
                              size="small"
                              fullWidth
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="body1">
                              Customer Enablement Excel
                            </Typography>
                            <input
                              type="file"
                              id={`customerEnablementExcel-${index}`}
                              onChange={(e) => {
                                handleExcelFileChange(
                                  index,
                                  "excel",
                                  e.target.files[0]
                                );
                                validateExcelFileName(index);
                              }}
                              accept=".xlsx,.xls"
                              multiple
                            />
                            <Button
                              variant="contained"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteExcelFile(index)}
                              sx={{ mt: 1 }}
                            >
                              Delete
                            </Button>
                          </Grid>
                        </Grid>
                      </React.Fragment>
                    ))}
                    {/* <Grid
           item
           xs={12}
           display="flex"
           justifyContent="space-between"
           alignItems="center"
         >
           <Typography variant="h6">Clients</Typography>
           {clients.length === 0 && (
             <Button
               variant="contained"
               sx={{ backgroundColor: "rgb(31 91 139)" }}
               onClick={handleAddClient}
               startIcon={<AddIcon />}
             >
               Add Client
             </Button>
           )}
         </Grid>
         {clients.map((client, index) => (
           <React.Fragment key={index}>
             <Divider sx={{ my: 2 }} />
             <Typography variant="h6">Client {index + 1}</Typography>
             <Grid container spacing={2}>
               <Grid item xs={12} sm={6}>
                 <Typography variant="body1">Client Name</Typography>
                 <TextField
                   id={`clientName-${index}`}
                   size="small"
                   fullWidth
                   required
                 />
               </Grid>
               <Grid item xs={12} sm={6}>
                 <Typography variant="body1">About Client</Typography>
                 <TextField
                   id={`aboutClient-${index}`}
                   size="small"
                   fullWidth
                   multiline
                   rows={4}
                 />
               </Grid>
               <Grid item xs={12} sm={6}>
                 <Typography variant="body1">Relationship</Typography>
                 <TextField
                   id={`relationship-${index}`}
                   select
                   size="small"
                   fullWidth
                   required
                 >
                   <MenuItem value="Permanent">Permanent</MenuItem>
                   <MenuItem value="Contract">Contract</MenuItem>
                 </TextField>
               </Grid>
               <Grid item xs={12} sm={6}>
                 <Typography variant="body1">Client PDF</Typography>
                 <input
                   type="file"
                   id={`clientPDF-${index}`}
                   name={`client_pdf_${index}`}
                   accept="application/pdf"
                 />
                 <Button
                   variant="contained"
                   color="error"
                   startIcon={<DeleteIcon />}
                   onClick={() => handleDeleteClient(index)}
                   sx={{ mt: 1 }}
                 >
                   Delete
                 </Button>
               </Grid>
             </Grid>
           </React.Fragment>
         ))} */}
                    <Grid item xs={12}>
                      <Button variant="contained" type="submit" color="success">
                        Create Customer
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Paper sx={{ p: 4, backgroundColor: "" }}>
                <Typography variant="h5" gutterBottom>
                  User Management
                </Typography>
                <Tabs
                  value={userTabValue}
                  onChange={handleUserTabChange}
                  aria-label="user management tabs"
                  centered
                  sx={{ mb: 3 }}
                >
                  <Tab label="Add New User" />
                  <Tab label="User Assignment" />
                </Tabs>
                <TabPanel value={userTabValue} index={0}>
                  <Paper sx={{ p: 4, backgroundColor: "" }}>
                    <div id="createUser" className="user-form">
                      <form onSubmit={handleUserSubmit}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body1">First Name</Typography>
                            <TextField
                              id="firstName"
                              size="small"
                              fullWidth
                              required
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body1">Last Name</Typography>
                            <TextField
                              id="lastName"
                              size="small"
                              fullWidth
                              required
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1">Username</Typography>
                            <TextField
                              id="username"
                              size="small"
                              fullWidth
                              required
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1">Password</Typography>
                            <TextField
                              id="password"
                              type="password"
                              size="small"
                              fullWidth
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1">Email ID</Typography>
                            <TextField
                              id="emailId"
                              type="email"
                              size="small"
                              fullWidth
                              required
                              value={emailId}
                              onChange={(e) => setEmailId(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1">Role</Typography>
                            <TextField
                              id="role"
                              select
                              size="small"
                              fullWidth
                              required
                              value={role}
                              onChange={(e) => setRole(e.target.value)}
                            >
                              <MenuItem value="recruiter_sourcing">
                                Recruiter-Sourcing
                              </MenuItem>
                              <MenuItem value="recruiter_processing">
                                Recruiter-Processing
                              </MenuItem>
                              <MenuItem value="lead_sourcing">
                                Lead-Sourcing
                              </MenuItem>
                              <MenuItem value="lead_processing">
                                Lead-Processing
                              </MenuItem>
                              <MenuItem value="admin">Admin</MenuItem>
                              <MenuItem value="manager">Manager</MenuItem>
                              <MenuItem value="account_manager">
                                Account-Manager
                              </MenuItem>
                            </TextField>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1">
                              Phone Number
                            </Typography>
                            <TextField
                              id="phoneNumber"
                              size="small"
                              fullWidth
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1">
                              Customer Assignment
                            </Typography>
                            <Tooltip
                              title="Select one or more customers to assign to this user"
                              placement="top"
                            >
                              <Select
                                id="customerAssignment"
                                multiple
                                fullWidth
                                value={customerAssignment}
                                onChange={(e) =>
                                  setCustomerAssignment(e.target.value)
                                }
                                renderValue={(selected) =>
                                  selected.map((ca) => ca.name).join(", ")
                                }
                                sx={{
                                  backgroundColor: "#f0f0f0",
                                  "& .MuiSelect-select": {
                                    padding: "10px",
                                    minHeight: "40px",
                                  },
                                  "& .MuiSelect-icon": {
                                    top: "auto",
                                    color: "#666",
                                    right: 0,
                                    left: "auto",
                                  },
                                }}
                              >
                                {customerAssignments.map((customer) => (
                                  <MenuItem key={customer.id} value={customer}>
                                    {customer.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </Tooltip>
                          </Grid>
                          <Grid item xs={12}>
                            <Button
                              type="submit"
                              variant="contained"
                              color="success"
                            >
                              Create User
                            </Button>
                          </Grid>
                        </Grid>
                      </form>
                    </div>
                    {/* <div id="updateUser" className="user-form" style={{ display: 'none' }}>
       <h3>Update Existing User</h3>
       <form id="updateUserForm" onSubmit={handleUserSubmit}>
         
         <Button type="submit" variant="contained">Update User</Button>
       </form>
     </div> */}
                  </Paper>
                </TabPanel>
                <TabPanel value={userTabValue} index={1}>
                  <UserAssignments />
                </TabPanel>
              </Paper>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Paper sx={{ p: 4, backgroundColor: "" }}>
                <Typography variant="h5" gutterBottom>
                  Assignment Management
                </Typography>
                <Assignments />
              </Paper>
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Paper sx={{ p: 4, backgroundColor: "" }}>
                <GlobalSettings />
              </Paper>
            </TabPanel>
          </>
        )}
      </Box>
    </Container>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default SettingsTab;
