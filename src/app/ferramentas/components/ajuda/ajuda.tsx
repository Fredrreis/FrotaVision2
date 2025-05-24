"use client";

import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import "./ajuda.css";

const Ajuda: React.FC = () => {
  const passos = [
    "Título da Tela: indica a função atual, sempre fixo no topo.",
    "Busca: campo para localizar rapidamente itens por nome ou chave.",
    "Filtros Avançados: permite refinar a busca por datas, valores, tipos ou status.",
    "Botão “Cadastrar”: abre o formulário para incluir novo item.",
    "Botão “Exportar”: exporta os dados filtrados em formato de relatório.",
    "Tabela de Dados: lista todos os registros com colunas relevantes e ordenáveis.",
    "Ações disponíveis: Editar, Excluir, em alguns casos, Visualizar.",
  ];

  const excecoes = [
    {
      tela: "VEÍCULOS",
      descricao: "Tem uma ação extra de Visualizar.",
    },
    {
      tela: "MANUTENÇÕES",
      descricao: "Contém campos de Horas do Motor e Custo.",
    },
    {
      tela: "VIAGENS",
      descricao:
        "Registra Km percorrido, origem, destino e datas de saída/retorno.",
    },
    {
      tela: "USUÁRIOS",
      descricao: "Mostra permissões de acesso do sistema.",
    },
  ];

  return (
    <Box className="ajuda-container">
      <Box className="ajuda-header">
        <Typography variant="h6" className="ajuda-title">
          <HelpOutlineIcon className="icon-title" />
          AJUDA
        </Typography>
      </Box>

      <Box className="ajuda-lista">
        <Typography variant="subtitle1" fontWeight={600} gutterBottom color="#1B3562">
          Passo a passo de uso das telas de listagem
        </Typography>

        <List dense>
          {passos.map((texto, i) => (
            <ListItem key={i}>
              <ListItemText primary={`#${i + 1} — ${texto}`} />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" fontWeight={600} gutterBottom color="#1B3562">
          Exceções específicas por tela
        </Typography>

        <List dense>
          {excecoes.map((item, i) => (
            <ListItem key={i}>
              <ListItemText
                primary={`${item.tela}: ${item.descricao}`}
              />
            </ListItem>
          ))}
        </List>

        {/* <Box mt={3}>
          <Typography variant="body2" fontStyle="italic">
            Dica: Todos os botões seguem padrão de cor (azul para ações principais, preto para exportar).
          </Typography>
        </Box> */}
      </Box>
    </Box>
  );
};

export default Ajuda;
