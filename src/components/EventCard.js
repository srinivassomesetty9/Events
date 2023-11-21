// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// const FeaturedEvents = () => {
//     const [searchTerm, setSearchTerm] = useState('');
//   const featuredEventsData = [
//     { id: 1, title: 'Special Event 1', imageUrl: './featured1.jpg' },
//     { id: 2, title: 'Special Event 2', imageUrl: './featured2.jpg' },
//     { id: 3, title: 'Special Event 3', imageUrl: './featured3.jpg' },
//   ];

//   const filteredEvents = featuredEventsData.filter(event =>
//     event.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
// <div>
//     <div className='search'>
//     <input
//     type="text"
//     placeholder="Type Event Name/Venue/City/State"
//     value={searchTerm}
//     className='input-search'
//     onChange={(e) => setSearchTerm(e.target.value)}
//     style={{ width: '60%', padding: '10px', marginBottom: '20px' }}
//   />
//   <button type="submit" class="lgx-btn lgx-btn-black"><i class="fas fa-search"></i> Search Event</button>
//   </div>
//   <div class="row"><div class="col-12"><div class="lgx-heading"><h2 class="heading"><i class="fas fa-star"></i> Featured Events</h2></div></div></div>
//     <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', minHeight: '300px' }}>
//       {featuredEventsData.map(event => (
//         <div key={event.id} style={{ flex: 1, margin: '10px', position: 'relative' }}>
//           <Link to={`/events/${event.id}`}>
//             <div
//               style={{
//                 backgroundImage: `url(${event.imageUrl})`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//                 borderRadius: '8px',
//                 overflow: 'hidden',
//                 height: '200px',
//               }}
//             >
//               {/* Optional: Add additional content inside the featured event */}
//               <div style={{ padding: '20px', color: '#fff' }}>
//                 <h3>{event.title}</h3>
//               </div>
//             </div>
//           </Link>
//         </div>
//       ))}
//     </div>
//     </div>
//   );
// };

// export default FeaturedEvents;


// import React from 'react';
// import { Paper, Typography } from '@mui/material';
// import { styled } from '@mui/system';

// const useStyles = styled((theme) => ({
//   eventPaper: {
//     padding: theme.spacing(3),
//     marginBottom: theme.spacing(3),
//   },
//   eventImage: {
//     width: '100%',
//     height: 'auto',
//   },
//   metaWrapper: {
//     marginBottom: theme.spacing(2),
//   },
//   priceWrapper: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     marginTop: theme.spacing(2),
//   },
// }));

// const EventCard = ({ event }) => {
//   const classes = useStyles();
// console.log(event,"DD")
//   return (
//     <Paper elevation={3} className={classes.eventPaper}>
//       <a href={event.link}>
//         <div className="lgx-event__tag">
//           <span>{event.tag}</span>
//         </div>
//         <div className="lgx-event__image">
//           <img
//             src={event.imageSrc}
//             alt=""
//             className={classes.eventImage}
//           />
//         </div>
//         <div className="lgx-event__info">
//           <div className={classes.metaWrapper}>
//             <Typography variant="subtitle1">{event.date}</Typography>
//             <Typography variant="subtitle1">{event.time}</Typography>
//             <Typography variant="subtitle1">{event.location}</Typography>
//           </div>
//           <Typography variant="h5" gutterBottom>
//             {event.title}
//           </Typography>
//           <Typography variant="subtitle2" style={{ height: '20px' }}>
//             {event.subtitle1}
//           </Typography>
//           <Typography variant="subtitle2" className="text-primary" style={{ height: '20px' }}>
//             {event.subtitle2}
//           </Typography>
//         </div>
//         <div className="lgx-event__footer">
//           <div>
//             {event.price1}
//           </div>
//           <div>
//             {event.price2}
//           </div>
//         </div>
//         <div className="lgx-event__category">
//           <span>{event.category}</span>
//         </div>
//       </a>
//     </Paper>
//   );
// };

// export default EventCard;

import React, { useState } from 'react';
import { Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const EventCard = ({ event }) => {
  
  const { link, tag, imageSrc, date, time, location, title, subtitle1, subtitle2, price1, price2 } = event;

  return (
    <div>
   
  <div>
    <StyledPaper elevation={3}>
      <a href={link} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="lgx-event__tag">
          <span>{tag}</span>
        </div>
        <div className="lgx-event__image">
          <img src={imageSrc} alt="" className="event-image" style={{ width: '100%', borderRadius: '8px' }} />
        </div>
        <div className="lgx-event__info">
          <div className="meta-wrapper">
            <Typography variant="subtitle1">{date}</Typography>
            <Typography variant="subtitle1">{time}</Typography>
            <Typography variant="subtitle1">{location}</Typography>
          </div>
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>
          <Typography variant="subtitle2" style={{ height: '20px' }}>
            {subtitle1}
          </Typography>
          <Typography variant="subtitle2" className="text-primary" style={{ height: '20px' }}>
            {subtitle2}
          </Typography>
        </div>
        <div className="lgx-event__footer">
          <div>{price1}</div>
          <div>{price2}</div>
        </div>
        <div className="lgx-event__category">
          <span></span>
        </div>
      </a>
    </StyledPaper>
    </div>
    </div>
  );
};

export default EventCard;
