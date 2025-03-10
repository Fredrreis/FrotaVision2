"use client";

import React, { useState } from "react";
import "./email.css";
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputAdornment,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import EmailIcon from "@mui/icons-material/Email";

export default function Email() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setError(!emailRegex.test(email));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="email-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Typography variant="h6" className="email-title">
        Fique por dentro das nossas novidades
      </Typography>
      <Box className="email-text">
        <Typography variant="body2" className="email-text">
          Mantenha-se atualizado com as últimas inovações do FrotaVision! Receba
          dicas exclusivas, promoções especiais e novidades sobre melhorias no
          sistema que vão ajudar a tornar a gestão da sua frota ainda mais
          eficiente. Inscreva-se e não perca nenhuma novidade!
        </Typography>
        <Box className="email-input-container">
          <FormControl className="email-form-control" variant="standard">
            <TextField
              id="email-input-text-field"
              className="email-input"
              variant="outlined"
              placeholder="example@email.com"
              color="primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              helperText={error ? "Por favor, insira um email válido." : ""}
              sx={{ borderRadius: "0.75rem" }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <EmailIcon className="email-icon" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </FormControl>
          <Button
            variant="contained"
            className="email-button"
            onClick={handleSubmit}
          >
            ENVIAR
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
}
