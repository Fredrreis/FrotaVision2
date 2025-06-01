import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import { ApiGateway } from "@/api/api";

const api = new ApiGateway();

export const authOptions: AuthOptions = {
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

          if (response && response.nome && response.cnpj) {
            return {
              id: response.id,
              nome: response.nome,
              email: credentials.email,
              cnpj: response.cnpj,
              permissao: response.permissao,
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
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
