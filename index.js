import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { GlobalStateProvider } from "./components/GlobalStateContext";
import { AppProvider } from "./components/AppContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    {/* <React.StrictMode> */}
    <GlobalStateProvider>
    <AppProvider>
    <App />
    </AppProvider>
    </GlobalStateProvider>
    {/* </React.StrictMode> */}
  </BrowserRouter>
);
