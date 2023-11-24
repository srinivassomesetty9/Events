import React from "react";
import { Paper, Typography } from "@mui/material";
import { styled } from "@mui/system";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const EventCard = ({ event }) => {
  const {
    link,
    tag,
    imageSrc,
    date,
    time,
    location,
    title,
    subtitle1,
    subtitle2,
    price1,
    price2,
  } = event;

  return (
    <div>
      <div style={{margin:"7px"}}>
        <StyledPaper elevation={3}>
          <a href={link} style={{ textDecoration: "none", color: "inherit" }}>
            {/* <div className="lgx-event__tag">
              <span>{tag}</span>
            </div> */}
            <div className="lgx-event__image">
              <img
                src={imageSrc}
                alt=""
                className="event-image"
                style={{ width: "100%", borderRadius: "8px", padding:"0"}}
              />
            </div>
            <div className="lgx-event__info">
              <div className="meta-wrapper">
                <Typography variant="subtitle1">{date}</Typography>
                {/* <Typography variant="subtitle1">{time}</Typography>
                <Typography variant="subtitle1">{location}</Typography> */}
              </div>
              <Typography variant="h5" gutterBottom>
                {title}
              </Typography>
              {/* <Typography variant="subtitle2" style={{ height: "20px" }}>
                {subtitle1}
              </Typography>
              <Typography
                variant="subtitle2"
                className="text-primary"
                style={{ height: "20px" }}
              >
                {subtitle2}
              </Typography> */}
            </div>
            {/* <div className="lgx-event__footer">
              <div>{price1}</div>
              <div>{price2}</div>
            </div>
            <div className="lgx-event__category">
              <span></span>
            </div> */}
          </a>
        </StyledPaper>
      </div>
    </div>
  );
};

export default EventCard;
