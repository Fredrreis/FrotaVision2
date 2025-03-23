import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Login com E-mail e Senha",
      credentials: {
        email: {
          label: "E-mail",
          type: "email",
          placeholder: "usuario@exemplo.com",
        },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("E-mail e senha são obrigatórios");
        }

        try {
          const response = await fetch("https://sua-api.com/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            throw new Error("E-mail ou senha inválidos");
          }

          const user = await response.json();
          return user;
        } catch (error) {
          console.error("Erro ao autenticar usuário:", error);
          throw new Error("Erro de autenticação");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};
