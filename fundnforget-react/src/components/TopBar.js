import React from 'react';
import { Box, Typography, Button, AppBar, Toolbar } from '@mui/material';
import SmartInvestLogo from '../assets/images/logo.png';
import { usePrivy } from '@privy-io/react-auth';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';

const TopBar = () => {
  const { authenticated } = usePrivy();

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: '#FFF1F2' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', mx: '10%', my: '1%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={SmartInvestLogo}
            alt="SmartInvest Logo"
            style={{ height: '50px', marginRight: '10px' }}
          />
          <Typography variant="h5" sx={{ color: '#374151' }}>
            Fund'n'Forget
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <Button 
            component={Link} 
            to="/" 
            sx={{
              color: '#374151', 
              textTransform: 'none', 
              fontWeight: 'bold', 
              '&:hover': { 
                color: '#818CF8', 
                backgroundColor: 'transparent',
              }
            }}
          >
            Home
          </Button>
          <Button 
            component={Link} 
            to="/how-it-works" 
            sx={{
              color: '#374151', 
              textTransform: 'none', 
              fontWeight: 'bold', 
              '&:hover': { 
                color: '#818CF8', 
                backgroundColor: 'transparent',
              }
            }}
          >
            How it Works
          </Button>
          <Button 
            component={Link} 
            to="/contact" 
            sx={{
              color: '#374151', 
              textTransform: 'none', 
              fontWeight: 'bold', 
              '&:hover': { 
                color: '#818CF8', 
                backgroundColor: 'transparent',
              }
            }}
          >
            Contact Us
          </Button>
          {authenticated && (<LogoutButton />)}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
