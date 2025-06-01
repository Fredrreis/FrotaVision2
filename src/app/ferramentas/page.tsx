// src/app/ferramentas/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Ferramentas } from "./ferramentas";

export default async function FerramentasPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("auth/login");
  }

  return <Ferramentas />;
}
