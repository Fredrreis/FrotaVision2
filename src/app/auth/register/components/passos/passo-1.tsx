"use client";

import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import * as yup from "yup";
import { step1Schema } from "@/utils/login-validation";
import ToggleSenha from "@/app/components/toggle-senha/toggle-senha";
import SenhaForte from "../../../../components/senha-status/senha-status";

interface Step1Props {
  formData: {
    email: string;
    password: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nextStep: () => void;
}

export default function Step1({
  formData,
  handleChange,
  nextStep,
}: Step1Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mostrarSenha, adornment } = ToggleSenha();

  const handleNext = async () => {
    try {
      await step1Schema.validate(formData, { abortEarly: false });
      setErrors({});
      nextStep();
    } catch (err: unknown) {
      const newErrors: Record<string, string> = {};
      if (err instanceof yup.ValidationError) {
        err.inner.forEach((e: yup.ValidationError) => {
          if (e.path && !newErrors[e.path]) {
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
        Criar Conta
      </Typography>
      <Typography variant="body2" className="register-instructions">
        Primeiramente vamos definir o e-mail e senha
      </Typography>

      <TextField
        name="email"
        label="E-mail"
        variant="outlined"
        fullWidth
        value={formData.email}
        onChange={handleChange}
        error={Boolean(errors.email)}
        helperText={errors.email}
        sx={{ marginBottom: 2 }}
      />

      <TextField
        name="password"
        label="Senha"
        type={mostrarSenha ? "text" : "password"}
        variant="outlined"
        fullWidth
        value={formData.password}
        onChange={handleChange}
        error={Boolean(errors.password)}
        helperText={errors.password}
        slotProps={{
          input: {
            endAdornment: adornment,
          },
        }}
      />

      <SenhaForte senha={formData.password} />

      <Button
        variant="contained"
        fullWidth
        className="register-button"
        endIcon={<ArrowForwardIcon />}
        onClick={handleNext}
        sx={{ mt: 2 }}
      >
        CONTINUAR
      </Button>
    </>
  );
}
