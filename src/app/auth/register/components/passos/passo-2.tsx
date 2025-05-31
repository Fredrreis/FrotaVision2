"use client";

import { Button, TextField, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackwardsIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import * as yup from "yup";
import { step2Schema } from "@/utils/validations";

interface Passo2Props {
  formData: {
    empresa: string;
    cnpj: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

function aplicarMascaraCNPJ(valor: string) {
  return valor
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18);
}

export default function Passo2({
  formData,
  handleChange,
  nextStep,
  prevStep,
}: Passo2Props) {
  const [errors, setErrors] = useState<{ empresa?: string; cnpj?: string }>({});

  const handleValidation = async () => {
    try {
      await step2Schema.validate(formData, { abortEarly: false });
      setErrors({});
      nextStep();
    } catch (err: any) {
      const newErrors: any = {};
      if (err.inner) {
        err.inner.forEach((e: yup.ValidationError) => {
          if (e.path && typeof e.path === "string" && !newErrors[e.path]) {
            newErrors[e.path] = e.message;
          }
        });
      }
      setErrors(newErrors);
    }
  };

  return (
    <>
      <Typography variant="h5" className="register-title">
        Dados da Empresa
      </Typography>
      <Typography variant="body2" className="register-instructions">
        Agora vamos preencher os dados empresariais
      </Typography>

      <TextField
        name="empresa"
        label="Nome da Empresa"
        variant="outlined"
        fullWidth
        value={formData.empresa}
        onChange={handleChange}
        sx={{ marginBottom: 2 }}
        error={!!errors.empresa}
        helperText={errors.empresa}
      />

      <TextField
        name="cnpj"
        label="CNPJ"
        variant="outlined"
        fullWidth
        value={formData.cnpj}
        onChange={(e) => {
          const valorFormatado = aplicarMascaraCNPJ(e.target.value);
          handleChange({
            target: {
              name: "cnpj",
              value: valorFormatado,
            },
          } as React.ChangeEvent<HTMLInputElement>);
        }}
        sx={{ marginBottom: 2 }}
        error={!!errors.cnpj}
        helperText={errors.cnpj}
      />

      <Button
        variant="contained"
        fullWidth
        className="register-button"
        endIcon={<ArrowForwardIcon />}
        onClick={handleValidation}
      >
        CONTINUAR
      </Button>

      <Button
        variant="contained"
        fullWidth
        className="register-button-back"
        endIcon={<ArrowBackwardsIcon />}
        onClick={prevStep}
      >
        VOLTAR
      </Button>
    </>
  );
}
