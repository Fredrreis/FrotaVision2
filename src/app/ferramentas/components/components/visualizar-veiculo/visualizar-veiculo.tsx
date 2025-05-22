import React from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./visualizar-veiculo.css";

interface VisualizarVeiculoProps {
  open: boolean;
  onClose: () => void;
  veiculo: {
    placa: string;
    chassi: string;
    ano: number;
    km: number;
    dataCadastro: string;
    motorista: string;
    descricao: string;
    manutencao: {
      total: number;
      ultima: string;
      dataUltima: string;
    };
    preventiva: {
      total: number;
      pendente: string;
      dataNotificacao: string;
    };
    viagens: {
      total: number;
      ultima: string;
      dataUltima: string;
    };
  };
}

export default function VisualizarVeiculo({
  open,
  onClose,
  veiculo,
}: VisualizarVeiculoProps) {
  const infosPrincipais = [
    { label: "Placa", value: veiculo.placa },
    { label: "Quilometragem percorrida", value: `${veiculo.km} km` },
    { label: "Ano de fabricação", value: veiculo.ano },
    { label: "Número do chassi", value: veiculo.chassi },

    { label: "Data de Cadastro", value: veiculo.dataCadastro },
    { label: "Último motorista encarregado", value: veiculo.motorista },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      classes={{ paper: "modal-container" }}
    >
      <DialogContent className="modal-formulario-visualizar">
        <Box className="modal-titulo-visualizar">
          <Box display="flex" alignItems="center" gap={1}>
            <ArrowForwardIcon className="icone-seta" />
            <Typography variant="h6" fontWeight={600} fontSize={"1.1rem"}>
              Caminhão {veiculo.placa}
            </Typography>
          </Box>
          <IconButton onClick={onClose} className="modal-close-button">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider className="divider" />

        <Box className="grid-infos">
          {infosPrincipais.map((info, index) => (
            <Box key={index} display="flex" gap={1}>
              <Typography variant="body2" fontWeight={600}>
                {info.label}:
              </Typography>
              <Typography variant="body2">{info.value}</Typography>
            </Box>
          ))}
        </Box>

        <Box className="descricao">
          <Typography variant="body2" fontWeight={600}>
            Descrição:
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            {veiculo.descricao}
          </Typography>
        </Box>

        <Divider className="divider" />

        <Box className="card-info azul">
          <Typography variant="body2" fontWeight={600}>
            Manutenções Registradas: {veiculo.manutencao.total}
          </Typography>
          <Typography variant="body2">
            Última manutenção: {veiculo.manutencao.ultima}
          </Typography>
          <Typography variant="body2">
            Data da última manutenção realizada: {veiculo.manutencao.dataUltima}
          </Typography>
        </Box>

        <Box className="card-info vermelho">
          <Typography variant="body2" fontWeight={600}>
            Manutenções Preventivas Pendentes: {veiculo.preventiva.total}
          </Typography>
          <Typography variant="body2">
            Última manutenção pendente: {veiculo.preventiva.pendente}
          </Typography>
          <Typography variant="body2">
            Data da notificação da manutenção:{" "}
            {veiculo.preventiva.dataNotificacao}
          </Typography>
        </Box>

        <Box className="card-info verde">
          <Typography variant="body2" fontWeight={600}>
            Viagens Registradas: {veiculo.viagens.total}
          </Typography>
          <Typography variant="body2">
            Última viagem: {veiculo.viagens.ultima}
          </Typography>
          <Typography variant="body2">
            Data da última viagem realizada: {veiculo.viagens.dataUltima}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
