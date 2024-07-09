import React, { ReactNode } from 'react';
import ServerNavbar from './components/ServerNavbar';
import Footer from './components/Footer';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import './globals.css';
import { cookies } from 'next/headers';

interface MainLayoutProps {
  children: ReactNode;
  initialUserData: UserData | null;
}

interface UserData {
  id: string;
  email: string;
  fullName: string;
  lastName: string;
}

const getUserData = (): UserData | null => {
  const cookieStore = cookies();
  const userDataCookie = cookieStore.get('user-data');

  if (userDataCookie) {
    return JSON.parse(userDataCookie.value);
  }

  return null;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children, initialUserData }) => {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <ServerNavbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const initialUserData = getUserData();
  return <MainLayout initialUserData={initialUserData}>{children}</MainLayout>;
}
