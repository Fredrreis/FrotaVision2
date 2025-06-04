import { Button, Typography, Box, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackwardsIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { formatarCNPJ } from "@/utils/format";

interface PlanoSelecionado {
  nome: string;
  preco: string;
  dispositivos: string;
  usuarios: string;
  veiculos: string;
  relatorio: string;
}

interface Passo3Props {
  formData: {
    email: string;
    empresa: string;
    cnpj: string;
  };
  plano: PlanoSelecionado | null;
  handleRegister: () => Promise<void>;
  prevStep: () => void;
}

export default function Passo3({
  formData,
  plano,
  handleRegister,
  prevStep,
}: Passo3Props) {
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    await handleRegister();
    setLoading(false);
  };

  return (
    <>
      <CheckCircleIcon className="register-check-circle-icon" />
      <Typography variant="h5" className="register-title">
        Confirme seus dados
      </Typography>
      <Typography variant="body2" className="register-instructions">
        Verifique o plano selecionado e confira as credenciais
      </Typography>

      {plano && (
        <Box className="register-plano-selecionado">
          <Typography variant="body2" sx={{ fontSize: "1rem" }}>
            <strong>Plano {plano.nome}</strong>
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
            <strong>{plano.preco}</strong>/mês
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
            {plano.dispositivos} - {plano.usuarios} - {plano.veiculos} -
            Relatório: {plano.relatorio}
          </Typography>
        </Box>
      )}

      <Typography
        variant="body2"
        className="register-campo"
        sx={{ marginTop: "2vh" }}
      >
        <strong>E-mail:</strong> {formData.email}
      </Typography>
      <Typography variant="body2" className="register-campo">
        <strong>Empresa:</strong> {formData.empresa}
      </Typography>
      <Typography variant="body2" className="register-campo">
        <strong>CNPJ:</strong> {formatarCNPJ(formData.cnpj)}
      </Typography>

      <Button
        variant="contained"
        className="register-button"
        fullWidth
        onClick={onSubmit}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "CONCLUIR ASSINATURA"
        )}
      </Button>

      <Button
        variant="contained"
        fullWidth
        className="register-button-back"
        endIcon={<ArrowBackwardsIcon />}
        onClick={prevStep}
        disabled={loading}
      >
        VOLTAR
      </Button>
    </>
  );
}
