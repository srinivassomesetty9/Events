import React from 'react';
import { TextField, Select, MenuItem, Button, FormControl, InputLabel, Grid, Container } from '@mui/material';
import EventCard from './EventCard';

const FilterEvent = () => {
    const events = [
        {
          link: '/eventsdetail',
          tag: 'Upcoming',
          imageSrc: '/featured1.jpg',
          date: '13-Jan-2024',
          time: '11:30 PM - 03:30 AM (IST)',
          location: 'Wembley',
          title: 'Oo Antava - Telugu',
          subtitle1: 'Live Music',
          subtitle2: '@OVO Arena Wembley - London',
          price1: 'VIP : 150.00 GBP',
          price2: 'Standing : 75.00 GBP',
          category: '',
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
  return (
    <Container style={{margin:"0px"}}>
      <Grid container spacing={2} style={{marginTop:"15px", marginRight:"50px"}}>
        <Grid item xs={12} lg={3} className="mb-50 pl-30">
          <div className="form-group">
            <TextField
              label="Search Event"
              placeholder="Type Event Name/Venue/City/State"
              fullWidth
              variant="outlined"
            />
          </div>
          <div className="form-group">
            <InputLabel id="category-label">Category</InputLabel>
            <Select labelId="category-label" label="Category" name="category" fullWidth variant="outlined">
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Upcoming Events">Upcoming Events</MenuItem>
              <MenuItem value="Entertainment">Entertainment</MenuItem>
              <MenuItem value="Music">Music</MenuItem>
              <MenuItem value="Dances">Dances</MenuItem>
            </Select>
          </div>
          <div className="form-group">
            <TextField
              label="Date"
              placeholder="Date Filter"
              fullWidth
              variant="outlined"
              type="text"
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <InputLabel id="price-label">Price</InputLabel>
            <Select labelId="price-label" label="Price" name="price" fullWidth variant="outlined">
              <MenuItem value="">Any Price</MenuItem>
              <MenuItem value="free">Free</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
            </Select>
          </div>
          <div className="form-group">
            <InputLabel id="country-label">Country</InputLabel>
            <Select labelId="country-label" label="Country" name="country" fullWidth variant="outlined">
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="United Kingdom">United Kingdom</MenuItem>
              <MenuItem value="India">India</MenuItem>
            </Select>
          </div>
          <div className="form-group">
            <InputLabel id="city-label">City</InputLabel>
            <Select labelId="city-label" label="City" name="city" disabled fullWidth variant="outlined">
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="London">London, London</MenuItem>
              {/* Add other cities as needed */}
            </Select>
          </div>
          <div className="form-group">
            <Button type="button" variant="contained" color="primary" fullWidth>
              <i className="fas fa-redo"></i> Reset Filters
            </Button>
          </div>
        </Grid>
        <Grid item xs={12} lg={9}>
        <Grid container spacing={3}>
        {events.map((event, index) => (
          <Grid key={index} item xs={12} sm={6} lg={4}>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>
        </Grid>
        
        </Grid>
        
      
    </Container>
  );
};

export default FilterEvent;
