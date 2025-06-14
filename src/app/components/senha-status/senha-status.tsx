"use client";

import { useEffect, useState } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import zxcvbn from "zxcvbn";

interface Props {
  senha: string;
}

export default function SenhaForte({ senha }: Props) {
  const [resultado, setResultado] = useState<zxcvbn.ZXCVBNResult | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setResultado(zxcvbn(senha));
    }
  }, [senha]);

  if (!resultado || !senha) return null;

  const niveis = ["Muito Fraca", "Fraca", "Média", "Forte", "Excelente"];
  const score = resultado.score;
  const texto = niveis[score];

  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="caption">Força da Senha: {texto}</Typography>
      <LinearProgress
        variant="determinate"
        value={(score / 4) * 100}
        sx={{
          height: 6,
          borderRadius: 4,
          mt: 0.5,
          backgroundColor: "#e0e0e0",
          "& .MuiLinearProgress-bar": {
            backgroundColor:
              score === 4
                ? "#1e70ff"
                : score === 3
                ? "#1B3561"
                : score === 2
                ? "black"
                : "#A30D11",
          },
        }}
      />
    </Box>
  );
}
