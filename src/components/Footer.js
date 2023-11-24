import React from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Link,
  List,
  ListItem,
} from "@mui/material";
import { Facebook, Instagram, LinkedIn, Twitter } from "@mui/icons-material";

const Footer = () => {
  return (
    <footer>
      <Paper id="lgx-footer" className="lgx-footer-black">
        <div className="lgx-inner-footer">
          <Container>
            <Grid
              container
              spacing={3}
              className="lgx-footer-area footer-custom-menu"
            >
              <Grid item xs={12} sm={6} md={3}>
                <div className="lgx-footer-single footer-brand">
                  <img
                    src="/icon.png"
                    alt="Dhigna Events"
                    className="footer-brand-logo"
                  />
                  <Typography variant="h6" className="footer-brand-name">
                    Dhigna Events
                  </Typography>
                  <Typography variant="body2" className="footer-brand-slogan">
                    Dhigna Events . Sell Tickets.
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <div className="lgx-footer-single">
                  <Typography variant="h6" className="footer-title">
                    Useful Links
                  </Typography>
                  <List>
                    <ListItem>
                      <Link href="/about" color="inherit">
                        About
                      </Link>
                    </ListItem>
                    <ListItem>
                      <Link href="/events" color="inherit">
                        Events
                      </Link>
                    </ListItem>
                    <ListItem>
                      <Link href="/blogs1" color="inherit">
                        Blogs
                      </Link>
                    </ListItem>
                    <ListItem>
                      <Link href="/works" color="inherit">
                        How It Works
                      </Link>
                    </ListItem>
                    <ListItem>
                      <Link href="/terms" color="inherit">
                        Terms & Conditions
                      </Link>
                    </ListItem>
                    <ListItem>
                      <Link href="/privacy" color="inherit">
                        Privacy Policy
                      </Link>
                    </ListItem>
                    <ListItem>
                      <Link href="/cookie" color="inherit">
                        Cookie Policy
                      </Link>
                    </ListItem>
                    <ListItem>
                      <Link href="/faqs" color="inherit">
                        FAQs
                      </Link>
                    </ListItem>
                  </List>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <div className="lgx-footer-single">
                  <Typography variant="h6" className="footer-title">
                    Contact
                  </Typography>
                  <Link href="/contact">
                    <Typography variant="h6" className="date">
                      Send us a message
                    </Typography>
                  </Link>
                  <address>
                    Dhigna Limited, 30 Churchill place, Canary wharf, London E14
                    5RE United Kingdom
                  </address>
                  <Typography variant="body2" className="text">
                    <i className="fas fa-phone-alt"></i> +44 204577 1234
                  </Typography>
                  <Typography variant="body2" className="text">
                    <i className="fas fa-envelope"></i> info@dhigna.com
                  </Typography>
                  <Link href="/contact" className="map-link">
                    <i className="fas fa-map-marked-alt"></i> Find us on Map
                  </Link>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <div className="lgx-footer-single">
                  <Typography variant="h6" className="footer-title">
                    Social Connections
                  </Typography>
                  <Typography variant="body2" className="text">
                    Find us on social platforms
                  </Typography>
                  <ul className="list-inline lgx-social-footer" style={{listStyle:"none",display:"flex"}}>
                    <li>
                      <Link
                        href="https://www.facebook.com/DhignaGroup"
                        target="_blank"
                      >
                        <Facebook />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://twitter.com/DhignaGroup"
                        target="_blank"
                      >
                        <Twitter />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://www.instagram.com/dhignagroup/"
                        target="_blank"
                      >
                        <Instagram />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://www.linkedin.com/company/dhignagroup/"
                        target="_blank"
                      >
                        <LinkedIn />
                      </Link>
                    </li>
                  </ul>
                </div>
              </Grid>
            </Grid>

            <div className="lgx-footer-bottom">
              <div className="lgx-copyright">
                <Typography variant="body2">
                  <span>©</span> 2023{" "}
                  <Link href="/" color="inherit">
                    Dhigna Events
                  </Link>
                  <br />
                  Dhigna Events<strong>v1.8</strong>. Product by{" "}
                  <Link href="/" target="_blank" color="inherit">
                    Dhigna Events
                  </Link>
                </Typography>
              </div>
            </div>
          </Container>
        </div>
      </Paper>
    </footer>
  );
};

export default Footer;
