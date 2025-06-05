"use client";

import { useState } from "react";
import { Button, Divider, TextField, Typography, Box } from "@mui/material";
import Image from "next/image";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GoogleIcon from "../../../../img/google.png";
import MicrosoftIcon from "../../../../img/microsoft.png";
import SenhaForte from "../../../../components/senha-status/senha-status";
import { step1Schema } from "@/utils/login-validation";
import useToggleSenha from "@/app/components/toggle-senha/toggle-senha";

interface Step1Props {
  formData: {
    email: string;
    password: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nextStep: () => void;
  handleGoogleSignIn: () => void;
}

export default function Step1({
  formData,
  handleChange,
  nextStep,
  handleGoogleSignIn,
}: Step1Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mostrarSenha, adornment } = useToggleSenha();

  const handleNext = async () => {
    try {
      await step1Schema.validate(formData, { abortEarly: false });
      setErrors({});
      nextStep();
    } catch (err: any) {
      const newErrors: Record<string, string> = {};
      err.inner.forEach((e: any) => {
        if (!newErrors[e.path]) {
          newErrors[e.path] = e.message;
        }
      });
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

      <Divider className="register-divider">ou</Divider>

      <Box className="register-social-buttons">
        <Button
          variant="outlined"
          className="register-social-button"
          onClick={handleGoogleSignIn}
        >
          <Image src={GoogleIcon} alt="Google Icon" width={20} height={20} />
          Sign in com Google
        </Button>
        <Button variant="outlined" className="register-social-button" disabled>
          <Image
            src={MicrosoftIcon}
            alt="Microsoft Icon"
            width={20}
            height={20}
          />
          Sign in com Microsoft
        </Button>
      </Box>
    </>
  );
}
