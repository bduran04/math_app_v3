'use client';
import React, { useEffect } from 'react';
import Link from "next/link";
import MainLayout from '../layout';
import { TextField, Button, Grid, Typography, Box, IconButton, Divider } from "@mui/material";
import ArrowCircleLeftTwoToneIcon from '@mui/icons-material/ArrowCircleLeftTwoTone';
import GoogleIcon from '@mui/icons-material/Google'; // Import Google icon
import { login } from './actions';
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';

const supabase = createClient();

const Login: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Client-side listener setup for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      fetch('/api/authChange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, session }),
      });

      // Optional: Redirect after login or logout based on the event
      if (event === 'SIGNED_IN') {
        router.push('/dashboard'); // Redirect to dashboard after login
      } else if (event === 'SIGNED_OUT') {
        router.push('/login'); // Redirect to login page after logout
      }
    });

    // Cleanup on component unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

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
    }
  };

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
        sx={{ minHeight: "calc(100vh - 64px - 100px)", backgroundColor: "#fbf7ef", padding: 2 }}
        className="login"
      >
        <Box
          sx={{ maxWidth: "400px", width: "100%", textAlign: "center" }}
        >
          <Typography variant="h1" component="h1">
            Hello!
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom>
            Sign in to your account
          </Typography>
          <form className="login-form">
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
                  <a style={{ color: "#2c2e33" }}>Don&apos;t have an account? Sign Up</a>
                </Link>
              </Grid>
            </Grid>
          </form>

          <Divider sx={{ mb: 1 }}>or</Divider>

          <Button
            fullWidth
            variant="outlined"
            color="primary"
            sx={{ mt: 2, mb: 2 }}
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
          >
            Sign In with Google
          </Button>
        </Box>
      </Grid>
    </div>
  );
};

export default Login;
