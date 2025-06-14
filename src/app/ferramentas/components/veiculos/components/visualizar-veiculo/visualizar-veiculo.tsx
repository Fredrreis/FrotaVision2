import React from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Divider,
  CircularProgress,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./visualizar-veiculo.css";

interface VeiculoDetalhado {
  apelido: string;
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
}

interface VisualizarVeiculoProps {
  open: boolean;
  onClose: () => void;
  veiculo?: VeiculoDetalhado;
}

const safe = (value: unknown): string =>
  value === undefined || value === null || value === "" ? "-" : String(value);

export default function VisualizarVeiculo({
  open,
  onClose,
  veiculo,
}: VisualizarVeiculoProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      classes={{ paper: "modal-container" }}
      TransitionComponent={Fade}
      transitionDuration={200}
    >
      <DialogContent className="modal-formulario-visualizar">
        {!veiculo ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="300px"
          >
            <CircularProgress size={28} />
            <Typography ml={2} fontSize="0.9rem">
              Carregando dados do veículo...
            </Typography>
          </Box>
        ) : (
          <>
            <Box className="modal-titulo-visualizar">
              <Box display="flex" alignItems="center" gap={1}>
                <ArrowForwardIcon className="icone-seta" />
                <Typography variant="h6" fontWeight={600} fontSize={"1.1rem"}>
                  {safe(veiculo.apelido)}
                </Typography>
              </Box>
              <IconButton onClick={onClose} className="modal-close-button">
                <CloseIcon />
              </IconButton>
            </Box>

            <Divider className="divider" />

            <Box className="grid-infos">
              {[
                { label: "Placa", value: veiculo.placa },
                {
                  label: "Quilometragem percorrida",
                  value: veiculo.km !== undefined ? `${veiculo.km} km` : "-",
                },
                { label: "Ano de fabricação", value: veiculo.ano },
                { label: "Número do chassi", value: veiculo.chassi },
                { label: "Data de Cadastro", value: veiculo.dataCadastro },
                {
                  label: "Último motorista encarregado",
                  value: veiculo.motorista,
                },
              ].map((info, i) => (
                <Box key={i} display="flex" gap={1}>
                  <Typography variant="body2" fontWeight={600}>
                    {info.label}:
                  </Typography>
                  <Typography variant="body2">{safe(info.value)}</Typography>
                </Box>
              ))}
            </Box>

            <Box className="descricao">
              <Typography variant="body2" fontWeight={600}>
                Descrição:
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                {safe(veiculo.descricao)}
              </Typography>
            </Box>

            <Divider className="divider" />

            <Box className="card-info azul">
              <Typography variant="body2" fontWeight={600}>
                Manutenções Registradas: {safe(veiculo.manutencao.total)}
              </Typography>
              <Typography variant="body2">
                Última manutenção: {safe(veiculo.manutencao.ultima)}
              </Typography>
              <Typography variant="body2">
                Data da última manutenção realizada:{" "}
                {safe(veiculo.manutencao.dataUltima)}
              </Typography>
            </Box>

            <Box className="card-info vermelho">
              <Typography variant="body2" fontWeight={600}>
                Manutenções Preventivas Pendentes:{" "}
                {safe(veiculo.preventiva.total)}
              </Typography>
              <Typography variant="body2">
                Última manutenção pendente: {safe(veiculo.preventiva.pendente)}
              </Typography>
              <Typography variant="body2">
                Data da notificação da manutenção:{" "}
                {safe(veiculo.preventiva.dataNotificacao)}
              </Typography>
            </Box>

            <Box className="card-info verde">
              <Typography variant="body2" fontWeight={600}>
                Viagens Registradas: {safe(veiculo.viagens.total)}
              </Typography>
              <Typography variant="body2">
                Última viagem: {safe(veiculo.viagens.ultima)}
              </Typography>
              <Typography variant="body2">
                Data da última viagem realizada:{" "}
                {safe(veiculo.viagens.dataUltima)}
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
