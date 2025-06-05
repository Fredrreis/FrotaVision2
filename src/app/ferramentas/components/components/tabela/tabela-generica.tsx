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
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
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

/** Se um texto tiver mais de MAX_CHAR, truncamos e adicionamos "..." */
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
  // Ordenação
  const [orderBy, setOrderBy] = useState<keyof T | null>(null);
  const [order, setOrder] = useState<"asc" | "desc" | null>(null);

  // Paginação
  const [page, setPage] = useState(0);
  const rowsPerPage = 11; // Definimos sempre 11 linhas por página

  /** Ao clicar em um cabeçalho ordenável, alterna asc/desc */
  const handleSort = (coluna: keyof T, ordenavel: boolean) => {
    if (!ordenavel) return;
    const isAsc = orderBy === coluna && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(coluna);
  };

  /** Ordena os dados conforme orderBy e order */
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

  /** Extrai apenas as linhas da página atual */
  const paginatedDados = sortedDados.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  /** Muda a página */
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Cálculo do total de páginas
  const totalPages = Math.ceil(dados.length / rowsPerPage);

  return (
    <Paper className="tabela-geral-wrapper" elevation={2}>
      <TableContainer className="tabela-generica">
        <Table>
          <TableHead className="tabela-header">
            <TableRow>
              {colunas.map(({ chave, titulo, ordenavel }, idx) => (
                <TableCell
                  key={String(chave)}
                  onClick={() => handleSort(chave, ordenavel)}
                  className={`tabela-header-cell ${
                    idx === 0 ? "primeiro-header-cell" : ""
                  } ${idx === colunas.length ? "ultimo-header-cell" : ""}`}
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
              <TableCell className="tabela-header-cell ultimo-header-cell">
                Ação
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedDados.map((item, rowIndex) => (
              <TableRow
                key={rowIndex + page * rowsPerPage}
                className={rowIndex % 2 === 0 ? "linha-par" : ""}
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
                        onClick={() => onExaminar?.(item)}
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
                      onClick={() => onExcluir?.(item)}
                    />
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {dados.length > rowsPerPage && (
        <TablePagination
          component="div"
          count={dados.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[]} // remove seletor de linhas por página
          labelRowsPerPage={""} // esconde o texto "Rows per page"
          labelDisplayedRows={({ page }) =>
            `Página ${page + 1} de ${totalPages}`
          }
        />
      )}
    </Paper>
  );
}
