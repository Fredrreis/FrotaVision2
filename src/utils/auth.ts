import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth-options";

/**
 * Verifica a sessão no lado do servidor.
 * Redireciona para a página de login se não houver sessão.
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/home"); // Altere para "/login" se preferir
  }

  return session;
}
