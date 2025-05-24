// src/components/carregamento/carregamento.tsx
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";

interface CarregamentoProps {
  animationUrl: string;
  largura?: number;
  altura?: number;
  mensagem?: string;
}

export default function Carregamento({
  animationUrl,
  largura = 200,
  altura = 200,
  mensagem,
}: CarregamentoProps) {
  const [animacao, setAnimacao] = useState<any>(null);

  useEffect(() => {
    fetch(animationUrl)
      .then((res) => res.json())
      .then(setAnimacao)
      .catch(console.error);
  }, [animationUrl]);

  if (!animacao) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
      }}
    >
      <Lottie
        animationData={animacao}
        loop
        style={{ width: largura, height: altura }}
      />
      {mensagem && (
        <Typography variant="subtitle1" style={{color: "#444" }}>
          {mensagem}
        </Typography>
      )}
    </div>
  );
}
