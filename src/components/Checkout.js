import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Button,
  FormControl,
  List,
  ListItem,
  ListItemText,
  ButtonGroup,
  FormControlLabel,
  Checkbox,
  Link,
  Radio,
  FormGroup,
} from "@mui/material";
import TopBar from "./TopBar";
import Footer from "./Footer";
import BreadCrumb from "./BreadCrumb";
import { Fingerprint, PersonAdd } from "@mui/icons-material";
import { connect } from "react-redux";
import { updateQuantity } from "../redux/action/index.js";
import TicketSelection from "./TicketSelection.js";
import ModalDetails from "./ModalDetails.js";
import SeatingChart from "./SeatingChart.js";

const Checkout = ({ ticket, index, updateQuantity }) => {
  const ticketsData = [
    {
      title: "VIP",
      price: "120",
      quantity: "0",
      total: "0.00",
    },
    {
      title: "Red",
      price: "120",
      quantity: "0",
      total: "0.00",
    },
    {
      title: "Standing",
      price: "120",
      quantity: "0",
      total: "0.00",
    },
    {
      title: "Blue",
      price: "120",
      quantity: "0",
      total: "0.00",
    },
  ];

  const listItemStyle = {
    justifyContent: "space-between",
  };

  const deliveryFeesStyle = {
    paddingRight: 0,
  };
  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value, 10);
    updateQuantity(index, quantity);
  };
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  return (
    <div>
      <div className="main">
        <TopBar />
        {/* <BreadCrumb /> */}
        <SeatingChart />
        <div style={{ marginBottom: "80px" }}>
          <Container>
            {/* <Grid item mb={12}>
              <Typography
                variant="h4"
                className="heading"
                sx={{ color: "rgb(0, 25, 47)" }}
              >
                Get your tickets now
              </Typography>
            </Grid> */}
            
            {/* Tickets */}
            <Grid>
              <TicketSelection />
              {/* Add total and other summary information if needed */}
            </Grid>
            {/* Payment */}
            <div className="col-md-12">
              <Typography variant="h5" align="center" gutterBottom>
                Payment
              </Typography>

              <FormControl component="fieldset" className="my-3 pl-3">
                <FormGroup style={{ color: "grey" }}>
                  <FormControlLabel
                    control={<Radio id="payment_method_wallet" />}
                    label="Pay By Dhigna Wallet"
                  />

                  <FormControlLabel
                    control={<Radio id="payment_method_worldpay" />}
                    label="Pay By Card"
                  />
                </FormGroup>

                <Typography
                  variant="body2"
                  className="mt-5"
                  style={{ color: "grey" }}
                >
                  This order is subject to dhigna{" "}
                  <Link href="/" target="_blank">
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/" target="_blank">
                    Privacy Policy
                  </Link>
                  .
                </Typography>

                <div className="mt-4" style={{ color: "grey" }}>
                  <FormControlLabel
                    control={<Checkbox id="payment_method_offline" />}
                    label="Amount is non-refundable and non-transferable."
                    className="text-mute ml-2"
                  />
                </div>
              </FormControl>
            </div>

            {/* Buttons */}
            <div className="row mt-1">
              <div className="col-xs-12">
                <ButtonGroup fullWidth variant="contained">
                  <Button
                    color="primary"
                    style={{ padding: "1rem" }}
                    startIcon={<PersonAdd />}
                    onClick={handleOpenModal}
                    hideSomeInputs={false}
                  >
                    Register
                  </Button>
                  <ModalDetails
                    open={modalOpen}
                    handleClose={handleCloseModal}
                  />
                  <Button
                    style={{ backgroundColor: "#00192f" }}
                    onClick={() => handleOpenModal(true)}
                    hideSomeInputs={true}
                    startIcon={<Fingerprint />}
                  >
                    Checkout as Guest
                  </Button>
                  <ModalDetails
                    open={modalOpen}
                    handleClose={handleCloseModal}
                    hideSomeInputs={true}
                  />
                </ButtonGroup>
              </div>
            </div>
          </Container>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const mapStateToProps = (state) => ({
  tickets: state.tickets,
});

const mapDispatchToProps = {
  updateQuantity,
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
