'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Grid, Button, Box } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../assets/math_solver_black.png';
import PersonIcon from '@mui/icons-material/Person';
import { createClient } from '../utils/supabase/client';

interface NavbarClientProps {
  initialUserData: UserData | null;
}

interface UserData {
  id: string;
  email: string;
  fullName: string;
  lastName: string;
}

const home = {
  title: 'Home',
  path: '/',
  image: logo,
  describedBy: 'home-link',
};

const study_guide = {
  title: 'Study Guide',
  path: '/study-guide',
  describedBy: 'study-guide-link',
};

const login = {
  title: 'Login',
  path: '/login',
  describedBy: 'login-link',
};

const NavbarClient: React.FC<NavbarClientProps> = ({ initialUserData }) => {
  const router = useRouter();
  const supabase = createClient();
  const [isLoggedIn, setIsLoggedIn] = useState(!!initialUserData);

  useEffect(() => {
    setIsLoggedIn(!!initialUserData);
  }, [initialUserData]);

  //need loading state. server component that creates a suspense boundary; look at next docs for suspense boundaries  
  const handleLogout = async () => {
    // startTransition(async () => {
      await fetch('/api/logout', {
        method: 'POST',
      })
      router.push('/') // Redirect to the login page or any other page after logout
      window.location.reload();
    // })
  }

  return (
    <AppBar position="static" style={{ backgroundColor: 'inherit' }}>
      <Toolbar style={{ minHeight: '48px', paddingLeft: '1rem', paddingRight: '1rem' }} disableGutters>
        <Grid container alignItems="center" justifyContent="space-between">
          {/* Left side: Logo */}
          <Grid item>
            <Link href={home.path} passHref legacyBehavior>
              <a id={home.title + '-link'} className="nav-link mx-2" aria-describedby={home.describedBy}>
                {home.image && <Image src={home.image} alt={home.title} height={55} style={{ marginLeft: '1rem' }} />}
              </a>
            </Link>
          </Grid>

          {/* Right side: Study and Auth buttons */}
          <Grid item sx={{ flexGrow: 1 }}>
            <Box display="flex" justifyContent="flex-end" alignItems="center">
              {isLoggedIn && (
                <Link href={study_guide.path} passHref legacyBehavior>
                  <Button color="inherit" className="text-black" sx={{ marginRight: 2 }}>
                    Study
                  </Button>
                </Link>
              )}
              {isLoggedIn ? (
                <Button
                  color="inherit"
                  startIcon={<PersonIcon />}
                  className="text-black"
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
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default NavbarClient;
