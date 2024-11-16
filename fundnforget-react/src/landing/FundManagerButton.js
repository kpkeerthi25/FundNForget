import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { useInvestor } from '../context/InvestorContext';

const FundManagerButton = () => {
  const { ready, authenticated, login } = usePrivy();
  const { isInvestor, setIsInvestor } = useInvestor();
  const navigate = useNavigate();
  const disableLogin = !ready || (ready && authenticated);

  useEffect(() => {
    if (authenticated && !isInvestor) {
        navigate('/fund-manager'); 
    }
}, [authenticated, navigate, setIsInvestor]);

  return (
    <Button
      variant="outlined"
      sx={{
        color: '#818CF8',
        borderColor: '#818CF8',
        textTransform: 'none',
        fontWeight: 'bold',
        borderRadius: '50px',
        background: 'white',
        '&:hover': { borderColor: '#6B72DF', color: '#6B72DF' },
      }}
      disabled={disableLogin} 
      onClick={() => {
        setIsInvestor(false); 
        login();
      }}
    >
      Fund Manager Access
    </Button>
  );
};

export default FundManagerButton;
