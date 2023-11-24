// import React from "react";
// import Container from "@mui/material/Container";
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";
// import CardActionArea from "@mui/material/CardActionArea";
// import CardContent from "@mui/material/CardContent";
// import Typography from "@mui/material/Typography";

// const CityCard = ({ imageUrl, cityName }) => (
//   <Card>
//     <CardActionArea>
//       <img src={imageUrl} alt={cityName} style={{ maxWidth: "100%" }} />
//       <CardContent>
//         <Typography variant="h5">{cityName}</Typography>
//       </CardContent>
//     </CardActionArea>
//   </Card>
// );

// const ExploreCities = ({ cities, heading }) => (
//   <section>
//     <div id="lgx-schedule" className="lgx-schedule">
//       <div
//         className="lgx-inner"
//         // style={{
//         //   backgroundImage: `url("https://events.dhigna.com/frontend-assets?path=img%2Fbg-pattern.png")`,
//         // }}
//       >
//         <Container>
//           <div className="row">
//             <div className="col-12">
//               <div className="lgx-heading">
//                 <h2 className="heading">{heading}</h2>
//               </div>
//             </div>
//           </div>
//           <div className="row">
//             <Grid container spacing={2}>
//               {cities.map((city, index) => (
//                 <Grid key={index} item xs={12} sm={6} lg={4}>
//                   <CityCard {...city} />
//                 </Grid>
//               ))}
//             </Grid>
//           </div>
//         </Container>
//       </div>
//     </div>
//   </section>
// );

// export default ExploreCities;

import React, { useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const CityCard = ({ imageUrl, cityName }) => (
  <Card>
    <CardActionArea>
      <img src={imageUrl} alt={cityName} style={{ maxWidth: "100%" }} />
      <CardContent>
        <Typography variant="h5">{cityName}</Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

const ExploreCities = ({ cities, heading }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const cardsPerPage = 3;
  const totalPages = Math.ceil(cities.length / cardsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  return (
    <section>
      <div id="lgx-schedule" className="lgx-schedule">
        <Container>
          <div className="row">
            <div className="col-12">
              <div className="lgx-heading">
                <h2 className="heading">{heading}</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <Button
              className="scroll-button"
              disabled={currentPage === 0}
              onClick={handlePrevPage}
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              className="scroll-button"
              disabled={currentPage === totalPages - 1}
              onClick={handleNextPage}
            >
              <ChevronRightIcon />
            </Button>
          </div>
          <div className="row">
            <Grid container spacing={2} className="scrolling-container">
              {cities.slice(currentPage * cardsPerPage, (currentPage + 1) * cardsPerPage).map((city, index) => (
                <Grid key={index} item xs={12} sm={6} lg={4}>
                  <CityCard {...city} />
                </Grid>
              ))}
            </Grid>
          </div>
          
        </Container>
      </div>
    </section>
  );
};

export default ExploreCities;
