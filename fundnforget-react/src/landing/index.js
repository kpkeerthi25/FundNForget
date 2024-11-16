import React from 'react';
import { Box } from '@mui/material';
import TopBar from '../components/TopBar';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';

const LandingPage = () => {
  return (
    <Box bgcolor={'#FFF1F2'}>
      <TopBar />
      <HeroSection />
      <FeaturesSection />
    </Box>
  );
};

export default LandingPage;
