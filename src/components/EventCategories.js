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
      link: "/events",
    },
    {
      name: "Entertainment",
      image: "/Eventc2.jpg",
      link: "/events",
    },
    {
      name: "Music",
      image: "/Eventc3.jpg",
      link: "/events",
    },
    {
      name: "Dances",
      image: "/Eventc4.jpg",
      link: "/events",
    },
  ];

  return (
    <section>
      <div id="lgx-schedule" className="lgx-schedule ">
        <div
          className="lgx-inner"
          // style={{
          //   backgroundImage:
          //     'url("https://events.dhigna.com/frontend-assets?path=img%2Fbg-pattern.png")',
          // }}
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
                      <CardActionArea
                        component="a"
                        href={category.link}
                        style={{
                          padding: "0",
                          height: "179.09px",
                          width: "268.64px",
                        }}
                      >
                        <img
                          src={category.image}
                          alt={category.name}
                          style={{
                            padding: "0",
                            height: "179.09px",
                            width: "268.64px",
                          }}
                        />
                        <div class="badges">
                          <h2 class="badge badge-new">{category.name}</h2>
                        </div>
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
