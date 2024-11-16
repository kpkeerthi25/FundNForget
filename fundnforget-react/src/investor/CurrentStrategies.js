import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import StyledButton from '../components/StyledButton';
import FundManagerSelectModal from './FundManagerSelectModal';
import AllocationChartModal from './AllocationChartModal';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InvestorDataService from '../service/InvestorService';
import InvestFundsModal from './InvestFundsModal';

const CurrentStrategies = () => {
  const [allocations, setAllocations] = useState([]);
  const [chartModalOpen, setChartModalOpen] = useState(false);
  const [fundManagerModalOpen, setFundManagerModalOpen] = useState(false);
  const [investFundsModalOpen, setInvestFundsModalOpen] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [selectedFundManager, setSelectedFundManager] = useState(null);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const walletId = '0x0868574DC2E9cc0581598006CC84387D556EBF46';
        const strategies = await InvestorDataService.getCurrentStrategies(walletId);
        setAllocations(strategies);
      } catch (error) {
        console.error('Error fetching strategies:', error);
      }
    };

    fetchStrategies();
  }, []);

  const handleOpenChartModal = (allocation) => {
    setSelectedAllocation(allocation.allocations);
    setChartModalOpen(true);
  };

  const handleCloseChartModal = () => {
    setChartModalOpen(false);
    setSelectedAllocation(null);
  };

  const handleCashOut = async (subscriptionId) => {
    try {
      const walletId = '0x0868574DC2E9cc0581598006CC84387D556EBF46';
      const result = await InvestorDataService.cashOutStrategy(walletId, subscriptionId);
      if (result.success) {
        alert(`Successfully cashed out subscription: ${subscriptionId}`);
        setAllocations((prev) => prev.filter((item) => item.subscriptionId !== subscriptionId));
      } else {
        alert(`Cash out failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error during cash out:', error);
      alert('An error occurred during cash out.');
    }
  };

  const handleInvestMore = () => {
    setFundManagerModalOpen(true);
  };

  const handleFundManagerSelect = (fundManagerWallet) => {
    setSelectedFundManager(fundManagerWallet);
    setFundManagerModalOpen(false);
    setInvestFundsModalOpen(true);
  };

  const handleCloseInvestFundsModal = () => {
    setInvestFundsModalOpen(false);
    setSelectedFundManager(null);
  };

  const totalInvested = allocations.reduce((sum, record) => sum + record.investedAmount, 0);
  const totalCurrent = allocations.reduce((sum, record) => sum + record.currentAmount, 0);

  return (
    <Box sx={{ marginBottom: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Current Strategies</Typography>
        <Box>
          <StyledButton onClick={() => {
            
          }}>Explore in BlockScout</StyledButton>
          <StyledButton onClick={handleInvestMore}>Invest More</StyledButton>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Subscription ID</TableCell>
              <TableCell>Fund Manager</TableCell>
              <TableCell align="center">Invested Amount</TableCell>
              <TableCell align="center">Current Value</TableCell>
              <TableCell align="center">Allocation</TableCell>
              <TableCell align="center">Cash Out</TableCell>
              <TableCell align="center">Start Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allocations.map((allocation) => (
              <TableRow key={allocation.id}>
                <TableCell>{allocation.subscriptionId}</TableCell>
                <TableCell>{allocation.walletId}</TableCell>
                <TableCell align="center">${allocation.investedAmount.toLocaleString()}</TableCell>
                <TableCell align="center">${allocation.currentAmount.toLocaleString()}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleOpenChartModal(allocation)}>
                    <InsertChartIcon color="primary" />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleCashOut(allocation.subscriptionId)}>
                    <AttachMoneyIcon color="success" />
                  </IconButton>
                </TableCell>
                <TableCell align="center">{allocation.startDate}</TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell colSpan={2} align="right">
                <b>Total:</b>
              </TableCell>
              <TableCell align="center"><b>${totalInvested.toLocaleString()}</b></TableCell>
              <TableCell align="center"><b>${totalCurrent.toLocaleString()}</b></TableCell>
              <TableCell colSpan={3}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <AllocationChartModal 
        open={chartModalOpen} 
        onClose={handleCloseChartModal} 
        allocations={selectedAllocation} 
      />

      <FundManagerSelectModal 
        open={fundManagerModalOpen} 
        onSelect={handleFundManagerSelect} 
        onClose={() => setFundManagerModalOpen(false)} 
      />

      <InvestFundsModal 
        open={investFundsModalOpen} 
        fundManager={selectedFundManager} 
        onClose={handleCloseInvestFundsModal} 
      />
    </Box>
  );
};

export default CurrentStrategies;