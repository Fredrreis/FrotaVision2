import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ApiGateway } from "@/api/api";
import { jwtDecode } from "jwt-decode";

const api = new ApiGateway();

// Defina o tipo esperado do payload do JWT
type JwtUserPayload = {
  Id: number;
  Nome: string;
  Email: string;
  Cnpj: string;
  Permissao: string | number;
  [key: string]: unknown;
};

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
          const response: unknown = await api.post("/Usuario/loginJWT", {
              email: credentials.email,
            password: credentials.password,
            twoFactorCode: "",
            twoFactorRecoveryCode: ""
          });

          // Garante que response é um objeto com a propriedade token
          if (!response || typeof response !== 'object' || !('token' in response)) {
            return null;
          }
          const token = (response as { token: string }).token;
          const decoded: JwtUserPayload = jwtDecode<JwtUserPayload>(token);

          return {
            id: Number(decoded.ID),
            nome: decoded.Nome,
            email: decoded.Email,
            cnpj: decoded.Cnpj,
            permissao: Number(decoded.Permissao) || 0,
            token,
          };
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