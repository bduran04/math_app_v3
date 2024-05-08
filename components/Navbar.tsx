import { AppBar, Toolbar, Grid, Button, Box } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import logo from "../assets/math_solver_white.png";
import LoginIcon from '@mui/icons-material/Login';

const home = {
  title: "Home",
  path: "/",
  image: logo,
  describedBy: "home-link",
};

const login = {
  title: "Login",
  path: "/login",
  describedBy: "login-link",
};

const Navbar = () => {
  return (
      <AppBar position="static">
        <Toolbar disableGutters >
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Link legacyBehavior href={home.path}>
                <a
                  id={home.title + "-link"}
                  className="nav-link mx-4"
                  aria-describedby={home.describedBy}
                >
                  <Image src={home.image} alt={home.title} height={75} style={{ marginLeft: "2rem" }} />
                </a>
              </Link>
            </Grid>
            <Grid item>
              <Link
                key={login.title}
                href={login.path}
                id={login.title + "-link"}
                className="nav-link mx-4"
                color="inherit"
                aria-describedby={login.describedBy}>
                <Button color="inherit" startIcon={<LoginIcon />} className="text-white" style={{ marginRight: "2rem", color: "#f5f5f5" }}>
                  Login
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
  );
};

export default Navbar;
