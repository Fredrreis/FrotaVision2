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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import "./tabela-generica.css";

interface TabelaProps {
  colunas: { chave: string; titulo: string; ordenavel: boolean }[];
  dados: any[];
  onEditar: (item: any) => void;
}

export default function TabelaGenerica({
  colunas,
  dados,
  onEditar,
}: TabelaProps) {
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [order, setOrder] = useState<"asc" | "desc" | null>(null);

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

    const isData = (valor: any) =>
      typeof valor === "string" &&
      valor.match(/^\d{2}\/\d{2}\/\d{4}$/) !== null;

    if (isData(valorA) && isData(valorB)) {
      const converterData = (data: string) => {
        const [dia, mes, ano] = data.split("/");
        return new Date(
          parseInt(ano),
          parseInt(mes) - 1,
          parseInt(dia)
        ).getTime();
      };

      return order === "asc"
        ? converterData(valorA) - converterData(valorB)
        : converterData(valorB) - converterData(valorA);
    }

    return order === "asc"
      ? String(valorA).localeCompare(String(valorB))
      : String(valorB).localeCompare(String(valorA));
  });

  return (
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
            <TableRow
              key={index}
              className={index % 2 === 0 ? "linha-par" : ""}
            >
              {colunas.map(({ chave }) => (
                <TableCell key={chave}>
                  {chave === "nome" && item.manutencaoProxima ? (
                    <span className="nome-com-alerta">
                      {item[chave]}
                      <Tooltip title="Manutenção Pendente">
                        <NotificationImportantIcon className="icone-alerta" />
                      </Tooltip>
                    </span>
                  ) : (
                    item[chave]
                  )}
                </TableCell>
              ))}
              <TableCell>
                <VisibilityIcon className="icone-acao visualizar" />
                <EditIcon
                  className="icone-acao editar"
                  onClick={() => onEditar(item)}
                />
                <DeleteIcon className="icone-acao excluir" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
