import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import "./carregamento.css";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

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
  const [animacao, setAnimacao] = useState<unknown>(null);

  useEffect(() => {
    fetch(animationUrl)
      .then((res) => res.json())
      .then(setAnimacao)
      .catch(console.error);
  }, [animationUrl]);

  if (!animacao) return null;

  return (
    <div className="carregamento-container">
      <Lottie
        animationData={animacao}
        loop
        className="carregamento-lottie"
        style={{ width: largura, height: altura }}
      />
      {mensagem && (
        <Typography variant="subtitle1" className="carregamento-texto">
          {mensagem}
        </Typography>
      )}
    </div>
  );
}
