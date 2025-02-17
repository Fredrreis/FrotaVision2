"use client";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { store } from "../store/store";
import theme from "../theme";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
