import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Events from "./components/Events";
import Registration from "./components/Registration";
import "./App.css";
import Login from "./components/Login";
import EventsDetail from "./components/EventsDetail";
import Checkout from "./components/Checkout";
import Blogs1 from "./components/Blogs1";
import HowItWorks from "./components/HowItWorks";
import Payment from "./components/Payment/Payment";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/eventsdetail" element={<EventsDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/signup" element={<Registration />} />
        <Route path="/blogs1" element={<Blogs1 />} />
        <Route path="/works" element={<HowItWorks />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </div>
  );
}

export default App;
