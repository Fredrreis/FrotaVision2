import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./formulario-generico.css";

interface Coluna {
  chave: string;
  titulo: string;
  tipo?: "texto" | "selecao" | "area" | "custom";
  opcoes?: string[];
  desativado?: boolean;
  componente?: React.ReactNode; // para campos tipo custom
}

interface ModalProps<T extends Record<string, unknown>> {
  open: boolean;
  onClose: () => void;
  onSalvar: () => void;
  colunas: Coluna[];
  dados: T | null;
  setDados: (novosDados: T) => void;
  modoEdicao: boolean;
  children?: React.ReactNode;
  ocultarCabecalho?: boolean;
}

export default function ModalFormulario<T extends Record<string, unknown>>({
  open,
  onClose,
  onSalvar,
  colunas,
  dados,
  setDados,
  modoEdicao,
  children,
  ocultarCabecalho = false,
}: ModalProps<T>) {
  useEffect(() => {
    if (!dados) {
      setDados({} as T);
    }
  }, [dados, setDados]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!dados) return;
    setDados({ ...dados, [e.target.name]: e.target.value });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      classes={{ paper: "modal-container" }}
    >
      <DialogContent className="modal-formulario">
        {children}

        {!ocultarCabecalho && (
          <>
            <Box className="modal-titulo">
              <ArrowForwardIcon className="icone-seta" />
              <Typography variant="h6" fontWeight={600} fontSize={"1.1rem"}>
                {modoEdicao ? "EDIÇÃO" : "CADASTRAR"}
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{ marginBottom: "1.5rem", color: "black" }}
            >
              {modoEdicao
                ? "Por gentileza modifique como desejar as informações abaixo:"
                : "Preencha o(s) campo(s) para cadastrar um novo item:"}
            </Typography>
          </>
        )}

        {colunas.map(
          ({
            chave,
            titulo,
            tipo = "texto",
            opcoes,
            desativado,
            componente,
          }) => (
            <Box key={chave} className="modal-form-group">
              {tipo === "custom" && componente ? (
                componente
              ) : tipo === "selecao" ? (
                <TextField
                  select
                  label={titulo}
                  name={chave}
                  value={dados?.[chave as keyof T] || ""}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  className="modal-input"
                  disabled={desativado}
                >
                  {opcoes?.map((opcao) => (
                    <MenuItem key={opcao} value={opcao}>
                      {opcao}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField
                  label={titulo}
                  name={chave}
                  value={dados?.[chave as keyof T] || ""}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  className="modal-input"
                  disabled={desativado}
                  multiline={tipo === "area"}
                  rows={tipo === "area" ? 3 : 1}
                />
              )}
            </Box>
          )
        )}
      </DialogContent>

      <DialogActions className="modal-actions">
        <Button
          onClick={onClose}
          className="modal-cancelar"
          variant="contained"
        >
          CANCELAR
        </Button>
        <Button onClick={onSalvar} className="modal-editar" variant="contained">
          SALVAR
        </Button>
      </DialogActions>
    </Dialog>
  );
}
