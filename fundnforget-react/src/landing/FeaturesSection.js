import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <Card
      sx={{
        width: '300px',
        padding: '20px',
        paddingX: '60px',
        borderRadius: '12px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      }}
    >
      <CardContent>
        <Icon sx={{ fontSize: 40, color: '#818CF8' }} />
        <Typography variant="h6" sx={{ marginTop: '16px', color: '#374151', fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#374151', marginTop: '8px' }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const FeaturesSection = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '5% 10%',
        backgroundColor: '#FFF1F2',
      }}
    >
      <FeatureCard
        icon={SecurityIcon}
        title="Secure Investing"
        description="Multi-layer protection for your investments."
      />
      <FeatureCard
        icon={AnalyticsIcon}
        title="Smart Analytics"
        description="Gain insights with advanced data visualization."
      />
      <FeatureCard
        icon={HeadsetMicIcon}
        title="24/7 Support"
        description="Our team is always here to assist you."
      />
    </Box>
  );
};

export default FeaturesSection;
