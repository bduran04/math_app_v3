'use client';
import { createTheme } from '@mui/material/styles'

const theme = createTheme({

    palette: {
      primary: {
        main: "#093170",
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

  export default theme;