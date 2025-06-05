import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./formulario-generico.css";

export interface OpcaoSelect {
  label: string;
  value: string;
}

export interface Coluna {
  chave: string;
  titulo: string;
  tipo?: "texto" | "selecao" | "area" | "custom";
  opcoes?: string[] | OpcaoSelect[];
  desativado?: boolean;
  componente?: React.ReactNode;
}

interface ModalProps<T extends Record<string, unknown>> {
  open: boolean;
  onClose: () => void;
  onSalvar: () => Promise<void>;
  colunas: Coluna[];
  dados: T | null;
  setDados: (novosDados: T) => void;
  modoEdicao: boolean;
  children?: React.ReactNode;
  ocultarCabecalho?: boolean;
  titulo?: string;
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
  titulo,
}: ModalProps<T>) {
  const [loadingSalvar, setLoadingSalvar] = useState(false);

  useEffect(() => {
    if (!dados) {
      setDados({} as T);
    }
  }, [dados, setDados]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!dados) return;
    setDados({ ...dados, [e.target.name]: e.target.value });
  };

  const handleSalvarComLoading = async () => {
    setLoadingSalvar(true);
    try {
      await onSalvar();
    } finally {
      setLoadingSalvar(false);
    }
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
                {titulo || (modoEdicao ? "EDIÇÃO" : "CADASTRAR")}
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
                opcoes && opcoes.length > 0 ? (
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
                    {opcoes.map((opcao) =>
                      typeof opcao === "string" ? (
                        <MenuItem
                          key={opcao}
                          value={opcao}
                          sx={{ fontSize: "0.85rem" }}
                        >
                          {opcao}
                        </MenuItem>
                      ) : (
                        <MenuItem
                          key={opcao.value}
                          value={opcao.value}
                          sx={{ fontSize: "0.85rem" }}
                        >
                          {opcao.label}
                        </MenuItem>
                      )
                    )}
                  </TextField>
                ) : (
                  <TextField
                    select
                    label={titulo}
                    name={chave}
                    value=""
                    fullWidth
                    variant="outlined"
                    size="small"
                    className="modal-input"
                    disabled
                  >
                    <MenuItem value="">Carregando opções...</MenuItem>
                  </TextField>
                )
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
          disabled={loadingSalvar}
        >
          CANCELAR
        </Button>
        <Button
          onClick={handleSalvarComLoading}
          className="modal-editar"
          variant="contained"
          disabled={loadingSalvar}
        >
          {loadingSalvar ? (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="100%"
            >
              <CircularProgress size={20} color="inherit" />
            </Box>
          ) : (
            "SALVAR"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
