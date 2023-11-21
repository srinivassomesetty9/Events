import React, { useState, useEffect } from "react";
import axios from "axios";
import TopBar from "./TopBar";
import Footer from "./Footer";
import BreadCrumb from "./BreadCrumb";
import FilterEvent from "./FilterEvent";
import EventList from "./EventList";
import EventListAll from "./EventListAll";

const Events = () => {
  const [events, setEvents] = useState([]);

  // useEffect(() => {
  //   axios.get('/api/events')
  //     .then(response => setEvents(response.data))
  //     .catch(error => console.error(error));
  // }, []);

  return (
    <div>
      <div className="main">
        <TopBar />
        <BreadCrumb />
        <FilterEvent />
        <div>
         
          {/* <EventListAll /> */}

          {/* <EventList /> */}
          {/* Display events from the API */}
          {/* {events.map(event => ( */}
          {/* <div key={event.id}>
          <h2>{event.title}</h2>
          <p>{event.description}</p>
        </div> */}
          {/* ))} */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Events;
