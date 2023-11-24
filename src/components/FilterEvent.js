import React, { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  Grid,
  Container,
  Pagination,
  Stack,
  Box,
  Typography,
  Card,
  Paper,
} from "@mui/material";
import EventCard from "./EventCard";

const FilterEvent = () => {
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
  ]; // Your events array

  const [searchQuery, setSearchQuery] = useState('');
  const [events1, setEvents1] = useState(/* Your events array */);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredEvents = events.filter((event) => {
    const searchFields = [
      event.title,
      event.subtitle1,
      event.subtitle2,
      event.location,
    ];
    const lowerCaseQuery = searchQuery.toLowerCase();
    return searchFields.some((field) =>
      field.toLowerCase().includes(lowerCaseQuery)
    );
  });

  // Pagination
  const itemsPerPage = 6;
  const [page, setPage] = React.useState(1);
  const totalPages = Math.ceil(events.length / itemsPerPage);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const displayedEvents = filteredEvents.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Container >
      <Grid container spacing={2} mt={8}>
      <Grid item xs={12} lg={3}>
         <Paper elevation={3} style={{ padding: "20px", marginTop:"35px" }}>
         <Stack spacing={2}>
            <TextField
              label="Search Event"
              placeholder="Type Event Name/Venue/City/State"
              fullWidth
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <InputLabel id="category-label">Category</InputLabel>
            <Select labelId="category-label" label="Category" name="category" fullWidth variant="outlined">
              <MenuItem value="All">All</MenuItem>
              {/* Add other categories */}
            </Select>
            <TextField label="Date" placeholder="Date Filter" fullWidth variant="outlined" type="text" autoComplete="off" />
            <InputLabel id="price-label">Price</InputLabel>
            <Select labelId="price-label" label="Price" name="price" fullWidth variant="outlined">
              <MenuItem value="">Any Price</MenuItem>
              <MenuItem value="free">Free</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
            </Select>
            <InputLabel id="country-label">Country</InputLabel>
            <Select labelId="country-label" label="Country" name="country" fullWidth variant="outlined">
              <MenuItem value="All">All</MenuItem>
              {/* Add other countries */}
            </Select>
            <InputLabel id="city-label">City</InputLabel>
            <Select labelId="city-label" label="City" name="city" disabled fullWidth variant="outlined">
              <MenuItem value="All">All</MenuItem>
              {/* Add other cities */}
            </Select>
            <Button type="button" variant="contained" color="primary" fullWidth>
              <i className="fas fa-redo"></i> Reset Filters
            </Button>
          </Stack>
         </Paper>
          
        </Grid>
        <Grid item xs={12} lg={9}>
          <Typography variant="h4" gutterBottom>
            Events
          </Typography>
          <Grid container spacing={3}>
            {displayedEvents.map((event, index) => (
              <Grid key={index} item xs={12} sm={6} lg={4}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
          <Box mt={3} mb={4}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChangePage}
              shape="rounded"
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FilterEvent;

