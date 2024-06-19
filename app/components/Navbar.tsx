'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Grid, Button } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../assets/math_solver_black.png';
import PersonIcon from '@mui/icons-material/Person';
import { createClient } from "../utils/supabase/server";
import { cookies } from 'next/headers';

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
  const supabase = createClient();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);

      if (session) {
        document.cookie = `user-data=${JSON.stringify(session.user)}; path=/`;
      }
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Failed to logout', error);
    } else {
      cookies().delete('user-data');
      setIsLoggedIn(false);
      router.push('/');
    }
  };

  return (
    <AppBar position="static" style={{ backgroundColor: 'inherit' }}>
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
