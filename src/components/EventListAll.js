import React, { useState } from "react";
import { Container, Grid } from "@mui/material";
import EventCard from "./EventCard";

const EventListAll = () => {
  // Sample event data (replace with your actual data)
  const [searchTerm, setSearchTerm] = useState("");
  const events = [
    {
      link: "/eventsdetail",
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
      link: "/eventsdetail",
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
    {
      link: "/eventsdetail",
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
      link: "/eventsdetail",
      tag: "Upcoming",
      imageSrc: "/featured3.jpg",
      date: "07-Oct-2024",
      time: "12:00 PM - 02:00 AM (IST)",
      location: "Wembley",
      title: "Dinner With DSP",
      subtitle1: "Live Music",
      subtitle2: "@Feltham - London",
      price1: "VIP: 120.00 GBP",
      price2: "Red: 90.00 GBP",
      category: "",
    },
    {
      link: "/eventsdetail",
      tag: "Upcoming",
      imageSrc: "/featured3.jpg",
      date: "06-Oct-2024",
      time: "07:00 PM - 10:00 PM (IST)",
      location: "Feltham",
      title: "DSP-Meet & Greet",
      subtitle1: "Live Music",
      subtitle2: "@Feltham - London",
      price1: "VIP: 120.00 GBP",
      price2: "Red: 90.00 GBP",
      category: "",
    },
    {
      link: "/eventsdetail",
      tag: "Upcoming",
      imageSrc: "/featured3.jpg",
      date: "22-Jan-2024",
      time: "04:30 PM - 10:30 PM (IST)",
      location: "Wembley",
      title: "Tamil Heritage Month Event and Conference",
      subtitle1: "Live Music",
      subtitle2: "@OVO Arena Wembley - London",
      price1: "VIP: 120.00 GBP",
      price2: "Red: 90.00 GBP",
      category: "",
    },
    {
      link: "/eventsdetail",
      tag: "Upcoming",
      imageSrc: "/featured3.jpg",
      date: "12-Jan-2024",
      time: "11:30 PM - 03:30 AM (IST)",
      location: "Harrow",
      title: "Tamil New Year Pongal Festival",
      subtitle1: "Live Music",
      subtitle2: "@Harrow - England",
      price1: "VIP: 120.00 GBP",
      price2: "Red: 90.00 GBP",
      category: "",
    },
    {
      link: "/eventsdetail",
      tag: "Upcoming",
      imageSrc: "/featured3.jpg",
      date: "12-Jan-2024",
      time: "11:30 PM - 03:30 AM (IST)",
      location: "Wembley",
      title: "ADIYE",
      subtitle1: "Live Music",
      subtitle2: "@Wembley - London",
      price1: "VIP: 120.00 GBP",
      price2: "Red: 90.00 GBP",
      category: "",
    },
    {
      link: "/eventsdetail",
      tag: "Upcoming",
      imageSrc: "/featured3.jpg",
      date: "24-Jan-2024",
      time: "11:30 PM - 03:30 AM (IST)",
      location: "RUISLIP",
      title: "ROJA",
      subtitle1: "Live Music",
      subtitle2: "@RUISLIP - London",
      price1: "VIP: 120.00 GBP",
      price2: "Red: 90.00 GBP",
      category: "",
    },
    // Add more events as needed
  ];
  console.log("EL");
  return (
    <div>
      <Container>
        <Grid container spacing={3}>
          {events.map((event, index) => (
            <Grid key={index} item xs={12} sm={6} lg={4}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default EventListAll;
