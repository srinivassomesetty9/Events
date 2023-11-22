import React from "react";
import { Container, Breadcrumbs, Link, Typography } from "@mui/material";

const BreadCrumb = () => {
  return (
    <section style={{ marginBottom: "80px" }}>
      <div id="lgx-schedule" className="lgx-schedule lgx-schedule-dark">
        <div
          className="lgx-inner-breadcrumb"
          style={{
            backgroundImage: `url('https://events.dhigna.com/frontend-assets?path=img%2Fbg-pattern.png')`,
          }}
        >
          <Container>
            <div className="row">
              <div className="col-xs-12">
                <div className="breadcrumb-area">
                  <div className="breadcrumb-heading-area">
                    <h2 className="breadcrumb-heading">Events</h2>
                  </div>
                  <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" href="/">
                      <i className="fas fa-home"></i>
                    </Link>
                    <Typography color="textPrimary">Events</Typography>
                  </Breadcrumbs>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
};

export default BreadCrumb;
