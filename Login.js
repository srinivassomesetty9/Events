import React, { useState } from "react";
import {
  Alert,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  IconButton,
  Snackbar,
  InputAdornment,
} from "@mui/material";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [show, setShow] = useState(false);

  let navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const handleLogin = () => {
    let data = { email: email, password: password };

    if (email === "") {
      setEmailError("Please Enter Email");
    }
    if (password === "") {
      setPasswordError("Please Enter Password");
    }

    if (email && password) {
      axios
        .post(`https://api.jinnhire.in/jinnhire/data/users/login/`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data.message === "Login Successful") {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("username", email);
            localStorage.setItem("user", JSON.stringify(res.data.user));
              navigate("/home"); 
          
          } else {
            setMessage(res.data.message);
            setTimeout(() => setMessage(""), 5000);
          }
        })
        .catch((err) => {
          setMessage(err?.response?.data?.message || err.message);
          setTimeout(() => setMessage(""), 5000);
        });
    }
  };

  return (
    <div className="loginwrap">
      <Snackbar
        open={show}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        autoHideDuration={6000}
        message="Login Successful"
        onClose={() => setShow(false)}
      >
        <Alert
          onClose={() => setShow(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Login Successful
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
              sx={{ pb: 5, backgroundColor: "#ffffff" }}
            >
              <Grid item xs={11} md={10}>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <img
                    src="/jinne_head.png"
                    style={{ height: "80px" }}
                    alt="icon"
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
                  <p>Login to continue</p>
                </Grid>
                <Grid item xs={12} style={{ marginBottom: "15px" }}>
                  <TextField
                    fullWidth
                    id="outlined-Email-input"
                    label="Email"
                    type="text"
                    color="primary"
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                      setMessage(false);
                    }}
                    required
                  />
                  <div className="text-danger">{emailError}</div>
                </Grid>
                <Grid item xs={12}>
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
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                      setMessage(false);
                    }}
                    required
                  />
                  <div className="text-danger">{passwordError}</div>
                </Grid>
                {message && (
                  <Alert
                    severity="error"
                    onClose={() => setMessage("")}
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
                    <Grid item xs={12} md={6}></Grid>
                    <Grid item xs={12} md={6} style={{ textAlign: "right" }}>
                      <Button
                        variant="text"
                        style={{
                          color: "#002355",
                          fontSize: "12px",
                          textTransform: "capitalize",
                        }}
                      >
                        Forgot Password?
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} style={{ marginBottom: "10px" }}>
                  <Button
                    variant="contained"
                    onClick={handleLogin}
                    type="submit"
                    fullWidth
                    sx={{
                      backgroundColor: "rgb(31 91 139)",
                      borderRadius: "10px",
                    }}
                  >
                    Login
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{ marginBottom: "15px", textAlign: "left" }}
                >
                  <p>
                    Didn't have an account?
                    <Button
                      variant="text"
                      style={{
                        color: "#002355",
                        fontSize: "12px",
                        textTransform: "capitalize",
                      }}
                      onClick={() => navigate("/signup")}
                    >
                      Signup
                    </Button>
                  </p>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </form>
    </div>
  );
}

export default Login;
