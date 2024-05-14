import React, { ReactNode } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"
import { createTheme, ThemeProvider } from "@mui/material/styles";
import './globals.module.css'

interface MainLayoutProps {
  children: ReactNode;
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#0a4771", 
    },
    secondary: {
      main: "#EC954F",
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ff9800",
    },
    info: {
      main: "#2196f3",
    },
    success: {
      main: "#4caf50",
    },
    background: {
      default: "#f5f5f5",
    }
  },
});

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      {children}
      <Footer />
    </ThemeProvider>
  )
}

export default MainLayout;