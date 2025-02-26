import { createTheme } from "@mui/material/styles";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Define os pesos que serão usados
  display: "swap",
});

const theme = createTheme({
  typography: {
    fontFamily: poppins.style.fontFamily,
  },
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: poppins.style.fontFamily,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          width: '100%',

          '& .MuiOutlinedInput-root': {
            height: '4.5vh',
            borderRadius: '0.75rem',

            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1b3562', // Cor da borda ao focar
            },

            '& .MuiOutlinedInput-input': {
              height: '2.5rem',
              padding: '0 0.75rem',
              fontSize: '0.875rem', // Tamanho da fonte ao digitar
            },
          },

          '& .MuiInputLabel-root': {
            fontSize: '0.875rem',
            transform: 'translate(14px, 10px) scale(1)',
            transition: 'transform 0.2s ease, font-size 0.2s ease',
          },

          '& .MuiInputLabel-root.Mui-focused': {
            transform: 'translate(14px, -6px) scale(0.75)', // Ajuste da label ao focar
            color: '#1b3562'
          },

          '& .MuiInputLabel-root.MuiInputLabel-shrink': {
            transform: 'translate(14px, -6px) scale(0.75)', // Mantém a label acima quando há valor no input
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: poppins.style.fontFamily,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: poppins.style.fontFamily,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: poppins.style.fontFamily,
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontFamily: poppins.style.fontFamily,
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          fontFamily: poppins.style.fontFamily,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          fontFamily: poppins.style.fontFamily,
        },
      },
    },
  },
});

export default theme;