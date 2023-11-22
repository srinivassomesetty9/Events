import React from "react";
import { Container, Grid, Typography } from "@mui/material";
import { CalendarToday, LocalOffer, DirectionsWalk } from "@mui/icons-material";

const Customer = () => {
  return (
    <section>
      <div id="lgx-travelinfo" className="lgx-travelinfo">
        <div className="lgx-inner">
          <Container>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <div className="lgx-heading">
                  <Typography variant="h3" className="subheading">
                    How it works
                  </Typography>
                  <Typography variant="h2" className="heading">
                    For Customers
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="lgx-travelinfo-content">
                  <div className="lgx-travelinfo-single">
                    <CalendarToday fontSize="large" />
                    <Typography variant="h3" className="title">
                      1. Choose Event
                    </Typography>
                    <Typography variant="body1" className="info">
                      Signup, choose your favorite event.
                    </Typography>
                  </div>
                  <div className="lgx-travelinfo-single">
                    <LocalOffer fontSize="large" />
                    <Typography variant="h3" className="title">
                      2. Get Tickets
                    </Typography>
                    <Typography variant="body1" className="info">
                      Get your tickets from the event page.
                    </Typography>
                  </div>
                  <div className="lgx-travelinfo-single">
                    <DirectionsWalk fontSize="large" />
                    <Typography variant="h3" className="title">
                      3. Attend Event
                    </Typography>
                    <Typography variant="body1" className="info">
                      Go attend the event and have fun.
                    </Typography>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Container>
        </div>
      </div>
    </section>
  );
};

export default Customer;
