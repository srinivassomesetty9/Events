import React from "react";
import "./Login.css";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  let navigate = useNavigate();
  return (
    <div className="loginwrap">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Box sx={{ flexGrow: 1, height: "calc(100vh + 8px)" }}>
          <Grid container spacing={1} sx={{ height: "calc(100vh + 8px)" }}>
            {/* start Login form left side wrap, logo and wallpaper design */}
            <Grid
              item
              xs={12}
              md={8}
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-end"
              spacing={0}
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              <Grid item xs={12} md={12} sx={{ textAlign: "left" }}>
                <img
                  src="/login.gif"
                  style={{
                    maxWidth: "100%",
                    maxheight: "100vh",
                    borderRadius: "999px 999px 999px 0",
                  }}
                  className="bannerlogin"
                />
              </Grid>
            </Grid>
            {/* end left side wrap*/}
            {/* start Login form right side wrap */}

            <Grid
              item
              xs={12}
              md={4}
              className="loginformwrap"
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
              sx={{ pb: 5 }}
            >
              <Grid item xs={11} md={10}>
                {/* display: { xs: 'block', sm: 'none' }, */}
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <img src="/icon1.png" style={{ height: "64px" }} />
                  <p
                    style={{
                      fontSize: "21px",
                      fontWeight: "400",
                      color: "black",
                      marginBottom: "15px",
                    }}
                  >
                    Dhigna Events
                  </p>
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{ marginBottom: "15px", textAlign: "left" }}
                >
                  <h1 className="welcomheading">Welcome! </h1>
                  <p>Please sign-up to your account</p>
                </Grid>
                <Grid item xs={12} style={{ marginBottom: "15px" }}>
                  <TextField
                    fullWidth
                    id="outlined-FirstName-input"
                    label="First Name"
                    type="text"
                    color="primary"
                    autoComplete="current-FirstName"
                    // value={email}
                    // onChange={e => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} style={{ marginBottom: "15px" }}>
                  <TextField
                    fullWidth
                    id="outlined-LastName-input"
                    label="Last Name"
                    type="text"
                    color="primary"
                    autoComplete="current-LastName"
                    // value={email}
                    // onChange={e => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} style={{ marginBottom: "15px" }}>
                  <TextField
                    fullWidth
                    id="outlined-Email-input"
                    label="Email"
                    type="text"
                    color="primary"
                    autoComplete="current-Email"
                    // value={email}
                    // onChange={e => setEmail(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} style={{ marginBottom: "15px" }}>
                  <TextField
                    fullWidth
                    id="outlined-password-input"
                    label="Password"
                    // type={showPassword ? "text" : "password"}
                    color="primary"
                    InputProps={{
                      // <-- This is where the toggle button is added.
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            // onClick={handleClickShowPassword}
                            // onMouseDown={handleMouseDownPassword}
                          >
                            {/* {showPassword ? <Visibility /> : <VisibilityOff />} */}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    autoComplete="current-password"
                    // value={pass}
                    // onChange={e => setPass(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} style={{ marginBottom: "15px" }}>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                  >
                    <Grid item xs={12} md={6}>
                      {/* <FormControlLabel control={<Checkbox defaultChecked />} label="Remember Me" /> */}
                    </Grid>
                    <Grid item xs={12} md={9} style={{ textAlign: "right" }}>
                      <span>
                        {" "}
                        Already you have an account?{" "}
                        <a onClick={() => navigate("/login")}>Login</a>
                      </span>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} style={{ marginBottom: "10px" }}>
                  <Button
                    variant="contained"
                    // onClick={handleSubmit}
                    type="submit"
                    fullWidth
                  >
                    Sign Up
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    // onClick={handleSubmit}
                    onClick={() => navigate("/")}
                    type="submit"
                    fullWidth
                  >
                    Back to Home
                  </Button>
                </Grid>
                <Grid>
                  {/* {auth && auth.status && auth.status.status == 200 ? <SuccessAlert msg={auth.status ? auth.status.data.message : ''} /> : ''}
                        {auth && auth.status && auth.status.status == 400 ? <ErrorAlert msg={auth.status ? auth.status.data.message : ''} /> : ''} */}
                </Grid>
              </Grid>
            </Grid>
            {/* end Login form right side wrap */}
          </Grid>
        </Box>
      </form>
    </div>
  );
};

export default Registration;
