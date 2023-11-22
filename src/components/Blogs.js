import React from "react";
import { Container, Grid, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Blogs = () => {
  let navigate = useNavigate();
  return (
    <section>
      <div className="lgx-inner">
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div className="lgx-heading">
                <Typography variant="h2" className="heading">
                  <i className="fas fa-blog"></i> Blogs
                </Typography>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <div className="lgx-single-news">
                <figure>
                  <a href="/">
                    <img src="/Blogs1.jpg " alt="" />
                  </a>
                </figure>
                <div className="single-news-info">
                  <div className="meta-wrapper hidden">
                    <span>09-Oct-2022 10:11 AM</span>
                  </div>
                  <Typography variant="h4" className="title">
                    <a href="/">8 music festivals</a>
                  </Typography>
                  <div className="meta-wrapper">
                    <span>8 international music festivals</span>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div className="lgx-single-news">
                <figure>
                  <a href="/">
                    <img src="/Blogs2.jpg " alt="" />
                  </a>
                </figure>
                <div className="single-news-info">
                  <div className="meta-wrapper hidden">
                    <span>09-Oct-2022 10:08 AM</span>
                  </div>
                  <Typography variant="h4" className="title">
                    <a href="/">Music and lyrics</a>
                  </Typography>
                  <div className="meta-wrapper">
                    <span>Music and lyrics</span>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div className="lgx-single-news">
                <figure>
                  <a href="/">
                    <img src="/Blogs3.jpg " alt="" />
                  </a>
                </figure>
                <div className="single-news-info">
                  <div className="meta-wrapper hidden">
                    <span>09-Oct-2022 10:07 AM</span>
                  </div>
                  <Typography variant="h4" className="title">
                    <a href="/">Belfast—city of music</a>
                  </Typography>
                  <div className="meta-wrapper">
                    <span>Belfast—city of music</span>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
          <div className="section-btn-area">
            <Button
              onClick={() => navigate("/")}
              variant="contained"
              className="lgx-btn"
            >
              <i className="fas fa-blog"></i> View All Blogs
            </Button>
          </div>
        </Container>
      </div>
    </section>
  );
};

export default Blogs;
