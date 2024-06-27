import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Registration from "./components/Registration";
import Login from "./components/Login";
import Profiles from "./components/Profiles";
import SettingsPage from "./components/SettingsPage";
import FileManagement from "./components/FileManagement";
import NoAuth from "./components/NoAuth";
import PageNotFound from "./components/PageNotFound";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Add your authentication logic here
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/files" element={<FileManagement />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="/signup" element={<Registration />} />
        <Route path="/" element={<Login />} />
        <Route path="/noauth" element={<NoAuth />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
