import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import "./tabela-generica.css";

interface TabelaProps {
  colunas: { chave: string; titulo: string; ordenavel: boolean }[];
  dados: any[];
  onEditar: (item: any) => void;
  onExcluir?: (item: any) => void;
  exibirVisualizar?: boolean;
}

const MAX_CHAR = 20;

const truncateText = (text: string) => {
  return text.length > MAX_CHAR ? text.substring(0, MAX_CHAR) + "..." : text;
};

export default function TabelaGenerica({ colunas, dados, onEditar, onExcluir, exibirVisualizar = false }: TabelaProps) {
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [order, setOrder] = useState<"asc" | "desc" | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<any | null>(null);

  const handleSort = (coluna: string, ordenavel: boolean) => {
    if (!ordenavel) return;
    const isAsc = orderBy === coluna && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(coluna);
  };

  const sortedDados = [...dados].sort((a, b) => {
    if (!orderBy) return 0;

    const valorA = a[orderBy];
    const valorB = b[orderBy];

    if (typeof valorA === "number" && typeof valorB === "number") {
      return order === "asc" ? valorA - valorB : valorB - valorA;
    }

    return order === "asc"
      ? String(valorA).localeCompare(String(valorB))
      : String(valorB).localeCompare(String(valorA));
  });

  const handleOpenModal = (item: any) => {
    setItemSelecionado(item);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setItemSelecionado(null);
  };

  const handleConfirmDelete = () => {
    if (onExcluir && itemSelecionado) {
      onExcluir(itemSelecionado);
    }
    handleCloseModal();
  };

  return (
    <>
      <TableContainer component={Paper} className="tabela-generica">
        <Table>
          <TableHead className="tabela-header">
            <TableRow>
              {colunas.map(({ chave, titulo, ordenavel }) => (
                <TableCell
                  key={chave}
                  onClick={() => handleSort(chave, ordenavel)}
                  className="tabela-header-cell"
                >
                  <div className="tabela-header-content">
                    {titulo}
                    {ordenavel &&
                      (orderBy === chave ? (
                        order === "asc" ? (
                          <ExpandLessIcon className="sort-icon" />
                        ) : (
                          <ExpandMoreIcon className="sort-icon" />
                        )
                      ) : (
                        <ExpandMoreIcon className="sort-icon-inactive" />
                      ))}
                  </div>
                </TableCell>
              ))}
              <TableCell className="tabela-header-cell">Ação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedDados.map((item, index) => (
              <TableRow key={index} className={index % 2 === 0 ? "linha-par" : ""}>
                {colunas.map(({ chave }) => (
                  <TableCell key={chave}>
                    {item[chave].length > MAX_CHAR ? (
                      <Tooltip title={item[chave]} arrow>
                        <span>{truncateText(item[chave])}</span>
                      </Tooltip>
                    ) : (
                      item[chave]
                    )}
                    {chave === "nome" && item.manutencaoProxima && (
                      <Tooltip title="Manutenção Pendente" arrow>
                        <NotificationImportantIcon className="icone-alerta" />
                      </Tooltip>
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  {exibirVisualizar && (
                    <Tooltip title="Visualizar" arrow>
                      <VisibilityIcon className="icone-acao visualizar" />
                    </Tooltip>
                  )}
                  <Tooltip title="Editar" arrow>
                    <EditIcon className="icone-acao editar" onClick={() => onEditar(item)} />
                  </Tooltip>
                  <Tooltip title="Deletar" arrow>
                    <DeleteIcon className="icone-acao excluir" onClick={() => handleOpenModal(item)} />
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Confirmação - Estilizado */}
      <Dialog open={openModal} onClose={handleCloseModal} className="modal-confirmacao">
        <DialogTitle className="modal-titulo"><ArrowForwardIcon/>CONFIRMAR EXCLUSÃO</DialogTitle>
        <DialogContent>
            <DialogContentText className="modal-texto" variant="body2">
              Tem certeza que deseja excluir o item <strong>{itemSelecionado?.nome || "selecionado"}</strong>?
            </DialogContentText>
            <DialogActions className="modal-acoes">
              <Button onClick={handleCloseModal} className="botao-cancelar" variant="contained">
                Cancelar
              </Button>
              <Button onClick={handleConfirmDelete} className="botao-excluir" variant="contained">
                Excluir
              </Button>
            </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
}
