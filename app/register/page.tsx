'use client';
import React, { useState } from 'react';
import { Grid, TextField, Button, Snackbar, Typography, Box, IconButton } from "@mui/material";
import Link from "next/link";
import ArrowCircleLeftTwoToneIcon from '@mui/icons-material/ArrowCircleLeftTwoTone';
import { supabase } from "../utils/supabaseClient";

const Register: React.FC = () => {
  const [first_name, setFirstName] = useState<string>('');
  const [last_name, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setSnackbarMessage('Passwords do not match');
      setSnackbarOpen(true);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('Users')
        .insert([{ first_name, last_name, email, password }]);

      if (error) {
        setSnackbarMessage('Registration failed. Please try again.');
        setSnackbarOpen(true);
      } else {
        // Registration successful, redirect or perform any other action
      }
    } catch (error) {
      setSnackbarMessage('An error occurred while registering. Please try again later.');
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
            onSubmit={handleSubmit}
            className="register-form"
          >
            <Grid item xs={12}>
              <TextField
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
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
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                label="Password"
                variant='outlined'
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                variant='outlined'
                label="Confirm Password"
                fullWidth
                required
                margin="normal"
              />
            </Grid>
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
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              message={snackbarMessage}
              action={
                <Button color="secondary" size="small" onClick={handleCloseSnackbar}>
                  Close
                </Button>
              }
            />
          </form>
        </Box>
      </Grid>
    </div>
  );
};

export default Register;
