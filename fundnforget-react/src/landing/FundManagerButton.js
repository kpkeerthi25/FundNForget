import React from 'react';
import { Button } from '@mui/material';

const FundManagerButton = () => {
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
    >
      Fund Manager Access
    </Button>
  );
};

export default FundManagerButton;
