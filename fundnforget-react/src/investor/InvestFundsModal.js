import React, { useState } from 'react';
import { Modal, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StyledButton from '../components/StyledButton';
import InvestorDataService from '../service/InvestorService';

const currencies = [
  {
    id: 1,
    currency: 'BTC',
    balance: 2.5,
    usdtValue: 75000,
  },
  {
    id: 2,
    currency: 'ETH',
    balance: 10,
    usdtValue: 20000,
  },
  {
    id: 3,
    currency: 'USDT',
    balance: 5000,
    usdtValue: 5000,
  },
];

const InvestFundsModal = ({ open, onClose, fundManager }) => {
  const [amounts, setAmounts] = useState({});

  const handleAmountChange = (currency, value) => {
    setAmounts((prev) => ({ ...prev, [currency]: value }));
  };

  const handleInvest = () => {
    InvestorDataService.investFunds(fundManager, currencies)
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          bgcolor: 'white',
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <Typography variant="h5">Invest Funds</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#818CF8' }}>Currency</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#818CF8' }} align="center">Balance</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#818CF8' }} align="center">USDT Value</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#818CF8' }} align="center">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currencies.map((currency) => (
                <TableRow key={currency.id}>
                  <TableCell>{currency.currency}</TableCell>
                  <TableCell align="center">{currency.balance}</TableCell>
                  <TableCell align="center">${currency.usdtValue.toLocaleString()}</TableCell>
                  <TableCell align="center">
                    <TextField
                      variant="outlined"
                      size="small"
                      type="number"
                      value={amounts[currency.currency] || ''}
                      onChange={(e) => handleAmountChange(currency.currency, e.target.value)}
                      placeholder="Enter amount"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'right', marginTop: 4 }}>
          <StyledButton variant="contained" color="primary" onClick={handleInvest}>
            Invest
          </StyledButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default InvestFundsModal;
