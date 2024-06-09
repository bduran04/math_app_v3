'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Grid, Button } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../assets/math_solver_black.png';
import PersonIcon from '@mui/icons-material/Person';

interface NavLink {
  title: string;
  path: string;
  describedBy: string;
  image?: typeof logo;
}

const home: NavLink = {
  title: 'Home',
  path: '/',
  image: logo,
  describedBy: 'home-link',
};

const login: NavLink = {
  title: 'Login',
  path: '/login',
  describedBy: 'login-link',
};

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userData = document.cookie.split('; ').find(row => row.startsWith('user-data='));
    setIsLoggedIn(!!userData);
  }, []);

  const handleLogout = async () => {
    const response = await fetch('/api/logout', {
      method: 'POST',
    });

    if (response.ok) {
      setIsLoggedIn(false);
      router.push('/');
    } else {
      console.error('Failed to logout');
    }
  };

  return (
    <AppBar position="static" style={{ backgroundColor: 'transparent' }}>
      <Toolbar style={{ minHeight: '48px', paddingLeft: '1rem', paddingRight: '1rem' }} disableGutters>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Link href={home.path} passHref legacyBehavior>
              <a id={home.title + '-link'} className="nav-link mx-2" aria-describedby={home.describedBy}>
                {home.image && <Image src={home.image} alt={home.title} height={55} style={{ marginLeft: '1rem' }} />}
              </a>
            </Link>
          </Grid>
          <Grid item>
            {isLoggedIn ? (
              <Button
                color="inherit"
                startIcon={<PersonIcon />}
                className="text-black"
                style={{ color: '#2c2e33' }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <Link href={login.path} passHref legacyBehavior>
                <Button
                  color="inherit"
                  startIcon={<PersonIcon />}
                  className="text-black"
                  style={{ color: '#2c2e33' }}
                  id={login.title + '-link'}
                  aria-describedby={login.describedBy}
                >
                  Sign In
                </Button>
              </Link>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
