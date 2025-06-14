import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ApiGateway } from "@/api/api";

const api = new ApiGateway();

// Type guard para validar o retorno do login
function isUsuarioResponse(obj: unknown): obj is { id: number; nome: string; cnpj: string; permissao: string | number } {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "nome" in obj &&
    "cnpj" in obj &&
    "permissao" in obj
  );
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const response = await api.post(
            `/Usuario/login/${credentials.email},${credentials.password}`,
            {}
          );

          if (isUsuarioResponse(response)) {
            return {
              id: response.id,
              nome: response.nome,
              email: credentials.email,
              cnpj: response.cnpj,
              permissao: Number(response.permissao),
            };
          }

          return null;
        } catch (error) {
          console.error("Erro no authorize:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nome = user.nome;
        token.email = user.email;
        token.cnpj = user.cnpj;
        token.permissao = user.permissao;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as number;
      session.user.nome = token.nome as string;
      session.user.email = token.email as string;
      session.user.cnpj = token.cnpj as string;
      session.user.permissao = token.permissao as number;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 