import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

/**
 * Verifica a sessão no lado do servidor.
 * Redireciona para a página de login se não houver sessão.
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/home"); // Redireciona para o login se o usuário não estiver autenticado
  }

  return session; // Retorna a sessão se o usuário estiver logado
}
