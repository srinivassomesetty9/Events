import React, { useState } from "react";
import TopBar from "./TopBar";
import Footer from "./Footer";
import SeatingChart from "./SeatingChart";
import { Container, Grid, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import Blogs from "./Blogs";
const Blogs1 = () => {
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
        <div>
        <Blogs />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blogs1;
