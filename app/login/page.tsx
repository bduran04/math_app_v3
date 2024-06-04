'use client';
import React from 'react';
import Link from "next/link";
import MainLayout from '../layout';
import { TextField, Button, Grid, Typography, Box, IconButton } from "@mui/material";
import ArrowCircleLeftTwoToneIcon from '@mui/icons-material/ArrowCircleLeftTwoTone';
import { login } from './actions';

const Login: React.FC = () => {

  return (
    <div style={{ backgroundColor: "#fbf7ef" }}>
      <Link legacyBehavior href="/" passHref>
        <IconButton style={{ position: 'absolute', left: '16px', backgroundColor: "inherit" }}>
          <ArrowCircleLeftTwoToneIcon sx={{ color: "#aba3ff" }} />
        </IconButton>
      </Link>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "calc(100vh - 64px - 100px)", backgroundColor: '#fbf7ef', padding: 2 }}
        className="login"
      >
        <Box
          sx={{ maxWidth: "400px", width: "100%", textAlign: 'center' }}
        >
          <Typography variant="h1" component="h1">
            Hello!
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom>
            Sign in to your account
          </Typography>
          <form
            className="login-form"
          >
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
            </Grid>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              formAction={login}
            >
              Sign In
            </Button>

            <Grid container direction="column" alignItems="center" sx={{ mb: 2 }}>
              <Grid item>
                <Link legacyBehavior href="/register" passHref>
                  <a style={{ color: "#2c2e33" }}>Don't have an account? Sign Up</a>
                </Link>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Grid>
    </div>
  );
};

export default Login;

