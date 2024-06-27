import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Registration = () => {
  // const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [show, setShow] = useState(false);

  // const [userNameError, setUserNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  let navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const data = (e) => {
    e.preventDefault();

    let data = {
      username: email,
      email: email,
      password: password,
    };

    // if (username === "") {
    //   setUserNameError("Please Enter User Name");
    // }
    if (email === "") {
      setEmailError("Please Enter Email");
    }
    if (password === "") {
      setPasswordError("Please Enter Password");
    }

    if ( email && password) {
      axios
        .post(`https://api.jinnhire.in/jinnhire/data/users/`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (
            res.data.result !== "No Details Entered" &&
            res.data.result !== "Email already exists"
          ) {
            setShow(true);
            setTimeout(() => {
              navigate("/");
            }, 6000);
            localStorage.setItem("user", JSON.stringify(res));
          } else {
            setMessage(res.data.result);
            setTimeout(() => {
              setMessage("");
            }, 6000);
          }
        })
        .catch((err) => {
          if (err?.code === "ERR_NETWORK") {
            setMessage(err?.message);
          } else {
            setMessage(err?.response?.data?.detail);
            setTimeout(() => {
              setMessage("");
            }, 6000);
          }
        });
    }
  };

  return (
    <div className="loginwrap">
      <Snackbar
        open={show}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        autoHideDuration={6000}
        message="Success"
        onClose={() => setShow(false)}
      >
        <Alert
          onClose={() => setShow(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Registered Successfully
        </Alert>
      </Snackbar>
      <form onSubmit={(e) => e.preventDefault()}>
        <Box sx={{ flexGrow: 1, height: "calc(100vh + 8px)" }}>
          <Grid container spacing={1} sx={{ height: "calc(100vh + 8px)" }}>
            <Grid
              item
              xs={12}
              md={8}
              container
              justifyContent="flex-start"
              alignItems="flex-end"
              sx={{
                display: { xs: "none", sm: "flex" },
                backgroundColor: "#f2f5fb",
              }}
            >
              <Grid item xs={12} md={12} sx={{ textAlign: "left" }}>
                <img
                  src="/login.gif"
                  style={{
                    maxWidth: "100%",
                    maxheight: "100vh",
                    borderRadius: "999px 999px 999px 0",
                    marginBottom: "120px",
                  }}
                  className="bannerlogin"
                  alt="gif"
                />
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              md={4}
              container
              justifyContent="center"
              alignItems="center"
              spacing={2}
              sx={{ pb: 5, backgroundColor: "#ffffff"}}
            >
              <Grid item xs={11} md={10}>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <img
                    src="/jinne_head.png"
                    alt="icon"
                    style={{ height: "80px" }}
                  />
                  <p
                    style={{
                      fontSize: "28px",
                      fontWeight: "400",
                      color: "black",
                      marginBottom: "15px",
                    }}
                  >
                    Jinn Hire
                  </p>
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{ marginBottom: "15px", textAlign: "left" }}
                >
                  <h1 className="welcomheading">Welcome!</h1>
                  <p>Please sign-up to your account</p>
                </Grid>
                {/* <Grid item xs={12} style={{ marginBottom: "15px" }}>
                  <TextField
                    fullWidth
                    id="outlined-UserName-input"
                    label="User Name"
                    type="text"
                    color="primary"
                    value={username}
                    onChange={(e) => {
                      setUserName(e.target.value);
                      setUserNameError("");
                      setMessage(false);
                    }}
                  />
                  <div className="text-danger">{userNameError}</div>
                </Grid> */}
                <Grid item xs={12} style={{ marginBottom: "15px" }}>
                  <TextField
                    fullWidth
                    id="outlined-Email-input"
                    label="Email"
                    type="email"
                    color="primary"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                      setMessage(false);
                    }}
                  />
                  <div className="text-danger">{emailError}</div>
                </Grid>
                <Grid item xs={12} style={{ marginBottom: "15px" }}>
                  <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    color="primary"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                      setMessage(false);
                    }}
                  />
                  <div className="text-danger">{passwordError}</div>
                </Grid>
                {message && (
                  <Alert
                    severity="error"
                    onClose={() => setMessage("")}
                    dismissible
                    style={{ marginTop: "10px" }}
                  >
                    {message}
                  </Alert>
                )}
                <Grid item xs={12} style={{ marginBottom: "15px" }}>
                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                  >
                    <Grid item xs={12} md={9} style={{ textAlign: "right" }}>
                      <p>
                        Already you have an account?
                        <Button
                          variant="text"
                          style={{
                            color: "#002355",
                            fontSize: "12px",
                            textTransform: "capitalize",
                          }}
                          onClick={() => navigate("/")}
                        >
                          Login
                        </Button>
                      </p>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} style={{ marginBottom: "10px" }}>
                  <Button
                    variant="contained"
                    onClick={data}
                    type="submit"
                    fullWidth
                    sx={{
                      backgroundColor: "rgb(31 91 139)",
                      borderRadius: "10px",
                    }}
                  >
                    Sign Up
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </form>
    </div>
  );
};

export default Registration;
