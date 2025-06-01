import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      nome: string;
      email: string;
      cnpj: string;
      permissao: number;
    };
  }

  interface User {
    id: number;
    nome: string;
    email: string;
    cnpj: string;
    permissao: number;
  }
}
