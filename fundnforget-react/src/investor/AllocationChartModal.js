import React from 'react';
import { Modal, Box, Typography, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AllocationChartModal = ({ open, onClose, allocations }) => {
  const data = {
    labels: allocations ? allocations.map(allocation => allocation.crypto) : [],
    datasets: [
      {
        data: allocations ? allocations.map(allocation => allocation.percentage) : [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'top',
      },
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold',
          size: 14,
        },
        formatter: (value) => `${value}%`,
      },
    },
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: 4,
          borderRadius: 2,
          boxShadow: 24,
          width: '400px',
        }}
      >
        <Typography variant="h6">Allocation Chart</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <Box>
          <Pie data={data} options={options} />
        </Box>
      </Box>
    </Modal>
  );
};

export default AllocationChartModal;
