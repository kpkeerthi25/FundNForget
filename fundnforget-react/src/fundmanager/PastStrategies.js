import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import FundManagerService from '../service/FundManagerService';

const PastAllocations = () => {
  const [pastAllocations, setPastAllocations] = useState([]);

  useEffect(() => {
    const fetchPastAllocations = async () => {
      try {
        const strategies = await FundManagerService.fetchStrategies();

        // Find the latest start date
        const latestStartDate = Math.max(
          ...strategies.map((strategy) => new Date(strategy.startDate).getTime())
        );

        // Exclude the strategy with the latest start date
        const filteredStrategies = strategies.filter(
          (strategy) =>
            new Date(strategy.startDate).getTime() !== latestStartDate
        );

        // Transform data to include an `id` for React keys
        const enrichedStrategies = filteredStrategies.map((strategy, index) => ({
          id: index + 1,
          avgDailyIncrease: null, // Placeholder for additional data if needed
          ...strategy,
        }));

        setPastAllocations(enrichedStrategies);
      } catch (error) {
        console.error('Error fetching strategies:', error);
      }
    };

    fetchPastAllocations();
  }, []);

  return (
    <Box sx={{ marginTop: 2, marginBottom: 4 }}>
      <Typography variant="h5">Past Strategies</Typography>

      {/* Past Allocations Table */}
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: '#818CF8' }}>
                Start Date
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#818CF8' }}>
                End Date
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#818CF8' }}>
                Allocations
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pastAllocations.map((allocation) => (
              <TableRow key={allocation.id}>
                <TableCell>{allocation.startDate}</TableCell>
                <TableCell>{allocation.endDate || 'Ongoing'}</TableCell>
                <TableCell>
                  <Stack direction="column" spacing={1}>
                    {allocation.allocations.map((item) => (
                      <Typography key={item.crypto}>
                        {item.crypto}: {item.percentage}%
                      </Typography>
                    ))}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PastAllocations;
