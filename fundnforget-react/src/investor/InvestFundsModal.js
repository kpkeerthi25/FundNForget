import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StyledButton from '../components/StyledButton';
import InvestorDataService from '../service/InvestorService';
import { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import FxConversionService from '../service/FxConversionService';
import FundManagerService from '../service/FundManagerService';

const InvestFundsModal = ({ open, onClose, fundManager }) => {
  const { user, getEthersProvider } = usePrivy();
  const [currencies, setCurrencies] = useState([]);
  const [amounts, setAmounts] = useState({});

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const provider = getEthersProvider()
        const walletAddress = await provider.getSigner().getAddress();
        const nativeBalance = ethers.utils.formatEther(await provider.getBalance(walletAddress));

        const tokens = [
          { address: '0x4200000000000000000000000000000000000006', symbol: 'USDC', decimals: 6 },
          { address: '0x6021D8Cc4388f917fc75766dA67eC54A1b4e4Cc6', symbol: 'SynUNI', decimals: 6 },
        ];

        const tokenBalances = await Promise.all(
          tokens.map(async (token) => {
            const erc20Abi = [
              'function balanceOf(address) view returns (uint256)',
              'function decimals() view returns (uint8)',
            ];
            const contract = new ethers.Contract(token.address, erc20Abi, provider);
            const balance = await contract.balanceOf(walletAddress);
            return {
              currency: token.symbol,
              balance: ethers.utils.formatUnits(balance, token.decimals),
            };
          })
        );

        setCurrencies([
          { id: 1, currency: 'ETH', balance: nativeBalance, usdtValue: await getTokenValueInUSDT('ETH', nativeBalance) },
          ...tokenBalances,
        ]);
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    };

    const getTokenValueInUSDT = async (symbol, balance) => {
      // Placeholder for API call to get token value in USDT
      // Replace with actual implementation
      const mockRates = { ETH: 2000, TOKEN1: 1.5, TOKEN2: 0.01 };
      return (mockRates[symbol] || 0) * balance;
    };

    fetchBalances();
  }, [getEthersProvider]);

  const handleAmountChange = (currency, value) => {
    setAmounts((prev) => ({ ...prev, [currency]: value }));
  };

  const handleInvest = () => {
    const x = transformObjectToArray(amounts)
    console.log("X", x)
    InvestorDataService.investFunds(getEthersProvider().getSigner(), fundManager, x);
    onClose();
  };

  function transformObjectToArray(obj) {
    return Object.entries(obj).map(([crypto, value]) => ({
      tokenAddress: FundManagerService.getContractAddress(crypto),
      value: parseFloat(value), // Ensure value is a number
    }));
  }
  

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
                <TableCell sx={{ fontWeight: 'bold', color: '#818CF8' }} align="center">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currencies.map((currency, index) => (
                <TableRow key={index}>
                  <TableCell>{currency.currency}</TableCell>
                  <TableCell align="center">{currency.balance}</TableCell>
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
