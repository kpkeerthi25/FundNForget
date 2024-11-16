import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import StyledButton from '../components/StyledButton';
import CreateStrategyModal from './CreateStrategyModal';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import FundManagerService from '../service/FundManagerService';
import { usePrivy } from '@privy-io/react-auth';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const CurrentAllocations = () => {
  const [allocations, setAllocations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { user, getEthersProvider } = usePrivy();


  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const walletAddress = await getEthersProvider().getSigner().getAddress()
        const strategies = await FundManagerService.fetchStrategies(walletAddress);
        
        console.log("Fet Str", strategies)

        if (strategies.length){
          const latestStrategy = strategies[0]
          setAllocations(latestStrategy);
        }
      } catch (error) {
        console.error('Error fetching strategies:', error);
      }
    };

    fetchStrategies();
  }, []);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  // Prepare data for the Pie chart
  const data = {
    labels: allocations.map((allocation) => allocation.crypto + ' %'),
    datasets: [
      {
        data: allocations.map((allocation) => parseFloat(allocation.percentage)),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
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
        formatter: (value) => `${value}%`, // Format the label as a percentage
      },
    },
  };

  return (
    <Box>
      {/* Header and Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">
          Current Strategy
        </Typography>
        <StyledButton onClick={handleOpenModal}>Update Strategy</StyledButton>
      </Box>

      {/* Pie Chart */}
      <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'center', paddingX: '100px', backgroundColor: 'white', paddingY: '40px' }}>
        {allocations.length > 0 ? (
          <Pie data={data} options={options} />
        ) : (
          <Typography variant="h6" sx={{ color: '#888', textAlign: 'center' }}>
            Loading data...
          </Typography>
        )}
      </Box>

      {/* Allocation Modal */}
      <CreateStrategyModal open={modalOpen} onClose={handleCloseModal} />
    </Box>
  );
};

export default CurrentAllocations;
