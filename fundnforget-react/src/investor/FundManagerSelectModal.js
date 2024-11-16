import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StyledButton from '../components/StyledButton';
import InvestorDataService from '../service/InvestorService';

const FundManagerSelectModal = ({ open, onSelect, onClose }) => {
  const [fundManagers, setFundManagers] = useState([]);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        const fetchedManagers = await InvestorDataService.fetchFundManagers();
        setFundManagers(fetchedManagers);
      };
      fetchData();
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1000px',
          bgcolor: 'white',
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <Typography variant="h5">Select Fund Manager</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#818CF8' }}>Wallet ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#818CF8' }} align="center">Subscribers</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#818CF8' }} align="center">Invested Value</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#818CF8' }} align="center">Current Value</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#818CF8' }} align="center">30d Performance (%)</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fundManagers.map((manager) => (
                <TableRow key={manager.id}>
                  <TableCell>{manager.walletId}</TableCell>
                  <TableCell align="center">{manager.subscriberCount}</TableCell>
                  <TableCell align="center">${manager.investedValue.toLocaleString()}</TableCell>
                  <TableCell align="center">${manager.currentValue.toLocaleString()}</TableCell>
                  <TableCell align="center">{manager.performance30d}%</TableCell>
                  <TableCell>
                    <StyledButton
                      variant="contained"
                      color="primary"
                      onClick={() => onSelect(manager.walletId)}
                    >
                      Subscribe
                    </StyledButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Modal>
  );
};

export default FundManagerSelectModal;
