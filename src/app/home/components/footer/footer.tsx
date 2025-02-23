"use client";

import React from "react";
import { Box, Typography, Link, IconButton } from "@mui/material";
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import './footer.css';

export const Footer: React.FC = () => {
    return (
        <Box className="footer-container">
            <Box className="footer-sections">
                <Box className="footer-section">
                    <Typography variant="h6" className="footer-title">MINHA CONTA</Typography>
                    <Link href="#" className="footer-link">Log In</Link>
                    <Link href="#" className="footer-link">Cadastrar</Link>
                    <Link href="#" className="footer-link">Cancelamento</Link>
                </Box>
                <Box className="footer-section">
                    <Typography variant="h6" className="footer-title">AJUDA</Typography>
                    <Link href="#" className="footer-link">Suporte</Link>
                    <Link href="#" className="footer-link">E-mail</Link>
                    <Link href="#" className="footer-link">Ferramentas</Link>
                </Box>
                <Box className="footer-section">
                    <Typography variant="h6" className="footer-title">SOBRE</Typography>
                    <Link href="#" className="footer-link">Nossa História</Link>
                    <Link href="#" className="footer-link">Media</Link>
                    <Link href="#" className="footer-link">Trabalhe Conosco</Link>
                </Box>
                <Box className="footer-section">
                    <Typography variant="h6" className="footer-title">LEGALIZAÇÃO</Typography>
                    <Link href="#" className="footer-link">Termos de Uso</Link>
                    <Link href="#" className="footer-link">Termos de Venda</Link>
                    <Link href="#" className="footer-link">Políticas de Privacidade</Link>
                </Box>
                <Box className="footer-section">
                    <Box className="social-icons">
                        <IconButton component="a" href="https://twitter.com" target="_blank">
                            <TwitterIcon />
                        </IconButton>
                        <IconButton component="a" href="https://instagram.com" target="_blank">
                            <InstagramIcon />
                        </IconButton>
                        <IconButton component="a" href="https://youtube.com" target="_blank">
                            <YouTubeIcon />
                        </IconButton>
                        <IconButton component="a" href="https://linkedin.com" target="_blank">
                            <LinkedInIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
            <Box className="footer-copyright">
                <Typography variant="body2" className="copyrightText">© 2025 FrotaVision Inc. All Rights Reserved</Typography>
            </Box>
        </Box>
    );
};
