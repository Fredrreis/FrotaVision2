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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import VisualizarVeiculo from "../visualizar-veiculo/visualizar-veiculo";
import "./tabela-generica.css";

interface TabelaProps<T extends Record<string, unknown>> {
  colunas: { chave: keyof T; titulo: string; ordenavel: boolean }[];
  dados: T[];
  onEditar: (item: T) => void;
  onExcluir?: (item: T) => void;
  exibirExaminar?: boolean;
  onExaminar?: (item: T) => void;
}

const MAX_CHAR = 20;

const truncateText = (text: string) => {
  return text.length > MAX_CHAR ? text.substring(0, MAX_CHAR) + "..." : text;
};

export default function TabelaGenerica<T extends Record<string, unknown>>({
  colunas,
  dados,
  onEditar,
  onExcluir,
  exibirExaminar = false,
  onExaminar,
}: TabelaProps<T>) {
  const [orderBy, setOrderBy] = useState<keyof T | null>(null);
  const [order, setOrder] = useState<"asc" | "desc" | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<T | null>(null);

  const [openVisualizar, setOpenVisualizar] = useState(false);
  const [itemVisualizar, setItemVisualizar] = useState<T | null>(null);

  const handleSort = (coluna: keyof T, ordenavel: boolean) => {
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
      ? String(valorA ?? "").localeCompare(String(valorB ?? ""))
      : String(valorB ?? "").localeCompare(String(valorA ?? ""));
  });

  const handleOpenModal = (item: T) => {
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
                  key={String(chave)}
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
              <TableRow
                key={index}
                className={index % 2 === 0 ? "linha-par" : ""}
              >
                {colunas.map(({ chave }) => {
                  const valor = item[chave] ?? "—";
                  const texto = String(valor);

                  return (
                    <TableCell key={String(chave)}>
                      {texto.length > MAX_CHAR ? (
                        <Tooltip title={texto} arrow>
                          <span>{truncateText(texto)}</span>
                        </Tooltip>
                      ) : (
                        <span>{texto}</span>
                      )}
                      {chave === "nome" &&
                        (item as T & { manutencaoProxima?: boolean })
                          .manutencaoProxima && (
                          <Tooltip title="Manutenção Pendente" arrow>
                            <NotificationImportantIcon className="icone-alerta" />
                          </Tooltip>
                        )}
                    </TableCell>
                  );
                })}
                <TableCell>
                  {exibirExaminar && (
                    <Tooltip title="Visualizar" arrow>
                      <VisibilityIcon
                        className="icone-acao examinar"
                        onClick={() => {
                          setItemVisualizar(item);
                          setOpenVisualizar(true);
                          onExaminar?.(item);
                        }}
                      />
                    </Tooltip>
                  )}
                  <Tooltip title="Editar" arrow>
                    <EditIcon
                      className="icone-acao editar"
                      onClick={() => onEditar(item)}
                    />
                  </Tooltip>
                  <Tooltip title="Deletar" arrow>
                    <DeleteIcon
                      className="icone-acao excluir"
                      onClick={() => handleOpenModal(item)}
                    />
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        className="modal-confirmacao"
      >
        <DialogTitle className="modal-titulo">
          <ArrowForwardIcon />
          CONFIRMAR EXCLUSÃO
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="modal-texto" variant="body2">
            Tem certeza que deseja excluir o item{" "}
            <strong>
              {(itemSelecionado as T & { nome?: string })?.nome ||
                "selecionado"}
            </strong>
            ?
          </DialogContentText>
          <DialogActions className="modal-acoes">
            <Button
              onClick={handleCloseModal}
              className="botao-cancelar"
              variant="contained"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="botao-excluir"
              variant="contained"
            >
              Excluir
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      {itemVisualizar && (
        <VisualizarVeiculo
          open={openVisualizar}
          onClose={() => {
            setOpenVisualizar(false);
            setItemVisualizar(null);
          }}
          veiculo={{
            placa: String(itemVisualizar["placa"]),
            chassi: String(itemVisualizar["chassi"]),
            ano: Number(itemVisualizar["ano"]),
            km: Number(itemVisualizar["km"]),
            dataCadastro: String(itemVisualizar["data"]),
            motorista: "Marcos D’avila", // mock
            descricao: String(itemVisualizar["descricao"]),
            manutencao: {
              total: 1,
              ultima: "Freio",
              dataUltima: "10/04/2024",
            },
            preventiva: {
              total: 1,
              pendente: "Troca de Pneus",
              dataNotificacao: "10/11/2024",
            },
            viagens: {
              total: 12,
              ultima: "São João Del Rey(MG) - Ribeirão das Neves(MG)",
              dataUltima: "07/11/2024",
            },
          }}
        />
      )}
    </>
  );
}
