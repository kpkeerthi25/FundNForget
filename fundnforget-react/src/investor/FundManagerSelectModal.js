import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StyledButton from '../components/StyledButton';
import InvestorService from '../service/InvestorService';
import { usePrivy } from '@privy-io/react-auth';

const FundManagerSelectModal = ({ open, onSelect, onClose }) => {
  const [fundManagers, setFundManagers] = useState([]);
  const { getEthersProvider } = usePrivy();

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        const fetchedManagers = await InvestorService.fetchFundManagers(getEthersProvider().getSigner());
        console.log("FMS", fetchedManagers);

        // Adding hardcoded "Random" entry
        const randomManager = {
          id: 'random', // Unique ID for the hardcoded entry
          walletId: 'Random',
          subscriberCount: 'N/A',
          investedValue: 'N/A',
        };

        setFundManagers([randomManager, ...fetchedManagers]);
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
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {fundManagers.map((manager) => (
                <TableRow key={manager.id}>
                  <TableCell>{manager.walletId}</TableCell>
                  <TableCell align="center">{manager.subscriberCount}</TableCell>
                  <TableCell align="center">
                    {manager.investedValue === 'N/A' ? 'N/A' : `$${manager.investedValue.toLocaleString()}`}
                  </TableCell>
                  <TableCell>
                    <StyledButton
                      variant="contained"
                      color="primary"
                      onClick={() => onSelect(manager.walletId === 'Random' ? '0x0000000000000000000000000000000000000000' : manager.walletId)}
                    >
                      {manager.walletId === 'Random' ? 'Select Random' : 'Subscribe'}
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
