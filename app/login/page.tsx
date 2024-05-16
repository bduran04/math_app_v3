'use client';
import React from 'react';
import Link from "next/link";
import MainLayout from '../layout';
import { TextField, Button, Grid } from "@mui/material";

const Login: React.FC = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    // Handle form submission
    console.log({ email, password });
  };

  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "calc(100vh - 64px - 100px)", margin: "auto", maxWidth: "400px" }}
        className="login"
      >
        <form
          onSubmit={handleSubmit}
          className="login-form w-[100%]"
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
          >
            Sign In
          </Button>

          <Grid container direction="column" alignItems="center" sx={{ mb: 2 }}>
            <Grid item>
              <Link legacyBehavior href="/register" passHref>
                <a style={{ color: "#0a4771" }}>Don't have an account? Sign Up</a>
              </Link>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </>
  );
};

export default Login;
