"use client"; // Mark this component as client-side
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ExampleEquations from 'app/components/ExampleEquations';

interface UserData {
  id: string;
  email: string;
  fullName: string;
  lastName: string;
}

interface DashboardClientProps {
  userData: UserData;
}

const DashboardClient: React.FC<DashboardClientProps> = ({ userData }) => {
  const firstName = userData.fullName;

  return (
    <div style={{ backgroundColor: "#fbf7ef" }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '1rem' }}>
          <Box sx={{ marginBottom: '2rem' }}>
            <Typography variant="h4">
              Hello {firstName}!
            </Typography>
          </Box>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <ExampleEquations userId={userData.id} />
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default DashboardClient;
