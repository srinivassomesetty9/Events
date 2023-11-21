import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const CityCard = ({ imageUrl, cityName }) => (
  <Card>
    <CardActionArea>
      <img src={imageUrl} alt={cityName} style={{ maxWidth: '100%' }} />
      <CardContent>
        <Typography variant="h5">{cityName}</Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

const ExploreCities = ({ cities, heading }) => (
  <section>
    <div id="lgx-schedule" className="lgx-schedule lgx-schedule-light">
      <div
        className="lgx-inner"
        style={{
          backgroundImage: `url("https://events.dhigna.com/frontend-assets?path=img%2Fbg-pattern.png")`,
        }}
      >
        <Container>
          <div className="row">
            <div className="col-12">
              <div className="lgx-heading">
                <h2 className="heading">{heading}</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <Grid container spacing={2}>
              {cities.map((city, index) => (
                <Grid key={index} item xs={12} sm={6} lg={4}>
                  <CityCard {...city} />
                </Grid>
              ))}
            </Grid>
          </div>
        </Container>
      </div>
    </div>
  </section>
);

export default ExploreCities;
