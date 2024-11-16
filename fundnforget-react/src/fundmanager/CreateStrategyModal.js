import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, IconButton, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StyledButton from '../components/StyledButton'; // Assuming StyledButton is imported here
import FundManagerService from '../service/FundManagerService';

const CreateStrategyModal = ({ open, onClose }) => {
  const [currencies, setCurrencies] = useState([
    { id: 1, currency: '', allocation: '' },
  ]);
  const [availableCurrencies] = useState(['BTC', 'ETH', 'XRP', 'ADA', 'LTC']); // Static list for now
  const [totalAllocation, setTotalAllocation] = useState(0);

  const handleCurrencyChange = (index, value) => {
    const newCurrencies = [...currencies];
    newCurrencies[index].currency = value;
    setCurrencies(newCurrencies);
  };

  const handleAllocationChange = (index, value) => {
    const newCurrencies = [...currencies];
    newCurrencies[index].allocation = value;
    setCurrencies(newCurrencies);

    // Recalculate total allocation
    const total = newCurrencies.reduce((sum, currency) => sum + (parseFloat(currency.allocation) || 0), 0);
    setTotalAllocation(total);
  };

  const addCurrency = () => {
    setCurrencies([...currencies, { id: currencies.length + 1, currency: '', allocation: '' }]);
  };

  const removeCurrency = (index) => {
    const newCurrencies = currencies.filter((_, i) => i !== index);
    setCurrencies(newCurrencies);

    // Recalculate total allocation after removing
    const total = newCurrencies.reduce((sum, currency) => sum + (parseFloat(currency.allocation) || 0), 0);
    setTotalAllocation(total);
  };

  const handleSubmit = () => {
    // Validate total allocation
    if (totalAllocation !== 100) {
      alert('Total allocation must be 100%');
      return;
    }
    FundManagerService.createStrategy(currencies)
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: 4,
        borderRadius: 2,
        boxShadow: 24,
        width: '400px',
      }}>
        {/* Close icon and heading in the same line and centered */}
        <Grid container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Update Strategy
            </Typography>
            <IconButton
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
        </Grid>

        {currencies.map((currency, index) => (
          <Grid container spacing={2} key={currency.id} sx={{ marginBottom: 2 }}>
            <Grid item xs={5}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={currency.currency}
                  label="Currency"
                  onChange={(e) => handleCurrencyChange(index, e.target.value)}
                >
                  {availableCurrencies.map((availableCurrency) => (
                    <MenuItem key={availableCurrency} value={availableCurrency}>
                      {availableCurrency}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={5}>
              <TextField
                fullWidth
                label="Allocation (%)"
                type="number"
                value={currency.allocation}
                onChange={(e) => handleAllocationChange(index, e.target.value)}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>

            <Grid item xs={2}>
              <IconButton
                onClick={() => removeCurrency(index)}
                sx={{ color: 'red' }}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        {/* Button Row for Add Currency and Submit */}
        <Grid container spacing={2} sx={{ marginTop: 2, justifyContent: 'space-between', alignItems: 'center' }}>
          <Grid item sx={{ display: 'flex', justifyContent: 'flex-start', width: 'auto' }}>
            <StyledButton
              onClick={addCurrency}
            >
              Add Currency
            </StyledButton>
          </Grid>

          <Grid item sx={{ display: 'flex', justifyContent: 'flex-end', width: 'auto' }}>
            <StyledButton
              onClick={handleSubmit}
            >
              Save
            </StyledButton>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default CreateStrategyModal;
