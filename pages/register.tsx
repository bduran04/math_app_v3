import React from 'react';
import MainLayout from '../layout/mainLayout';
import { Grid, TextField, Button, Snackbar } from "@mui/material";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";


const Register: React.FC = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const router = useRouter();

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const register = async () => {
    if (password !== confirmPassword) {
      setSnackbarMessage('Passwords do not match');
      setSnackbarOpen(true);
      return;
    }

    const { data, error } = await supabase
      .from('Users')
      .insert([
        { firstName, lastName, email, password },
      ]);
    if (!error) {
      setSnackbarMessage('Registration Successful!');
      setSnackbarOpen(true);
      await router.push('/login');
    }
  }

  return (
    <MainLayout>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "calc(100vh - 64px - 100px)", margin: "auto", maxWidth: "400px" }}
        className="login"
      >
        <form
          className="register-form w-[100%]">
          <Grid item xs={12}>
            <TextField
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              label="First Name"
              fullWidth
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              label="Last Name"
              fullWidth
              required
              margin="normal" />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              label="Email Address"
              fullWidth
              required
              margin="normal" />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              label="Password"
              fullWidth
              required
              margin="normal" />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              label="Confirm Password"
              fullWidth
              required
              margin="normal" />
          </Grid>
          <Button
            variant="contained"
            onClick={async () => await register()}
            fullWidth
            sx={{ mt: 2, mb: 2 }}>
            Register
          </Button>
          <Grid container direction="column" alignItems="center" sx={{ mb: 2 }}>
            <Grid item>
              <Link legacyBehavior href="/login" passHref>
                <a style={{ color: "#0a4771" }}>Already have an account? Sign In</a>
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
      </Grid>
    </MainLayout>
  );
};

export default Register;