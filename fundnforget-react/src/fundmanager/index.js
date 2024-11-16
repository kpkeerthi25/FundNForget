import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import TopBar from '../components/TopBar';
import { useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';

const FundManagerPage = () => {
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
    </Box>
  );
};

export default FundManagerPage;
