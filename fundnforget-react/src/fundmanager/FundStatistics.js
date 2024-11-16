import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Typography, Box, Grid, Paper } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import FundManagerService from '../service/FundManagerService';
import { usePrivy } from '@privy-io/react-auth';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FundStatistics = () => {
  // State definitions
  const [performanceData, setPerformanceData] = useState([]);
  const [numberOfSubscribers, setNumberOfSubscribers] = useState(0);
  const [totalFundValue, setTotalFundValue] = useState(0);
  const { logout, getEthersProvider } = usePrivy();
  const [investmentAmount, setInvestmentAmount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const signer = await getEthersProvider().getSigner()
        const walletAddress = await getEthersProvider().getSigner().getAddress()
        const fundPerformance = await FundManagerService.fetchFundPerformance(signer);
        setPerformanceData(fundPerformance);

        const { subscriberCount, investedValue, currentValue } = await FundManagerService.fetchFundStatistics(signer, walletAddress);
        setNumberOfSubscribers(subscriberCount);
        setInvestmentAmount(investedValue);
        setTotalFundValue(currentValue);
      } catch (error) {
        console.error('Error fetching fund statistics:', error);
      }
    };

    fetchData();
  }, []);

  // Prepare chart data
  const labels = performanceData.map((item) => item.date);
  const dataValues = performanceData.map((item) => item.value);
  const backgroundColors = dataValues.map((value) =>
    value >= 0 ? '#818CF8' : '#E25758'
  );

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Performance',
        data: dataValues,
        backgroundColor: backgroundColors,
        borderWidth: 1,
        barThickness: 20,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}%`,
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
        ticks: {
          autoSkip: true,
          maxRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Performance (%)',
        },
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  return (
    <Box sx={{ marginTop: 0, marginBottom: 4, paddingX: 2, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Fund Statistics
      </Typography>
      <Box sx={{ backgroundColor: 'white', padding: '10px', marginTop: '40px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ padding: 3, textAlign: 'center' }} elevation={0}>
              <Typography variant="h6"># of Active Subscribers</Typography>
              <Typography variant="h5" sx={{ color: '#818CF8' }}>
                {numberOfSubscribers}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ padding: 3, textAlign: 'center' }} elevation={0}>
              <Typography variant="h6">Invested Value</Typography>
              <Typography variant="h5" sx={{ color: '#818CF8' }}>
                ${investmentAmount.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Box sx={{ backgroundColor: 'white', paddingBottom: '10px', marginTop: '20px' }}>
          <Bar data={chartData} options={chartOptions} />
        </Box>
      </Box>
    </Box>
  );
};

export default FundStatistics;
