import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [resumeAssignmentStrategy, setResumeAssignmentStrategy] = useState("");
  const [globalSurplusCount, setGlobalSurplusCount] = useState(0);
  const [globalAssignmentType, setGlobalAssignmentType] = useState("");

  useEffect(() => {
    const getGlobalSettings = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "https://api.jinnhire.in/jinnhire/data/global-settings/",
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setGlobalSurplusCount(data.global_surplus_count_of_resumes);
          setGlobalAssignmentType(data.global_assignment_type);
          setResumeAssignmentStrategy(data.resume_assignment_strategy);
        } else {
          throw new Error("Failed to fetch global settings");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getGlobalSettings();
  }, []);

  return (
    <AppContext.Provider
      value={{
        resumeAssignmentStrategy,
        setResumeAssignmentStrategy,
        globalSurplusCount,
        globalAssignmentType,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

