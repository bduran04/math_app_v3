'use client';
import { createTheme } from '@mui/material/styles'

const theme = createTheme({

    palette: {
      primary: {
        main: "#FFBB34",
      },
      secondary: {
        main: "#aba3ff",
      },
      error: {
        main: "#f44336",
      },
      warning: {
        main: "#ff9800",
      },
      info: {
        main: "#fbf7ef",
      },
      success: {
        main: "#4caf50",
      },
      background: {
        default: "#f5f5f5",
      }
    },
  });

  export default theme;