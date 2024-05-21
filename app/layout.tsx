import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import React, { ReactNode } from 'react';
import local from "next/font/local"
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"
import { ThemeProvider } from "@mui/material/styles";
import theme from './theme'
import "./globals.css";

interface MainLayoutProps {
  children: ReactNode;
}

const newFont = local({
  src: [
    {
      path: "../public/font_2.ttf",
      weight: "800"
    }
  ],
  variable: "--font-newFont"
})

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {

  return (
    <>
      <html lang='en'>
        <body className={`${newFont.variable}`}>
          <ThemeProvider theme={theme}>
            <Navbar />
            {children}
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}

export default MainLayout;