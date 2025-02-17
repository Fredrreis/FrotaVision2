import { createTheme } from "@mui/material/styles";
import { Poppins } from "next/font/google"; // Importa a fonte otimizada pelo Next.js

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Define os pesos que serão usados
  display: "swap",
});

const theme = createTheme({
  typography: {
    fontFamily: poppins.style.fontFamily, // Define Poppins como fonte padrão
  },
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

export default theme;
