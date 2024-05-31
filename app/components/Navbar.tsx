import { AppBar, Toolbar, Grid, Button, Box } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import logo from "../../assets/math_solver_black.png";
import PersonIcon from '@mui/icons-material/Person';

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
    <AppBar position="static" style={{ backgroundColor: 'transparent' }}>
      <Toolbar style={{ minHeight: '48px', paddingLeft: '1rem', paddingRight: '1rem' }} disableGutters>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Link legacyBehavior href={home.path}>
              <a
                id={home.title + "-link"}
                className="nav-link mx-2"
                aria-describedby={home.describedBy}
              >
                <Image src={home.image} alt={home.title} height={55} style={{ marginLeft: "1rem" }} />
              </a>
            </Link>
          </Grid>
          <Grid item>
            <Link
              key={login.title}
              href={login.path}
              id={login.title + "-link"}
              className="nav-link mx-2"
              color="inherit"
              aria-describedby={login.describedBy}
            >
              <Button color="inherit" startIcon={<PersonIcon />} className="text-black" style={{ color: "#2c2e33" }}>
                Sign In
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
