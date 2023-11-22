import React from "react";

import {
  Card,
  CardActionArea,
  CardContent,
  Container,
  Typography,
} from "@mui/material";

const EventCategories = () => {
  const categories = [
    {
      name: "Upcoming Events",
      image: "/Eventc1.png",
      link: "/",
    },
    {
      name: "Entertainment",
      image: "/Eventc2.jpg",
      link: "/",
    },
    {
      name: "Music",
      image: "/Eventc3.jpg",
      link: "/",
    },
    {
      name: "Dances",
      image: "/Eventc4.jpg",
      link: "/",
    },
  ];

  return (
    <section>
      <div id="lgx-schedule" className="lgx-schedule lgx-schedule-dark">
        <div
          className="lgx-inner"
          style={{
            backgroundImage:
              'url("https://events.dhigna.com/frontend-assets?path=img%2Fbg-pattern.png")',
          }}
        >
          <Container>
            <div className="row">
              <div className="col-12">
                <div className="lgx-heading lgx-heading-white">
                  <h2 className="heading">Event Categories</h2>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="sponsors-area sponsors-area-border sponsors-area-col3">
                  {categories.map((category, index) => (
                    <Card key={index} className="single">
                      <CardActionArea component="a" href={category.link}>
                        <img src={category.image} alt={category.name} />
                        <CardContent>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="span"
                          >
                            {category.name}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
};

export default EventCategories;
