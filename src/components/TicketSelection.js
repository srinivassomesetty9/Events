import React, { useState } from "react";
import Cart from "./Cart";

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
    // Calculate the necessary data
    const totalTickets = Object.values(quantities).reduce(
      (acc, curr) => acc + curr,
      0
    );
    const totalTicketsPrice = calculateTotal(); // You need to implement calculateTotal in your component
    const processingFees = calculateProcessingFee(); // You need to implement calculateProcessingFee in your component
    const ticketDeliveryFees = 2.0; // Replace with your actual ticket delivery fees logic
    const grossTotal = totalTicketsPrice + processingFees + ticketDeliveryFees;

    return {
      totalTickets,
      totalTicketsPrice,
      processingFees,
      ticketDeliveryFees,
      grossTotal,
    };
  };
  return (
    <div>
      <h4 className="heading">Tickets</h4>
      {Object.keys(quantities).map((ticketType) => (
        <div className="container" key={ticketType}>
          <div>
            <h3>{ticketType}</h3>
            <span>Price: {ticketPrices[ticketType]} GBP</span>
          </div>
          <div className="quantity">
            <label htmlFor={`${ticketType}-quantity`}>Qty:</label>
            <select
              id={`${ticketType}-quantity`}
              value={quantities[ticketType]}
              onChange={(e) =>
                handleQuantityChange(ticketType, parseInt(e.target.value))
              }
            >
              {Array.from({ length: 11 }).map((_, index) => (
                <option key={index} value={index}>
                  {index}
                </option>
              ))}
            </select>
          </div>
          {attendees[ticketType].length !== 0 ? (
            <p>Total: {calculateTotal()} GBP</p>
          ) : (
            <p>Total: 0GBP</p>
          )}
          <div>
            {attendees[ticketType].length !== 0 ? (
              <>
                <h6>
                  Processing Fee: {calculateProcessingFee().toFixed(2)} GBP
                </h6>
                {attendees[ticketType].map((attendee, index) => (
                  <div key={index} className="attendee-row">
                    <label htmlFor={`${ticketType}-attendee-${index}-name`}>
                      Attendee {index + 1}:
                    </label>
                    <input
                      type="text"
                      id={`${ticketType}-attendee-${index}-name`}
                      placeholder="Name"
                      value={attendee.name}
                      onChange={(e) =>
                        handleAttendeeChange(
                          ticketType,
                          index,
                          "name",
                          e.target.value
                        )
                      }
                    />
                    <input
                      type="text"
                      placeholder="Phone"
                      value={attendee.phone}
                      onChange={(e) =>
                        handleAttendeeChange(
                          ticketType,
                          index,
                          "phone",
                          e.target.value
                        )
                      }
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={attendee.address}
                      onChange={(e) =>
                        handleAttendeeChange(
                          ticketType,
                          index,
                          "address",
                          e.target.value
                        )
                      }
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
