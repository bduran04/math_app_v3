'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AppBar, Toolbar, Grid, Button, Box } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../assets/math_solver_black.png';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { createClient } from '../utils/supabase/client';

// Define the types for the user data
interface UserData {
  id: string;
  email: string;
  fullName: string;
  lastName: string;
}

interface NavbarClientProps {
  initialUserData: UserData | null;
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

const dashboard = {
  title: 'Dashboard',
  path: '/dashboard',
  describedBy: 'dashboard-link',
};

const login = {
  title: 'Login',
  path: '/login',
  describedBy: 'login-link',
};

const NavbarClient: React.FC<NavbarClientProps> = ({ initialUserData }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!initialUserData);

  useEffect(() => {
    setIsLoggedIn(!!initialUserData);
  }, [initialUserData]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/'); // Redirect to the home page
        window.location.reload(); // Reload to clear any client-side state
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Check if we're on the index/home page
  const isHomePage = pathname === '/';
  
  // If we're on the home page, don't render the navbar
  if (isHomePage) {
    return null;
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

          {/* Right side: Solve, Study, and Auth buttons */}
          <Grid item sx={{ flexGrow: 1 }}>
            <Box display="flex" justifyContent="flex-end" alignItems="center">
              {isLoggedIn && (
                <>
                  <Link href={dashboard.path} passHref legacyBehavior>
                    <Button color="inherit" className="text-black" sx={{ marginRight: 2 }}>
                      Solve
                    </Button>
                  </Link>
                  <Link href={study_guide.path} passHref legacyBehavior>
                    <Button color="inherit" className="text-black" sx={{ marginRight: 2 }}>
                      Study
                    </Button>
                  </Link>
                </>
              )}
              {isLoggedIn ? (
                <Button
                  color="inherit"
                  startIcon={<AccountCircleRoundedIcon />}
                  className="text-black"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              ) : (
                <Link href={login.path} passHref legacyBehavior>
                  <Button
                    color="inherit"
                    startIcon={<AccountCircleRoundedIcon />}
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