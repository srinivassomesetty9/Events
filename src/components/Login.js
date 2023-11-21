import React from 'react';
import "./Login.css"
import { Button, Checkbox, Container, FormControlLabel, Grid, TextField } from '@mui/material';

const Login = () => (
  <section>
    {/* <div id="lgx-schedule" className="lgx-schedule lgx-schedule-dark">
      <div
        className="lgx-inner"
        style={{
          backgroundImage: 'url(https://events.dhigna.com/frontend-assets?path=img%2Fbg-pattern.png)',
        }}
      > */}
        <div className="login-wrapper">
          <Container>
            <Grid container>
              <Grid item xs={12} sm={8} lg={6} className="offset-sm-2 offset-lg-3">
                <div className="lgx-registration-form-box lgx-registration-banner-box">
                  <h2 className="title">Login</h2>
                  <div className="lgx-registration-form">
                    <form method="POST" action="/login">
                      <input type="hidden" name="_token" value="jDrYGaAkEDXe6mzbeGGwlfOI4PWrQKOmxm7LljlO" />
                      <TextField
                        id="email"
                        type="email"
                        label="Email"
                        variant="outlined"
                        fullWidth
                        required
                        autoFocus
                      />
                      <TextField
                        id="password"
                        type="password"
                        label="Pin"
                        variant="outlined"
                        fullWidth
                        required
                      />
                      <FormControlLabel
                        control={<Checkbox defaultChecked id="remember" />}
                        label="Remember me"
                      />
                      <Button type="submit" variant="contained" color="default" fullWidth>
                        <i className="fas fa-sign-in-alt"></i> Login
                      </Button>
                      <Grid container>
                        <Grid item xs={12}>
                          <div className="lgx-links">
                            <Button className="btn-link pull-left" href="/reset">
                              Forgot Pin?
                            </Button>
                            <Button className="btn-link pull-right" href="/register">
                              Register
                            </Button>
                          </div>
                        </Grid>
                      </Grid>
                      <hr style={{ borderTop: '2px solid #eee' }} />
                    </form>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Container>
        </div>
      {/* </div>
    </div> */}
  </section>
);

export default Login;
