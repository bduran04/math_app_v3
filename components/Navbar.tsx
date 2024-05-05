import { AppBar, Toolbar, Box, Typography } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import logo from "../assets/math_solver.png";
import styles from "../styles"

const home = {
  title: "Home",
  path: "/",
  image: logo,
  describedBy: "home-link",
};

const Navbar = () => {
  return (
    <Box className="nav">
      <AppBar position="static">
        <Toolbar disableGutters className="my-4">
          <Link legacyBehavior href={home.path}>
            <a
              id={home.title + "-link"}
              className="nav-link mx-4"
              aria-describedby={home.describedBy}
            >
              <Image src={home.image} alt={home.title} height={75} className={styles.logo}/>
            </a>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;