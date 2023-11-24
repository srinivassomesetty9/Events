import React from "react";
import { Container, Grid, Typography, Button, Paper, List, ListItem, ListItemText } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const SeatingChart = () => {
  let navigate = useNavigate();

  return (
    <section id="buy-tickets" style={{ marginTop: "70px" }}>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" className="heading">
              Seating Chart
            </Typography>
          </Grid>
          <Grid item xs={12} >
            <Typography variant="h5" className="heading subheading">
              Pathaans Of Bollywood
            </Typography>
            <Typography variant="h5" className="heading subheading">
              Get your tickets now
            </Typography>
          </Grid>
          <Grid item md={6} xs={12} className="text-center">
            <img src="/seat.png" alt="Pathaans Of Bollywood" style={{ width: "100%" }} />
          </Grid>
          <Grid item md={6} sm={6} xs={12} mt={4}>
            <Paper elevation={3} style={{ padding: "20px" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h5" className="subheading">
                    Checkout
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" className="subheading">
                    Booking Info
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText primary="Event Category" secondary="Pathaans Of Bollywood" />
                      <ListItemText primary="Venue" secondary="OVO Arena Wembley - London" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Start - End Date" secondary="12-Jan-2024 - 13-Jan-2024" />
                      <ListItemText primary="Timings" secondary="11:30 PM - 03:30 AM (IST)" />
                    </ListItem>
                  </List>
                </Grid>
                {/* Add more details as needed */}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </section>
  );
};

export default SeatingChart;
