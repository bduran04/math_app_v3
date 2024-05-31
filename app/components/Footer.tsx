import React from 'react';
import { Grid, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <>
      <Grid
        container
        padding={2}
        direction="column"
        alignItems="center"
        className="footer"
        style={{ backgroundColor: '#fbf7ef' }}
      >
        <Typography>
          &copy; {new Date().getFullYear()} Math Solver
        </Typography>
      </Grid>
    </>
  );
};

export default Footer;

