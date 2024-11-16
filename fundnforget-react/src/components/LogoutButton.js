import React from 'react';
import { Button } from '@mui/material';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { useInvestor } from '../context/InvestorContext';

const LogoutButton = () => {
    const { logout } = usePrivy();
    const { setIsInvestor } = useInvestor();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();             
        setIsInvestor(false); 
        navigate('/');        
    };

    return (
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
            onClick={logout}
        >
            Logout
        </Button>
    );
};

export default LogoutButton;
