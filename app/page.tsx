'use client';
import React from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import Link from "next/link";
import calculator from "../assets/watercolor-calculator-clip-art-png.webp";
import Image from 'next/image';

const HomePage: React.FC = () => {
  return (
    <Grid container
      spacing={0}
      alignItems="center"
      className="hero">
      <Grid item xs={12} sm={6} md={6} lg={4}>
        <Box marginLeft={4}>
          <Typography variant="body1" paragraph align="left">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit dolore repellat quisquam, distinctio asperiores incidunt molestiae aperiam? Veritatis eius quaerat velit quis sit quia minima reprehenderit, placeat magnam aspernatur distinctio.
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={8}>
        <Image
          src={calculator}
          alt="calculator image"
          height={900}
        />
      </Grid>
    </Grid>
  );
};

export default HomePage;