// src/app/ferramentas/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/auth.config";
import { Ferramentas } from "./ferramentas";

export default async function FerramentasPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("home");
  }

  return <Ferramentas />;
}
