import React, { useEffect } from 'react';
import { Container, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import TopBar from '../components/TopBar'; 
import CurrentStrategies from './CurrentStrategies';

const InvestorPage = () => {
  const { authenticated } = usePrivy();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticated) {
      navigate('/');
    }
  }, [authenticated, navigate]);

  return (
    <Box sx={{ background: '#FFF1F2' }}>
      <TopBar />
      <Container sx={{ marginTop: 4, background: '#FFF1F2', alignContent: 'start' }}>
        <CurrentStrategies />
      </Container>
    </Box>
  );
};

export default InvestorPage;
