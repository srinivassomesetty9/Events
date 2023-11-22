import React from 'react';
import Slider from 'react-slick';
import { Card, CardMedia, Grid, Typography } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ImageScroll = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, 
    autoplaySpeed: 2000,
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" component="div" gutterBottom>
          Image Scroll
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Slider {...settings}>
          {images.map((image, index) => (
            <Card key={index}>
              <CardMedia
                component="img"
                height="140"
                image={image.url}
                alt={`Image ${index}`}
              />
            </Card>
          ))}
        </Slider>
      </Grid>
    </Grid>
  );
};

export default ImageScroll;
