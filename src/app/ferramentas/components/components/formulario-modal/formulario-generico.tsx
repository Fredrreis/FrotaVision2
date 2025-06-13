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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./formulario-generico.css";
import { isoToInputDatetimeLocal } from "@/utils/data";

export interface OpcaoSelect {
  label: string;
  value: string;
}

export interface Coluna {
  chave: string;
  titulo: string;
  tipo?: "texto" | "selecao" | "area" | "custom" | "number" | "data" | "datetime" | "radio";
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
  erros?: Record<string, string>;
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
  erros = {},
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
                    error={!!erros[chave]}
                    helperText={erros[chave]}
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
                    error={!!erros[chave]}
                    helperText={erros[chave]}
                  >
                    <MenuItem value="">Carregando opções...</MenuItem>
                  </TextField>
                )
              ) : tipo === "radio" ? (
                <Box>
                  <FormLabel component="legend" sx={{ mb: 1 }}>{titulo}</FormLabel>
                  <RadioGroup
                    row
                    name={chave}
                    value={dados?.[chave as keyof T] ?? ""}
                    onChange={handleChange}
                  >
                    {Array.isArray(opcoes) && opcoes.map((opcao) =>
                      typeof opcao === "string" ? (
                        <FormControlLabel
                          key={opcao}
                          value={opcao}
                          control={<Radio />}
                          label={opcao}
                          disabled={desativado}
                        />
                      ) : (
                        <FormControlLabel
                          key={opcao.value}
                          value={opcao.value}
                          control={<Radio />}
                          label={opcao.label}
                          disabled={desativado}
                        />
                      )
                    )}
                  </RadioGroup>
                  {erros[chave] && (
                    <Typography variant="caption" color="error">{erros[chave]}</Typography>
                  )}
                </Box>
              ) : tipo === "number" ? (
                <TextField
                  type="number"
                  label={titulo}
                  name={chave}
                  value={dados?.[chave as keyof T] || ""}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  className="modal-input"
                  disabled={desativado}
                  error={!!erros[chave]}
                  helperText={erros[chave]}
                />
              ) : tipo === "data" ? (
                <TextField
                  type="date"
                  label={titulo}
                  name={chave}
                  value={
                    typeof dados?.[chave as keyof T] === "string"
                      ? (dados[chave as keyof T] as string).slice(0, 10)
                      : ""
                  }
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  className="modal-input"
                  disabled={desativado}
                  InputLabelProps={{ shrink: true }}
                  error={!!erros[chave]}
                  helperText={erros[chave]}
                />
              ) : tipo === "datetime" ? (
                <TextField
                  type="datetime-local"
                  label={titulo}
                  name={chave}
                  value={
                    typeof dados?.[chave as keyof T] === "string"
                      ? isoToInputDatetimeLocal(dados[chave as keyof T] as string)
                      : ""
                  }
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  className="modal-input"
                  disabled={desativado}
                  InputLabelProps={{ shrink: true }}
                  error={!!erros[chave]}
                  helperText={erros[chave]}
                />
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
                  error={!!erros[chave]}
                  helperText={erros[chave]}
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
