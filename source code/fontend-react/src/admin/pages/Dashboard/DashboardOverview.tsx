import React from 'react';
import { useAppSelector } from '../../../Redux Toolkit/Store';
import { Box, Card, CardContent, Grid, Typography, CircularProgress } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import StorefrontIcon from '@mui/icons-material/Storefront';

const DashboardOverview = () => {
  const { adminCustomers, adminProducts, sellers } = useAppSelector((state) => state);

  // Check if any of the required data is still loading
  if (adminCustomers.loading || adminProducts.loading || sellers.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const stats = [
    {
      title: 'Total Customers',
      value: adminCustomers.customers.length,
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#fff' }} />,
      bgColor: '#1976d2'
    },
    {
      title: 'Total Products',
      value: adminProducts.products.length,
      icon: <LocalMallIcon sx={{ fontSize: 40, color: '#fff' }} />,
      bgColor: '#2e7d32'
    },
    {
      title: 'Total Sellers',
      value: sellers.sellers?.length || 0,
      icon: <StorefrontIcon sx={{ fontSize: 40, color: '#fff' }} />,
      bgColor: '#ed6c02'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ bgcolor: stat.bgColor, color: 'white' }}>
              <CardContent sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 3
              }}>
                <Box>
                  <Typography variant="h6" component="div">
                    {stat.title}
                  </Typography>
                  <Typography variant="h4">
                    {stat.value}
                  </Typography>
                </Box>
                {stat.icon}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardOverview;