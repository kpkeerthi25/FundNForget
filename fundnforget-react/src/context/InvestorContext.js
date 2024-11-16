import React, { createContext, useState, useContext } from 'react';

const InvestorContext = createContext();

export const InvestorProvider = ({ children }) => {
  const [isInvestor, setIsInvestor] = useState(false);

  return (
    <InvestorContext.Provider value={{ isInvestor, setIsInvestor }}>
      {children}
    </InvestorContext.Provider>
  );
};

export const useInvestor = () => useContext(InvestorContext);
