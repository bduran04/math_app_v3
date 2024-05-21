'use client';
import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import Image from 'next/image';
import calculator from '../assets/watercolor-calculator-clip-art-png.webp';

// Define the HomePage component
const HomePage: React.FC = () => {
  return (
    // Main container with Tailwind classes for the background image and layout
    <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: `url(${calculator.src})` }}>
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-white bg-opacity-80"></div>
      <Grid container className="relative h-full">
        {/* Left-hand side container for the "welcome" text */}
        <Grid item xs={12} sm={6} md={6} lg={6} className="flex items-center justify-center">
          <Box className="p-4">
            <Typography variant="h1" component="h1" className="text-newFont font-bold">
              Lorem ipsum dolor sit 
            </Typography>
          </Box>
        </Grid>
        {/* Right-hand side container for the additional text content */}
        <Grid item xs={12} sm={6} md={6} lg={6} className="flex items-center">
          <Box className="ml-4">
            <Typography variant="body1" paragraph align="left">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit dolore repellat quisquam, distinctio asperiores incidunt molestiae aperiam? Veritatis eius quaerat velit quis sit quia minima reprehenderit, placeat magnam aspernatur distinctio.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage;

