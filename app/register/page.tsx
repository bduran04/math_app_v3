'use client';
import React, { useState } from 'react';
import { Grid, TextField, Button, Snackbar, Alert, Typography, Box, IconButton, Divider } from "@mui/material";
import Link from "next/link";
import ArrowCircleLeftTwoToneIcon from '@mui/icons-material/ArrowCircleLeftTwoTone';
import GoogleIcon from '@mui/icons-material/Google';
import { signup } from '../login/actions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const Register: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const validatePasswordConfirmation = (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validatePasswordConfirmation(password, confirmPassword)) {
      setError('Passwords do not match');
      setSnackbarSeverity('error');
      setSnackbarMessage('Passwords do not match');
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData(event.currentTarget);

    try {
      // Remove confirmPassword from formData
      formData.delete('confirmPassword');

      await signup(formData);
      // Handle successful signup
      setSnackbarSeverity('success');
      setSnackbarMessage('Signup successful!');
      setSnackbarOpen(true);
    } catch (error) {
      // Handle signup error
      console.error('Signup error', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Signup failed. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/api/auth/callback`,
        },
      });

      if (error) throw error;
      // The user will be redirected to Google for authentication
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Google sign-in failed. Please try again.');
      setSnackbarOpen(true);
    }
  };

  return (
    <div style={{ backgroundColor: "#fbf7ef" }}>
      <Link legacyBehavior href="/login" passHref>
        <IconButton style={{ position: 'absolute', left: '16px', backgroundColor: "inherit" }}>
          <ArrowCircleLeftTwoToneIcon sx={{ color: "#aba3ff" }} />
        </IconButton>
      </Link>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "calc(100vh - 64px - 100px)" }}
        className="register"
      >
        <Box
          sx={{ maxWidth: "400px", width: "100%", textAlign: 'center', padding: 1 }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Create your account
          </Typography>
          <form
            className="register-form"
            onSubmit={handleSubmit}
          >
            <Grid item xs={12}>
              <TextField
                name="first_name"
                label="First Name"
                id="first_name"
                autoFocus
                variant="outlined"
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="last_name"
                label="Last Name"
                variant='outlined'
                id="last_name"
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                type="email"
                id="email"
                variant='outlined'
                label="Email Address"
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                type="password"
                id="password"
                label="Password"
                variant='outlined'
                fullWidth
                required
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="confirmPassword"
                type="password"
                variant='outlined'
                label="Confirm Password"
                fullWidth
                required
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Grid>
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ mt: 2, mb: 2 }}
            >
              Register
            </Button>
            <Grid container direction="column" alignItems="center" sx={{ mb: 2 }}>
              <Grid item>
                <Link legacyBehavior href="/login" passHref>
                  <a style={{ color: "#2c2e33" }}>Already have an account? Sign In</a>
                </Link>
              </Grid>
            </Grid>

            <Divider sx={{ mb: 1 }}>or</Divider>

            <Button
              variant="outlined"
              fullWidth
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignIn}
            >
              Register with Google
            </Button>
          </form>
        </Box>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Register;
