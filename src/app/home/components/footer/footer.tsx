"use client";

import React from "react";
import { Box, Typography, Link, IconButton, useMediaQuery, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import './footer.css';

export const Footer: React.FC = () => {
    const isMobile = useMediaQuery('(max-width:768px)');

    const sections = [
        { title: "MINHA CONTA", links: ["Log In", "Cadastrar", "Cancelamento"] },
        { title: "AJUDA", links: ["Suporte", "E-mail", "Ferramentas"] },
        { title: "SOBRE", links: ["Nossa História", "Media", "Trabalhe Conosco"] },
        { title: "LEGALIZAÇÃO", links: ["Termos de Uso", "Termos de Venda", "Políticas de Privacidade"] }
    ];

    return (
        <Box className="footer-container">
            <Box className="footer-sections">
                {sections.map((section, index) => (
                    isMobile ? (
                        <Accordion key={index} className="footer-accordion">
                            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{color: "#cfcfcf"}} />}>
                                <Typography className="footer-title">{section.title}</Typography>
                            </AccordionSummary>
                            <AccordionDetails className="accordion-details">
                                {section.links.map((link, idx) => (
                                    <Link key={idx} href="#" className="footer-link">{link}</Link>
                                ))}
                            </AccordionDetails>
                        </Accordion>
                    ) : (
                        <Box key={index} className="footer-section">
                            <Typography variant="h6" className="footer-title">{section.title}</Typography>
                            {section.links.map((link, idx) => (
                                <Link key={idx} href="#" className="footer-link">{link}</Link>
                            ))}
                        </Box>
                    )
                ))}
            </Box>

            <Box className="footer-section">
                    <Box className="social-icons">
                        <IconButton component="a" href="https://twitter.com" target="_blank"><TwitterIcon /></IconButton>
                        <IconButton component="a" href="https://instagram.com" target="_blank"><InstagramIcon /></IconButton>
                        <IconButton component="a" href="https://youtube.com" target="_blank"><YouTubeIcon /></IconButton>
                        <IconButton component="a" href="https://linkedin.com" target="_blank"><LinkedInIcon /></IconButton>
                    </Box>
            </Box>

            <Box className="footer-copyright">
                <Typography variant="body2" className="copyrightText">© 2025 FrotaVision Inc. All Rights Reserved</Typography>
            </Box>
        </Box>
    );
};