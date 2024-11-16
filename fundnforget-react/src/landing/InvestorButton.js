import React from 'react';
import { Button } from '@mui/material';

const InvestorButton = () => {
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
    >
      Investor Portal
    </Button>
  );
};

export default InvestorButton;
