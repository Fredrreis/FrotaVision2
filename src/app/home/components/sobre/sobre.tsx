"use client";

import { Box, Container, Typography, Button } from "@mui/material";

interface SobreProps {
    voltarParaHome: () => void;
}

export default function Sobre({ voltarParaHome }: SobreProps) {
    return (
        <Box sx={{ textAlign: "center", mt: 4 }}>
            <Container maxWidth="md">
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                    Sobre o FrotaVision
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    O FrotaVision é um sistema inovador focado na gestão de manutenção de frotas, 
                    auxiliando empresas no controle de veículos, reduzindo custos e otimizando operações.
                </Typography>
                <Typography variant="body1">
                    Nosso objetivo é fornecer uma solução eficiente para monitoramento de manutenções, 
                    prevenindo falhas e garantindo o melhor desempenho da sua frota.
                </Typography>

                {/* Botão para voltar para a Home */}
                <Button 
                    variant="contained" 
                    onClick={voltarParaHome} 
                    sx={{ mt: 4, backgroundColor: "#1B3562" }}
                >
                    Voltar para a Home
                </Button>
            </Container>
        </Box>
    );
}
