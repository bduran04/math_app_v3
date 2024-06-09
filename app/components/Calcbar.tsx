'use client';

import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import * as mathsteps from 'mathsteps';

const Calcbar: React.FC = () => {
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState<string | null>(null);

  const handleSolve = () => {
    try {
      const steps = mathsteps.solveEquation(equation);
      if (steps.length > 0) {
        const lastStep = steps[steps.length - 1];
        setSolution(lastStep.newEquation.asAscii());
      } else {
        setSolution('No solution found.');
      }
    } catch (error) {
      setSolution('Invalid equation. Please enter a valid algebraic equation.');
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={2}>
      <Typography variant="h4" gutterBottom>
        Algebraic Equation Solver
      </Typography>
      <TextField
        label="Enter Equation"
        variant="outlined"
        value={equation}
        onChange={(e) => setEquation(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSolve}>
        Solve
      </Button>
      {solution && (
        <Typography variant="h6" color="textSecondary" style={{ marginTop: '20px' }}>
          Solution: {solution}
        </Typography>
      )}
    </Box>
  );
};

export default Calcbar;
