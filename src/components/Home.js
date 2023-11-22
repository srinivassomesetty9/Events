import React from "react";
import TopBar from "./TopBar";
import Footer from "./Footer";
import EventList from "./EventList";
import Customer from "./Customer";
import EventOrganizer from "./EventOrganizer";
import Blogs from "./Blogs";
import UpcomingEvent from "./UpcomingEvent";
import EventCategories from "./EventCategories";
import TopSelling from "./TopSelling";
import ExploreCities from "./ExploreCities";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  let navigate = useNavigate();
  const citiesData = [
    {
      imageUrl: "/Home.jpg",
      cityName: "Wembley",
    },
    {
      imageUrl: "/Home.jpg",
      cityName: "Wembley",
    },
    {
      imageUrl: "/Home.jpg",
      cityName: "Wembley",
    },
    {
      imageUrl: "/Home.jpg",
      cityName: "Wembley",
    },
    {
      imageUrl: "/Home.jpg",
      cityName: "Wembley",
    },
    // Add more cities as needed
  ];
  const images = [
    { url: "/Eventc1.png" },
    { url: "/Eventc2.jpg" },
    { url: "/Eventc3.jpg" },
    { url: "/Eventc4.jpg" },
    // Add more images as needed
  ];
  return (
    <div>
      <div className="main">
        <TopBar />
        <>
          <div className="image-container">
            <>
              {/* <ImageScroll images={images} /> */}
              <img src="./music-104.gif" className="background-image" />
              <div class="lgx-container">
                <div class="lgx-hover-link">
                  <div class="lgx-vertical">
                    <div class="lgx-banner-info">
                      <h3 class="subtitle lgx-delay lgx-fadeInDown">
                        Event Management And Selling Platform
                      </h3>{" "}
                      <h2 style={{ marginRight: "515px" }}>Dhigna Events</h2>{" "}
                      <div class="action-area">
                        <div class="lgx-video-area">
                          <Button
                            onClick={() => navigate("/events")}
                            class="lgx-btn lgx-btn-red"
                          >
                            Get Event Tickets &nbsp;&nbsp;{" "}
                            <i class="fas fa-long-arrow-alt-right"></i>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </div>
        </>

        {/* Add content similar to the home page of the target website */}
        <EventList />
        <EventCategories />
        <UpcomingEvent />
        <TopSelling />
        <ExploreCities cities={citiesData} heading="Explroe Best Cities" />
        <Blogs />
        <EventOrganizer />
        <Customer />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
