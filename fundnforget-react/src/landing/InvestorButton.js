import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { useInvestor } from '../context/InvestorContext';

const InvestorButton = () => {
  const { ready, authenticated, login } = usePrivy();
  const { isInvestor, setIsInvestor } = useInvestor();
  const navigate = useNavigate();
  const disableLogin = !ready || (ready && authenticated);

  useEffect(() => {
    if (authenticated && isInvestor) {
        navigate('/investor');
    }
}, [authenticated, navigate, setIsInvestor]);

  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: '#818CF8',
        color: 'white',
        textTransform: 'none',
        fontWeight: 'bold',
        borderRadius: '50px',
        '&:hover': { backgroundColor: '#6B72DF' },
      }}
      disabled={disableLogin} 
      onClick={() => {
        setIsInvestor(true); 
        login();
      }}
    >
      Investor Portal
    </Button>
  );
};

export default InvestorButton;
