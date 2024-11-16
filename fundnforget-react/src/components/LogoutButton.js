import React from 'react';
import { Button, Box } from '@mui/material';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { useInvestor } from '../context/InvestorContext';
import InvestorService from '../service/InvestorService';
import FundManagerService from '../service/FundManagerService';

const LogoutButton = () => {
    const { logout, getEthersProvider } = usePrivy();
    const { setIsInvestor } = useInvestor();
    const navigate = useNavigate();

    const handleLogout = async() => {
        logout();             
        setIsInvestor(false); 
        navigate('/');       
    };

    const test = async() => {
        const walletAddress = await getEthersProvider().getSigner().getAddress()
        const strategies = await FundManagerService.fetchStrategies(walletAddress);
        
        // Find the strategy with the latest start date
        const latestStrategy = strategies.reduce((latest, strategy) =>
          new Date(strategy.startDate) > new Date(latest.startDate) ? strategy : latest
        );
        console.log(latestStrategy)
    }

    return (
        <Box>
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
            onClick={handleLogout}
        >
            Logout
        </Button>
        {/* <Button
            variant="contained"
            sx={{
                backgroundColor: '#818CF8',
                color: 'white',
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: '50px',
                '&:hover': { backgroundColor: '#6B72DF' },
            }}
            onClick={test}
        >
            Click
        </Button> */}
        </Box>
    );
};

export default LogoutButton;
