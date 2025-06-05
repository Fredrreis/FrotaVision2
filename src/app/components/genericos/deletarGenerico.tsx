// src/components/genericos/DeletarGenerico.tsx

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./deletar_generico.css";

interface DeletarGenericoProps<T> {
  open: boolean;
  onClose: () => void;
  onConfirmar: (item: T) => Promise<void>;
  item: T;
  getDescricao?: (item: T) => string;
}

export default function DeletarGenerico<T>({
  open,
  onClose,
  onConfirmar,
  item,
  getDescricao,
}: DeletarGenericoProps<T>) {
  const handleDelete = async () => {
    try {
      await onConfirmar(item);
      onClose();
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="modal-confirmacao">
      <DialogTitle className="modal-titulo">
        <ArrowForwardIcon />
        CONFIRMAR EXCLUSÃO
      </DialogTitle>
      <DialogContent>
        <DialogContentText className="modal-texto" variant="body2">
          Tem certeza que deseja excluir{" "}
          <strong>
            {getDescricao ? getDescricao(item) : "o item selecionado"}
          </strong>
          ?
        </DialogContentText>
        <DialogActions className="modal-acoes">
          <Button
            onClick={onClose}
            className="botao-cancelar"
            variant="contained"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            className="botao-excluir"
            variant="contained"
          >
            Excluir
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
