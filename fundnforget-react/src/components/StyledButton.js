import React from 'react';
import { Button } from '@mui/material';

const StyledButton = ({ children, onClick, to, variant = "contained", color = "black", ...props }) => {
  return (
    <Button
      component={to ? "a" : "button"}
      href={to}
      onClick={onClick} variant="outlined"
      sx={{
        backgroundColor: '#818CF8',
        color: 'white',
        textTransform: 'none',
        fontWeight: 'bold',
        borderRadius: '50px',
        '&:hover': { backgroundColor: '#6B72DF' },
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default StyledButton;
