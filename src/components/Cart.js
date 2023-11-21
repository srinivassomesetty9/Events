import { Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import React from "react";

const Cart = ({totalTickets, totalTicketsPrice, processingFees, ticketDeliveryFees, grossTotal}) => {
    const listItemStyle = {
        justifyContent: "space-between",
      };
      const formattedGrossTotal = parseFloat(grossTotal).toFixed(1);
  return (
    <div>
      {/* Cart */}
      <Grid
        style={{
          width: "100%",
          margin: "auto",
          marginTop: "16px", // Adjust top margin as needed
          padding: "16px", // Adjust padding as needed
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Shopping Cart
        </Typography>
        <List>
          {/* Replace the values below with your dynamic data */}
          <ListItem style={listItemStyle}>
            <ListItemText primary="Total Number of Tickets" />
            <strong className="">{totalTickets}</strong>
          </ListItem>
          <ListItem style={listItemStyle}>
            <ListItemText primary="Total Tickets Price" />
            <strong className="">
              {totalTicketsPrice}<small>GBP</small>
            </strong>
          </ListItem>
          <ListItem style={listItemStyle}>
            <ListItemText primary="Processing Fees" />
            <strong className="">
              {processingFees}<small>GBP</small>
            </strong>
          </ListItem>
          <ListItem style={listItemStyle}>
            <ListItemText primary="Ticket Delivery Fees">
              <span className="text-danger" style={{ color: "red" }}>
                *
              </span>
            </ListItemText>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {/* <div style={{ flex: "0 0 33.33%", paddingRight: "8px" }}>
                      <h6 style={{ margin: "0" }}>
                        <strong>Ticket Delivery Fees</strong>{" "}
                        <span className="text-danger">*</span>
                      </h6>
                    </div> */}
              <div style={{ flex: "0 0 33.33%" }}>
                {/* Add your custom content */}
              </div>
              <div
                style={{
                  flex: "0 0 33.33%",
                  textAlign: "right",
                  paddingRight: "0",
                }}
              >
                <input type="hidden" name="delivery_charge_id" value="12" />
                <strong className="">
                 {ticketDeliveryFees} <small>GBP</small>
                </strong>
              </div>
            </div>
          </ListItem>
          <ListItem style={listItemStyle}>
            <ListItemText primary="Gross Total" />
            <strong className="">
              {formattedGrossTotal}<small>GBP</small>
            </strong>
          </ListItem>
        </List>
      </Grid>
    </div>
  );
};

export default Cart;
