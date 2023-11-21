// Import necessary dependencies
import React from "react";
import { Link } from "react-router-dom";
import { Container, Grid, Typography, Button } from "@mui/material";

// Define your SeatingChart component
const SeatingChart = () => {
  return (
    <div>
      <section
        id="buy-tickets"
        style={{ marginTop: "30px", "background-color": "#1b89ef" }}
      >
        <Container style={{ marginTop: "0px" }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h4" className="heading">
                Seating Chart
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h5"
                className=" heading subheading text-white"
              >
                Pathaans Of Bollywood
              </Typography>
              <Typography
                variant="h5"
                className=" heading subheading text-white"
              >
                Get your tickets now
              </Typography>
              <Typography variant="h5" className=" heading subheading">
                Click on a date to book tickets
              </Typography>
            </Grid>
            <Grid item md={6} xs={12} className="text-center">
              <Link to="/events/checkout/pathaans-of-bollywood">
                <img src="/seat.png" alt="Pathaans Of Bollywood" />
              </Link>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              {/* Your schedule content goes here */}
              {/* You can use Material-UI components to structure your schedule */}
              {/* <div>
              <Typography variant="h5" className="title">
                12-Jan-2024 - 13-Jan-2024
              </Typography>
              <Typography variant="h6" className="time">
                11:30 PM - 03:30 AM (IST)
              </Typography> */}
              {/* Add more schedule details as needed */}
              {/* </div> */}
              <div className="tab-content lgx-tab-content">
                <div className="tab-pane active">
                  <div
                    role="tablist"
                    aria-multiselectable="true"
                    className="panel-group"
                  >
                    <div className="panel panel-default lgx-panel">
                      <div role="tab" className="panel-heading">
                        <div className="panel-title">
                          <a
                          href="/checkout"
                            role="button"
                            data-toggle="collapse"
                            aria-expanded="true"
                            aria-controls="collapseOne"
                          >
                            <div className="lgx-single-schedule">
                              <div className="schedule-info">
                                <h3 className="title">
                                  12-Jan-2024 - 13-Jan-2024
                                </h3>
                                <h4 className="time">
                                  11:30 PM - 03:30 AM (IST)
                                </h4>
                                {/* Add any additional elements or content here */}
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </Container>
      </section>
      <Container>
        {/* About Section */}
        <section id="lgx-about" className="lgx-about">
          <div className="mt-30 mb-50 mt-mobile-0">
            <Grid container>
              {/* Date and Countdown */}
              <Grid item md={4} xs={12} className="visible-lg visible-md">
                <div className="lgx-banner-info-area">
                  <div className="lgx-banner-info-circle lgx-info-circle">
                    <div
                      className="info-circle-inner"
                      style={{
                        backgroundImage:
                          'url("https://events.dhigna.com/frontend-assets?path=img%2Fbg-wave-circle.png")',
                      }}
                    >
                      <Typography variant="h1" className="date">
                        12
                        <span>Jan-2024(IST)</span>
                      </Typography>
                      <div className="lgx-countdown-area">
                        {/* Add Countdown component */}
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>

              {/* Event Details */}
              <Grid item md={6} xs={12}>
                <div className="lgx-about-content-area">
                  <Typography variant="h4" className="heading">
                    Pathaans Of Bollywood
                  </Typography>
                  <Typography variant="h6" className="subheading">
                    <Link
                      to="events/pathaans-of-bollywood/Dhigna%20Dsp"
                      className="text-primary"
                    >
                      By Dhigna
                    </Link>
                    <span className="lgx-badge lgx-badge-primary"></span>
                  </Typography>
                  <Typography variant="h6" className="subheading share-btns">
                    <span>
                      <strong>Share Event &nbsp;</strong>
                    </span>
                    {/* Add share buttons */}
                    <Button
                      component={Link}
                      to="https://www.facebook.com/sharer/sharer.php?u=https://events.dhigna.com/events/pathaans-of-bollywood"
                      className="btn btn-sm"
                    >
                      <i className="fab fa-facebook-square"></i>
                    </Button>
                    {/* Add other share buttons */}
                    {/* ... */}
                  </Typography>
                  <Button
                    component={Link}
                    to="/checkout"
                    variant="contained"
                    className="lgx-btn lgx-btn-red mt-2"
                  >
                    <i className="fas fa-ticket-alt"></i> Get your tickets now
                  </Button>
                  <Typography
                    variant="body1"
                    className="lgx-about-content"
                    paragraph
                  >
                    {/* Add event description */}
                    "Get ready for an unforgettable evening that will transport
                    you to the heart of Bollywood's musical legacy! On January
                    12, 2024, starting at 6:00 PM, we are thrilled to invite you
                    to experience the 'Pathaans of Bollywood' - a grand
                    celebration marking '25 Years of Vishal-Shekhar' at the
                    iconic OVO Arena, Wembley, London. This is not just a
                    concert; it's a tribute to two maestros who have defined the
                    Bollywood music scene for a quarter of a century. Vishal
                    Dadlani and Shekhar Ravjiani, the magical duo behind
                    countless chart-toppers and soulful melodies, are all set to
                    mesmerize you with their musical journey. From the
                    foot-tapping beats of 'Bachna Ae Haseeno' to the soulful
                    tunes of 'Baby Ko Base Pasand Hai,' their music has touched
                    our hearts and left an indelible mark on Indian cinema. The
                    evening promises an electrifying atmosphere as the stage
                    lights up with their iconic hits, backed by a spectacular
                    ensemble of musicians. It's a once-in-a-lifetime opportunity
                    to experience the magic of Bollywood music live, in the
                    heart of London. Gather your friends and family, book your
                    tickets early, and be prepared for a night filled with
                    nostalgia, emotions, and sheer musical brilliance. Let's
                    come together to celebrate not just the music but the
                    indomitable spirit of Vishal-Shekhar, whose tunes have been
                    the soundtrack of our lives. This is more than a concert;
                    it's a musical journey you wouldn't want to miss.
                  </Typography>
                </div>
              </Grid>

              {/* Location and Time */}
              <Grid container>
                {/* Where Section */}
                <Grid item xs={12} sm={5} md={5} offset-md={1}>
                  <div className="lgx-about-service">
                    <div className="lgx-single-service lgx-single-service-color">
                      <div className="text-area">
                        <span className="icon col-white">
                          <i
                            aria-hidden="true"
                            className="fas fa-map-marked-alt"
                          ></i>
                        </span>
                        <Typography variant="h5" className="title col-white">
                          Where
                        </Typography>
                        <Typography variant="body2">
                          <strong>OVO Arena Wembley - London</strong>
                          <br />
                          Arena Square, Engineers Way, Wembley Park HA9 0AA
                          <br />
                          Wembley, London, United Kingdom
                        </Typography>
                      </div>
                    </div>
                  </div>
                </Grid>

                {/* When Section */}
                <Grid item xs={12} sm={5} md={5}>
                  <div className="lgx-about-service">
                    <div className="lgx-single-service lgx-single-service-color">
                      <div className="text-area">
                        <span className="icon col-white">
                          <i
                            aria-hidden="true"
                            className="fas fa-stopwatch"
                          ></i>
                        </span>
                        <Typography variant="h5" className="title col-white">
                          When
                        </Typography>
                        <Typography variant="body2">
                          12-Jan-2024 11:30 PM (IST)
                          <br />
                          Till
                          <br />
                          13-Jan-2024 03:30 AM (IST)
                        </Typography>
                      </div>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </section>
      </Container>
    </div>
  );
};

export default SeatingChart;
