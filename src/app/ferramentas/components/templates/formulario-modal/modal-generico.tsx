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
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"; // Ícone da seta
import "./modal-generico.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSalvar: () => void;
  colunas: {
    chave: string;
    titulo: string;
    tipo?: "texto" | "selecao" | "area";
    opcoes?: string[];
    desativado?: boolean;
  }[];
  dados: any;
  setDados: (novosDados: any) => void;
}

export default function ModalFormulario({
  open,
  onClose,
  onSalvar,
  colunas,
  dados,
  setDados,
}: ModalProps) {
  useEffect(() => {
    if (!dados) {
      setDados({});
    }
  }, [dados, setDados]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        {/* Título do formulário */}
        <Box className="modal-titulo">
          <ArrowForwardIcon className="icone-seta" />
          <Typography variant="h6" fontWeight={600} fontSize={"1.1rem"}>
            EDIÇÃO
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{ marginBottom: "1.5rem", color: "black" }}
        >
          Por gentileza modifique como desejar as informações abaixo:
        </Typography>

        {/* Campos do formulário */}
        {colunas.map(
          ({ chave, titulo, tipo = "texto", opcoes, desativado }) => (
            <Box key={chave} className="modal-form-group">
              {tipo === "selecao" ? (
                <TextField
                  select
                  label={titulo}
                  name={chave}
                  value={dados?.[chave] || ""}
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
                  value={dados?.[chave] || ""}
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

      {/* Botões de ação */}
      <DialogActions className="modal-actions">
        <Button
          onClick={onClose}
          className="modal-cancelar"
          variant="contained"
        >
          Cancelar
        </Button>
        <Button onClick={onSalvar} className="modal-editar" variant="contained">
          Salvar Edição
        </Button>
      </DialogActions>
    </Dialog>
  );
}
