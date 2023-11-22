import React from "react";
import { Button, Container, Grid, Typography } from "@mui/material";
import EventCard from "./EventCard";
import { useNavigate } from "react-router-dom";

const UpcomingEvent = () => {
  // Sample event data (replace with your actual data)
  let navigate = useNavigate();
  const events = [
    {
      link: "/eventdetail",
      tag: "Upcoming",
      imageSrc: "/featured3.jpg",
      date: "12-Jan-2024",
      time: "11:30 PM - 03:30 AM (IST)",
      location: "Wembley",
      title: "Pathaans Of Bollywood",
      subtitle1: "Live Music",
      subtitle2: "@OVO Arena Wembley - London",
      price1: "VIP: 120.00 GBP",
      price2: "Red: 90.00 GBP",
      category: "",
    },
    {
      link: "/eventdetail",
      tag: "Upcoming",
      imageSrc: "/featured1.jpg",
      date: "13-Jan-2024",
      time: "11:30 PM - 03:30 AM (IST)",
      location: "Wembley",
      title: "Oo Antava - Telugu",
      subtitle1: "Live Music",
      subtitle2: "@OVO Arena Wembley - London",
      price1: "VIP : 150.00 GBP",
      price2: "Standing : 75.00 GBP",
      category: "",
    },
    {
      link: "/eventdetail",
      tag: "Upcoming",
      imageSrc: "/featured2.jpg",
      date: "14-Jan-2024",
      time: "11:30 PM - 03:30 AM (IST)",
      location: "Wembley",
      title: "Oo Solriya - Tamil",
      subtitle1: "Live Music",
      subtitle2: "@OVO Arena Wembley - London",
      price1: "VIP : 120.00 GBP",
      price2: "Standing : 75.00 GBP",
      category: "",
    },

    // Add more events as needed
  ];

  return (
    <div>
      <Container>
        <div className="lgx-heading">
          <Typography variant="h2" className="heading">
            <i className="fas fa-star"></i> Upcoming Events
          </Typography>
        </div>
        <Grid container spacing={3}>
          {events.map((event, index) => (
            <Grid key={index} item xs={12} sm={6} lg={4}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>
        <div className="section-btn-area">
          <Button
            onClick={() => navigate("/events")}
            variant="contained"
            color="secondary"
          >
            <i className="fas fa-calendar-day"></i> View All Events
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default UpcomingEvent;
