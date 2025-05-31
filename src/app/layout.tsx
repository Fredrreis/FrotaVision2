// src/app/layout.tsx
"use client";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { SessionProvider } from "next-auth/react";
import { store } from "../store/store";
import theme from "../theme";
import LenisProvider from "./providers/lenis-provider";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <SessionProvider>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <LenisProvider />
              {children}
            </ThemeProvider>
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
