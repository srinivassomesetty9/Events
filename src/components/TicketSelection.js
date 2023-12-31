import React, { useState } from "react";
import {
  Typography,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Button,
} from "@mui/material";
import Cart from "./Cart";
import "./TicketSelection.css";

const TicketSelection = () => {
  const [quantities, setQuantities] = useState({
    VIP: 0,
    Red: 0,
    Standing: 0,
    Blue: 0,
  });

  const [attendees, setAttendees] = useState({
    VIP: Array(0).fill({ name: "", phone: "", address: "" }),
    Red: Array(0).fill({ name: "", phone: "", address: "" }),
    Standing: Array(0).fill({ name: "", phone: "", address: "" }),
    Blue: Array(0).fill({ name: "", phone: "", address: "" }),
  });

  const ticketPrices = {
    VIP: 120.0,
    Red: 90.0,
    Standing: 75.0,
    Blue: 60.0,
  };

  const processingFee = 2.5;

  const handleQuantityChange = (ticketType, quantity) => {
    setQuantities({
      ...quantities,
      [ticketType]: quantity,
    });

    setAttendees({
      ...attendees,
      [ticketType]: Array(quantity).fill({ name: "", phone: "", address: "" }),
    });
  };

  const handleAttendeeChange = (ticketType, index, field, value) => {
    const updatedAttendees = [...attendees[ticketType]];
    updatedAttendees[index][field] = value;

    setAttendees({
      ...attendees,
      [ticketType]: updatedAttendees,
    });
  };

  const calculateTotal = () => {
    let total = 0;
    for (const ticketType in quantities) {
      total += quantities[ticketType] * ticketPrices[ticketType];
    }
    const totalWithProcessingFee = total + calculateProcessingFee();
    return totalWithProcessingFee.toFixed(2);
  };

  const calculateProcessingFee = () => {
    let processingFeeTotal = 0;
    for (const ticketType in quantities) {
      processingFeeTotal += quantities[ticketType] * processingFee;
    }
    return processingFeeTotal;
  };

  const calculateSummary = () => {
    const totalTickets = Object.values(quantities).reduce(
      (acc, curr) => acc + curr,
      0
    );
    const totalTicketsPrice = calculateTotal();
    const processingFees = calculateProcessingFee();
    const ticketDeliveryFees = 2.0;
    const grossTotal =
      totalTicketsPrice + processingFees + ticketDeliveryFees + 2;

    return {
      totalTickets,
      totalTicketsPrice,
      processingFees,
      ticketDeliveryFees,
      grossTotal,
    };
  };

  return (
    <div className="ticket-selection-container">
      <Typography variant="h4" gutterBottom className="heading">
        Tickets
      </Typography>
      {Object.keys(quantities).map((ticketType) => (
        <div className="ticket-type-container" key={ticketType}>
          <div className="ticket-type-info">
            <Typography variant="h5">{ticketType}</Typography>
            <Typography variant="body2">
              Price: {ticketPrices[ticketType]} GBP
            </Typography>
          </div>
          <div className="quantity">
            <FormControl>
              <InputLabel htmlFor={`${ticketType}-quantity`}>Qty:</InputLabel>
              <Select
                id={`${ticketType}-quantity`}
                value={quantities[ticketType]}
                onChange={(e) =>
                  handleQuantityChange(ticketType, parseInt(e.target.value))
                }
              >
                {Array.from({ length: 11 }).map((_, index) => (
                  <MenuItem key={index} value={index}>
                    {index}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          {attendees[ticketType].length !== 0 ? (
            <Typography variant="body2">
              Total: {calculateTotal()} GBP
            </Typography>
          ) : (
            <Typography variant="body2">Total: 0 GBP</Typography>
          )}
          <div className="attendee-details">
            {attendees[ticketType].length !== 0 ? (
              <>
                <Typography variant="body2">
                  Processing Fee: {calculateProcessingFee().toFixed(2)} GBP
                </Typography>
                {attendees[ticketType].map((attendee, index) => (
                  <div key={index} className="attendee-row">
                    <TextField
                      label={`Attendee ${index + 1}`}
                      value={attendee.name}
                      onChange={(e) =>
                        handleAttendeeChange(
                          ticketType,
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      fullWidth
                      variant="outlined"
                      margin="dense"
                    />
                    <TextField
                      label="Phone"
                      value={attendee.phone}
                      onChange={(e) =>
                        handleAttendeeChange(
                          ticketType,
                          index,
                          "phone",
                          e.target.value
                        )
                      }
                      fullWidth
                      variant="outlined"
                      margin="dense"
                    />
                    <TextField
                      label="Address"
                      value={attendee.address}
                      onChange={(e) =>
                        handleAttendeeChange(
                          ticketType,
                          index,
                          "address",
                          e.target.value
                        )
                      }
                      fullWidth
                      variant="outlined"
                      margin="dense"
                    />
                  </div>
                ))}
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      ))}
      <Cart {...calculateSummary()} />
    </div>
  );
};

export default TicketSelection;
