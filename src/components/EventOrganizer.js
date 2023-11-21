import React from 'react';
import { Container, Grid, Typography } from '@mui/material';
import "./EventOrganizer.css";

const EventOrganizer = () => {
  return (
    <section id="lgx-schedule" className="lgx-schedule lgx-schedule-dark">
      <div
        className="lgx-inner"
        style={{ backgroundImage: 'url("https://events.dhigna.com/frontend-assets?path=img%2Fbg-pattern.png")' }}
      >
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div className="lgx-heading lgx-heading-white">
                <Typography variant="h3" className="subheading">
                  How it works
                </Typography>
                <Typography variant="h2" className="heading">
                  <i className="fas fa-person-booth"></i> For Event Organisers
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className="lgx-travelinfo-content lgx-content-white">
                <div className="lgx-travelinfo-single">
                  <i className="fas fa-calendar-plus fa-4x"></i>
                  <Typography variant="h3" className="title">
                    1. Create Event
                  </Typography>
                  <Typography variant="body1" className="info">
                    Signup, become an organizer and start adding events.
                  </Typography>
                </div>
                <div className="lgx-travelinfo-single">
                  <i className="fas fa-calendar-check fa-4x"></i>
                  <Typography variant="h3" className="title">
                    2. Publish Event
                  </Typography>
                  <Typography variant="body1" className="info">
                    Enter complete info about your event and publish it.
                  </Typography>
                </div>
                <div className="lgx-travelinfo-single">
                  <i className="fas fa-money-check-alt fa-4x"></i>
                  <Typography variant="h3" className="title">
                    3. Start Selling
                  </Typography>
                  <Typography variant="body1" className="info">
                    Start selling your event tickets and earn a profit.
                  </Typography>
                </div>
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>
    </section>
  );
};

export default EventOrganizer;
