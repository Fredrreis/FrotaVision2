"use client";

import React from "react";
import {
  Box,
  Typography,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import "./ajuda.css";

const passosDetalhados = [
  {
    titulo: "Título da Tela",
    descricao:
      "Indica a funcionalidade principal da tela. Ele é fixo no topo e ajuda o usuário a saber exatamente onde está no sistema.",
  },
  {
    titulo: "Busca",
    descricao:
      "Campo de busca que permite localizar rapidamente registros pelo nome ou código. Ideal para filtros rápidos.",
  },
  {
    titulo: "Filtros Avançados",
    descricao:
      "Permite filtrar registros por data, valores, tipo ou status. Muito útil para refinar visualizações em grandes volumes de dados.",
  },
  {
    titulo: "Botão “Cadastrar”",
    descricao:
      "Abre um formulário para adicionar um novo registro. Pode variar entre 'Cadastrar Motorista', 'Cadastrar Veículo', etc.",
  },
  {
    titulo: "Botão “Exportar”",
    descricao:
      "Gera um relatório dos dados filtrados. Disponível nos formatos: PDF, CSV e DOCX.",
  },
  {
    titulo: "Tabela de Dados",
    descricao:
      "Apresenta os registros em colunas. As colunas podem ser ordenadas clicando no cabeçalho correspondente.",
  },
  {
    titulo: "Ações disponíveis",
    descricao:
      "Cada registro pode ser editado ou excluído. Algumas telas (como Veículos) também oferecem uma ação de visualização.",
  },
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

const Ajuda: React.FC = () => {
  return (
    <Box className="ajuda-container">
      <Box className="ajuda-header">
        <Typography variant="h6" className="ajuda-title">
          <HelpIcon className="icon-title" />
          AJUDA E SUPORTE
        </Typography>
      </Box>

      <Box className="ajuda-lista">
        <Typography
          variant="subtitle1"
          fontWeight={600}
          gutterBottom
          color="#1B3562"
        >
          Passo a passo de uso das telas de listagem
        </Typography>

        <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
          As telas de listagem do sistema seguem um padrão de uso para facilitar
          a navegação e a interação. Abaixo estão os elementos mais comuns nas
          telas (exceto “NOTIFICAÇÕES”):
        </Typography>

        {passosDetalhados.map((item, index) => (
          <Accordion key={index} className="passo-a-passo-container">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={600} variant="body2">
                {`#${index + 1} — ${item.titulo}`}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">{item.descricao}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="subtitle1"
          fontWeight={600}
          gutterBottom
          color="#1B3562"
        >
          Exceções específicas por tela
        </Typography>

        <List dense>
          {excecoes.map((item, i) => (
            <ListItem key={i}>
              <ListItemText primary={`${item.tela}: ${item.descricao}`} />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 3 }} />

        <Box className="ajuda-contato">
          <Typography
            variant="subtitle1"
            fontWeight={600}
            gutterBottom
            color="#1B3562"
          >
            Precisa de mais ajuda?
          </Typography>
          <Typography variant="body2" gutterBottom>
            Caso tenha dúvidas adicionais ou deseje reportar um erro na
            ferramenta, entre em contato com o suporte técnico:
          </Typography>
          <List dense>
            <ListItem>
              <EmailIcon fontSize="small" sx={{ mr: 1, color: "#1B3562" }} />
              <ListItemText
                primary="Email: suporte@frotavision.com.br"
                secondary="Disponível de segunda a sexta das 08h às 17h"
              />
            </ListItem>
            <ListItem>
              <WhatsAppIcon fontSize="small" sx={{ mr: 1, color: "#1B3562" }} />
              <ListItemText
                primary="WhatsApp: +55 (31) 99182-6912"
                secondary="Resposta rápida em horário comercial"
              />
            </ListItem>
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default Ajuda;
