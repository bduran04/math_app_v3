'use client';
import React from 'react';
import { Grid, Box, Typography, useMediaQuery, useTheme, Container, Button } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Define the HomePage component
const HomePage: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Colors to match your app's color scheme
  const colors = {
    background: '#fbf7ef',
    primary: '#f8b84e',
    text: '#2c2e33',
    lightText: '#6c757d'
  };

  const navigateToLogin = () => {
    router.push('/login');
  };

  const navigateToRegister = () => {
    router.push('/register');
  };

  return (
    <Box
      sx={{
        backgroundColor: colors.background,
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: { xs: 4, md: 0 } }}>
        <Grid
          container
          sx={{
            minHeight: { xs: 'auto', md: '100vh' },
            flexDirection: { xs: 'column-reverse', md: 'row' }
          }}
        >
          {/* Left-hand side container for text content */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: { xs: 'center', md: 'flex-start' },
              textAlign: { xs: 'center', md: 'left' },
              p: { xs: 2, sm: 4, md: 6 },
              mt: { xs: 4, md: 0 }
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem', lg: '4rem' },
                mb: 2,
                color: colors.text,
                lineHeight: 1.2
              }}
            >
              Meet Math Solver
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 400,
                mb: 4,
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                color: colors.lightText,
                maxWidth: '90%'
              }}
            >
              Your Personal Math Tutor - Anytime, Anywhere
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                mt: 2,
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              <Button
                variant="contained"
                onClick={navigateToLogin}
                sx={{
                  bgcolor: colors.primary,
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: 1,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  '&:hover': {
                    bgcolor: '#e0a542',
                  },
                  boxShadow: 'none'
                }}
              >
                Sign In
              </Button>

              <Button
                variant="outlined"
                onClick={navigateToRegister}
                sx={{
                  color: colors.primary,
                  borderColor: colors.primary,
                  px: 4,
                  py: 1.5,
                  borderRadius: 1,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  '&:hover': {
                    borderColor: '#e0a542',
                    bgcolor: 'rgba(248, 184, 78, 0.05)'
                  }
                }}
              >
                Register
              </Button>
            </Box>
          </Grid>

          {/* Right-hand side container for the image */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: { xs: 2, md: 4 }
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: { xs: '300px', sm: '400px', md: '500px', lg: '600px' },
                maxWidth: { xs: '90%', sm: '80%', md: '100%' }
              }}
            >
              {/* Replace the img tag with Next.js Image component for optimization */}
              <Box
                component="img"
                src='/yellow-calc_3.png' // Update path to your public directory
                alt="Math Solver Calculator"
                sx={{
                  objectFit: 'contain',
                  width: '100%',
                  height: '100%',
                  maxHeight: { xs: '300px', sm: '400px', md: '500px', lg: '600px' }
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;