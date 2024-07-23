import React, { createContext, useState, useContext } from 'react';

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  return (
    <GlobalStateContext.Provider value={{ lastUpdateTime, setLastUpdateTime }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
