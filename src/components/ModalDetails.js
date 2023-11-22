import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ModalDetails = ({ open, handleClose, hideSomeInputs }) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5">Customer Details</Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
          style={{ marginLeft: "20px" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form method="POST" encType="multipart/form-data">
        <DialogContent>
          {hideSomeInputs && (
            <div className="form-group">
              <label>
                First Name <span className="text-danger">*</span>
              </label>
              <TextField
                type="text"
                //   label="First Name"
                name="first_name"
                placeholder="Enter Your First name"
                fullWidth
                required
              />
            </div>
          )}
          {hideSomeInputs && (
            <div className="form-group">
              <label>
                Last Name <span className="text-danger">*</span>
              </label>
              <TextField
                type="text"
                //   label="Last Name"
                name="last_name"
                placeholder="Enter Your Last name"
                fullWidth
                required
              />
            </div>
          )}
          <div className="form-group">
            <label>
              Email <span className="text-danger">*</span>
            </label>
            <TextField
              type="text"
              //   label="Email"
              name="email"
              placeholder="Enter Email Address"
              fullWidth
              required
            />
          </div>
          <div className="form-group">
            <label>
              Mobile Number <span className="text-danger">*</span>
            </label>
            <TextField
              type="text"
              //   label="Mobile Number"
              name="phone"
              placeholder="Enter 10 to 11 Digit Mobile Number"
              fullWidth
              required
            />
          </div>
          <div className="form-group">
            <label>
              Pin <span className="text-danger">*</span>
            </label>
            <TextField
              type="password"
              //   label="Pin"
              name="password"
              placeholder="Set 6 Digit Pin"
              fullWidth
              required
            />
          </div>
          {hideSomeInputs && (
            <div className="form-group">
              <label>
                Confirm Pin <span className="text-danger">*</span>
              </label>
              <TextField
                type="password"
                //   label="Confirm Pin"
                name="password_confirmation"
                placeholder="Enter Confirm pin"
                fullWidth
                required
              />
            </div>
          )}
          {!hideSomeInputs && (
            <div className="form-group">
              <label>
                Captcha <span className="text-danger">*</span>
              </label>
              <div className="captcha form-inline">
                <span>
                  <img
                    src="https://events.dhigna.com/captcha/flat?jxhv7PxK"
                    alt="captcha"
                    id="capctha_img"
                  />
                </span>
                <Button
                  id="refresh_captcha_btn"
                  name="refresh_captcha_btn"
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={() => {}}
                >
                  <i className="fas fa-sync-alt"></i>
                </Button>
              </div>
              <TextField
                id="captcha"
                type="text"
                //   label="Enter Captcha"
                name="captcha"
                fullWidth
                required
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            <i className="fas fa-cash-register"></i> Continue
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalDetails;
