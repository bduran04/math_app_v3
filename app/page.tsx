'use client';
import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import calculator from '../assets/yellow-calc_3.png';

// Define the HomePage component
const HomePage: React.FC = () => {
  return (
    // Main container with the specified background color
    <div className="relative h-screen" style={{ backgroundColor: '#fbf7ef' }}>
      <Grid container className="relative h-full">
        {/* Left-hand side container for the heading and subheading text */}
        <Grid item xs={12} sm={6} md={6} lg={6} className="flex items-center justify-center">
          <Box className="p-4">
            <Typography variant="h1" className="font-bold">
              Meet Math Solver
            </Typography>
            <Typography variant="h5" className="mt-2">
            Your Personal Math Tutor - Anytime, Anywhere
            </Typography>
          </Box>
        </Grid>
        {/* Right-hand side container for the image */}
        <Grid item xs={12} sm={6} md={6} lg={6} className="flex items-center justify-center">
          <Box className="p-4 flex justify-center items-center">
            <img src={calculator.src} alt="Calculator" className="max-w-md h-auto object-contain" />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage;