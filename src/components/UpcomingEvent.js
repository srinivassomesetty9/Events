import React, { useRef, useEffect } from "react";
import Slider from "react-slick";
import { Button, Container, Typography } from "@mui/material";
import EventCard from "./EventCard";
import { Link, useNavigate } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const UpcomingEvent = () => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);

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

  ];

  const settings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 4000,
    pauseOnHover: true,
  };

  useEffect(() => {
    if (sliderRef.current) {
      // To start the auto-scrolling after the component mounts
      sliderRef.current.slickPlay();
    }
  }, []);

  return (
    <div>
      <Container>
        <div className="lgx-heading">
          <div className="headerText">
            <Typography variant="h4">
              <i className="fas fa-star"></i> Upcoming Events
            </Typography>
          </div>
        </div>
        <div className="section-btn-area">
          <Button
            onClick={() => sliderRef.current.slickPrev()}
            variant="outlined"
            color="primary"
            className="icon-button"
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            onClick={() => sliderRef.current.slickNext()}
            variant="outlined"
            color="primary"
            className="icon-button"
          >
            <ChevronRightIcon />
          </Button>
        </div>
        <Slider ref={sliderRef} {...settings}>
          {events.map((event, index) => (
            <div key={index}>
              <EventCard event={event} />
            </div>
          ))}
        </Slider>
        
      </Container>
    </div>
  );
};

export default UpcomingEvent;
