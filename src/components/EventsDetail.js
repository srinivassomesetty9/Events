import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import { Link } from "react-router-dom";
import TopBar from "./TopBar";
import Footer from "./Footer";
import {
  DateRange,
  FacebookOutlined,
  Instagram,
  MapSharp,
  MapsHomeWorkSharp,
  Watch,
  WhatsApp,
  WhatshotOutlined,
} from "@mui/icons-material";

const EventsDetail = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
      <TopBar />
      <div
        style={{
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
          marginTop: "30px",
        }}
      >
        {/* TopBar component here if needed */}
        <Container>
          {/* About Section */}
          <section style={{ padding: "50px 0" }}>
            <Grid container spacing={3}>
              {/* Event Image */}
              <Grid item md={6} xs={12}>
                <Paper elevation={3}>
                  <img
                    src="./featured3.jpg"
                    alt="Event"
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                </Paper>
              </Grid>

              {/* Event Details */}
              <Grid item md={6} xs={12}>
                <div style={{ padding: "0 40px" }}>
                  <Typography variant="h4" style={{ marginBottom: "20px" }}>
                    Pathaans Of Bollywood
                  </Typography>
                  <Typography variant="h6">
                    <Link
                      to="events/pathaans-of-bollywood/Dhigna%20Dsp"
                      style={{ textDecoration: "none", color: "#1976D2" }}
                    >
                      By Dhigna
                    </Link>
                  </Typography>
                  <Typography variant="h6" style={{ marginTop: "10px" }}>
                    <strong>Share Event&nbsp;</strong>
                    <Button
                      component={Link}
                      to="https://www.facebook.com/sharer/sharer.php?u=https://events.dhigna.com/events/pathaans-of-bollywood"
                      variant="outlined"
                      style={{ marginRight: "10px" }}
                    >
                      <FacebookOutlined />
                    </Button>
                    <Button
                      component={Link}
                      to="https://www.facebook.com/sharer/sharer.php?u=https://events.dhigna.com/events/pathaans-of-bollywood"
                      variant="outlined"
                      style={{ marginRight: "10px" }}
                    >
                      <WhatsApp />
                    </Button>
                    <Button
                      component={Link}
                      to="https://www.facebook.com/sharer/sharer.php?u=https://events.dhigna.com/events/pathaans-of-bollywood"
                      variant="outlined"
                      style={{ marginRight: "10px" }}
                    >
                      <Instagram />
                    </Button>
                    {/* Add other share buttons */}
                    {/* ... */}
                  </Typography>
                  <Button
                    component={Link}
                    to="/checkout"
                    variant="contained"
                    color="primary"
                    style={{ marginTop: "20px" }}
                  >
                    <i className="fas fa-ticket-alt"></i> Get your tickets now
                  </Button>
                </div>
                <Grid item xs={12} md={12}>
                  {/* Tabs and Content Section */}
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                  >
                    <Tab label="Event Date" />
                    <Tab label="Event Details" />
                    <Tab label="Location and Time" />
                  </Tabs>
                  <Paper elevation={3} style={{ padding: "20px" }}>
                    {value === 0 && (
                      <div>
                        {/* Date and Countdown Section */}
                        <div className="text-area">
                          <Typography variant="body2">
                            <span className="icon col-white">
                              <DateRange />
                            </span>
                            12-Jan-2024
                            <br />
                            Till
                            <br />
                            13-Jan-2024
                          </Typography>
                        </div>
                        {/* Add your Date and Countdown content here */}
                      </div>
                    )}
                    {value === 1 && (
                      <div>
                        {/* Event Details Section */}
                        <Typography variant="h4" className="heading">
                          Event Details
                        </Typography>
                        <Grid item md={8} xs={12}>
                          <div className="lgx-about-content-area">
                            <Typography
                              variant="body1"
                              className="lgx-about-content"
                              paragraph
                            >
                              {/* Add event description */}
                              "Get ready for an unforgettable evening that will
                              transport you to the heart of Bollywood's musical
                              legacy! On January 12, 2024, starting at 6:00 PM,
                              we are thrilled to invite you to experience the
                              'Pathaans of Bollywood' - a grand celebration
                              marking '25 Years of Vishal-Shekhar' at the iconic
                              OVO Arena, Wembley, London. This is not just a
                              concert; it's a tribute to two maestros who have
                              defined the Bollywood music scene for a quarter of
                              a century. Vishal Dadlani and Shekhar Ravjiani,
                              the magical duo behind countless chart-toppers and
                              soulful melodies, are all set to mesmerize you
                              with their musical journey. From the foot-tapping
                              beats of 'Bachna Ae Haseeno' to the soulful tunes
                              of 'Baby Ko Base Pasand Hai,' their music has
                              touched our hearts and left an indelible mark on
                              Indian cinema. The evening promises an
                              electrifying atmosphere as the stage lights up
                              with their iconic hits, backed by a spectacular
                              ensemble of musicians. It's a once-in-a-lifetime
                              opportunity to experience the magic of Bollywood
                              music live, in the heart of London. Gather your
                              friends and family, book your tickets early, and
                              be prepared for a night filled with nostalgia,
                              emotions, and sheer musical brilliance. Let's come
                              together to celebrate not just the music but the
                              indomitable spirit of Vishal-Shekhar, whose tunes
                              have been the soundtrack of our lives. This is
                              more than a concert; it's a musical journey you
                              wouldn't want to miss.
                            </Typography>
                          </div>
                        </Grid>
                        {/* Add your Event Details content here */}
                      </div>
                    )}
                    {value === 2 && (
                      <div>
                        {/* Location and Time Section */}
                        {/* Add your Location and Time content here */}
                        <Grid container>
                          {/* Where Section */}
                          <Grid item xs={12} sm={5} md={5} offset-md={1}>
                            <div className="text-area">
                              <span className="icon col-white">
                                <MapSharp />
                              </span>
                              <Typography variant="body2">
                                <strong>OVO Arena Wembley - London</strong>
                                <br />
                                Arena Square, Engineers Way, Wembley Park HA9
                                0AA
                                <br />
                                Wembley, London, United Kingdom
                              </Typography>
                            </div>
                          </Grid>

                          {/* When Section */}
                          <Grid item xs={12} sm={5} md={5} offset-md={1}>
                            <div className="text-area">
                              <Typography variant="body2">
                                <span className="icon col-black">
                                  <Watch />
                                </span>
                                11:30 PM (IST)
                                <br />
                                Till
                                <br />
                                03:30 AM (IST)
                              </Typography>
                            </div>
                          </Grid>
                        </Grid>
                      </div>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            {/* Location and Time */}
            {/* <Grid container style={{ marginTop: "30px" }}> */}
            {/* Where Section */}
            {/* <Grid item xs={12} sm={6}>
                <Paper elevation={3} style={{ padding: "20px" }}>
                  <Typography variant="h5" style={{ marginBottom: "10px" }}>
                    Where
                  </Typography>
                  <Typography variant="body1">
                    <strong>OVO Arena Wembley - London</strong>
                    <br />
                    Arena Square, Engineers Way, Wembley Park HA9 0AA
                    <br />
                    Wembley, London, United Kingdom
                  </Typography>
                </Paper>
              </Grid> */}

            {/* When Section */}
            {/* <Grid item xs={12} sm={6}>
                <Paper elevation={3} style={{ padding: "20px" }}>
                  <Typography variant="h5" style={{ marginBottom: "10px" }}>
                    When
                  </Typography>
                  <Typography variant="body1">
                    12-Jan-2024 11:30 PM (IST)
                    <br />
                    Till
                    <br />
                    13-Jan-2024 03:30 AM (IST)
                  </Typography>
                </Paper>
              </Grid>
            </Grid> */}

            {/* Add additional sections as needed */}
          </section>
        </Container>
        {/* Footer component here if needed */}
      </div>
      <Footer />
    </div>
  );
};

export default EventsDetail;
