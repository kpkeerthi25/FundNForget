import React from 'react';
import { Box, Typography } from '@mui/material';
import CryptoInvestingImage from '../assets/images/landing-image.jpg';
import InvestorButton from './InvestorButton';
import FundManagerButton from './FundManagerButton';

const HeroSection = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingX: '12%',
        paddingTop: '5%',
        backgroundColor: '#FFF1F2',
      }}
    >
      <Box sx={{ maxWidth: '50%' }}>
        <Typography variant="h3" sx={{ color: '#374151' }}>
          Smart <span style={{ color: '#818CF8' }}>Crypto Investing</span>
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#374151',
            marginTop: '16px',
            marginBottom: '32px',
            fontSize: '1.25rem',
          }}
        >
          Elevate your investment strategy with our intuitive platform. Designed
          for both novice and experienced crypto enthusiasts.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <InvestorButton />
          <FundManagerButton />
        </Box>
      </Box>
      <Box
        sx={{
          width: '40%',
          height: '100%',
          backgroundColor: '#E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={CryptoInvestingImage}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>
    </Box>
  );
};

export default HeroSection;
