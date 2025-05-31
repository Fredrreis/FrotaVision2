// src/hooks/useToggleSenha.ts
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment } from "@mui/material";

export default function useToggleSenha() {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const toggle = () => setMostrarSenha((prev) => !prev);

  const adornment = (
    <InputAdornment position="end">
      <IconButton onClick={toggle} edge="end">
        {mostrarSenha ? (
          <VisibilityOff sx={{ color: "#838383", fontSize: "1.3rem" }} />
        ) : (
          <Visibility sx={{ color: "#838383", fontSize: "1.3rem" }} />
        )}
      </IconButton>
    </InputAdornment>
  );

  return { mostrarSenha, adornment };
}
