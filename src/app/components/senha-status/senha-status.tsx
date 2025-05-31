import zxcvbn from "zxcvbn";
import { Box, Typography, LinearProgress } from "@mui/material";

interface Props {
  senha: string;
}

export default function SenhaForte({ senha }: Props) {
  const resultado = zxcvbn(senha);
  const niveis = ["Muito Fraca", "Fraca", "Média", "Forte", "Excelente"];
  const score = resultado.score;
  const texto = niveis[score];

  return senha ? (
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
  ) : null;
}
