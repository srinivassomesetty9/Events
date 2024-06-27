import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const BreadCrumb = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const handleClick = (event, path) => {
    event.preventDefault();
    navigate(path);
  };

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{
        marginBottom: "20px",
        bgcolor: "##ffff",
        padding: "10px",
        borderRadius: "5px",
      }}
    >
      <Link
        underline="hover"
        color="inherit"
        href="/"
        onClick={(event) => handleClick(event, "/home")}
        sx={{ cursor: "pointer" }}
      >
        Home
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        return isLast ? (
          <Typography key={to} color="text.primary">
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Typography>
        ) : (
          <Link
            key={to}
            underline="hover"
            color="inherit"
            href={to}
            onClick={(event) => handleClick(event, to)}
            sx={{ cursor: "pointer" }}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadCrumb;
