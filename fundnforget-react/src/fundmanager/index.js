import React, { useEffect } from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import TopBar from '../components/TopBar';
import FundStatistics from './FundStatistics';
import CurrentStrategy from './CurrentStrategy';
import PastStrategies from './PastStrategies';

const FundManagerPage = () => {
  const { authenticated } = usePrivy();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticated) {
      navigate('/'); // Redirect to home if not authenticated
    }
  }, [authenticated, navigate]);

  return (
    <Box sx={{ background: '#FFF1F2' }}>
      <TopBar />
      <Container sx={{ marginTop: 4, background: '#FFF1F2', alignContent: 'start' }}>
        {/* Grid layout for Current Allocations and Performance Graph */}
        <Grid container spacing={4} sx={{ alignContent: 'start' }}>
          {/* Left side: Current Allocations */}
          <Grid item xs={12} sm={6}>
            <CurrentStrategy />
          </Grid>

          {/* Right side: Performance Graph */}
          <Grid item xs={12} sm={6}>
            <FundStatistics />
          </Grid>
        </Grid>
        <PastStrategies />
      </Container>
    </Box>
  );
};

export default FundManagerPage;
