"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Link,
  IconButton,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { useRouter } from "next/navigation";
import { scroller } from "react-scroll";
import "./footer.css";

export const Footer: React.FC = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);

  const handleScrollToPlanos = () => {
    scroller.scrollTo("planos", {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
      offset: -130,
    });
  };

  const handleSupportClick = () => {
    window.open("https://forms.gle/aSWMEtPB1wQZxryNA", "_blank");
  };

  const handleWorkWithUsClick = () => {
    window.open("https://forms.gle/sPYUF7ampHZpCrmK6", "_blank");
  };

  const sections = [
    {
      title: "MINHA CONTA",
      links: [
        { text: "Log In", action: () => router.push("auth/login") },
        { text: "Assinatura", action: handleScrollToPlanos },
        { text: "Cancelamento", action: () => setOpenDialog(true) },
      ],
    },
    {
      title: "AJUDA",
      links: [
        { text: "Suporte", action: handleSupportClick },
        { text: "Ferramentas", action: () => {} },
      ],
    },
    {
      title: "SOBRE",
      links: [
        { text: "Nossa História", action: () => {} },
        { text: "Media", action: () => {} },
        { text: "Trabalhe Conosco", action: handleWorkWithUsClick },
      ],
    },
    {
      title: "CONTATO",
      links: [
        {
          text: (
            <>
              <EmailIcon
                sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }}
              />
              frotavisionofficial@gmail.com
            </>
          ),
          action: () => {},
        },
        {
          text: (
            <>
              <PhoneIcon
                sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }}
              />
              31 99182-6912
            </>
          ),
          action: () => {},
        },
        {
          text: (
            <>
              <PhoneIcon
                sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }}
              />
              31 99995-2129
            </>
          ),
          action: () => {},
        },
      ],
    },
  ];

  return (
    <Box className="footer-container">
      <Box className="footer-content-row">
        <Box className="footer-sections">
          {sections.map((section, index) =>
            isMobile ? (
              <Accordion key={index} className="footer-accordion">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#cfcfcf" }} />}
                >
                  <Typography className="footer-title">
                    {section.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className="accordion-details">
                  {section.links.map((link, idx) => (
                    <Link
                      key={idx}
                      component="button"
                      onClick={link.action}
                      className="footer-link"
                      sx={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {link.text}
                    </Link>
                  ))}
                </AccordionDetails>
              </Accordion>
            ) : (
              <Box key={index} className="footer-section">
                <Typography variant="h6" className="footer-title">
                  {section.title}
                </Typography>
                {section.links.map((link, idx) => (
                  <Link
                    key={idx}
                    component="button"
                    onClick={link.action}
                    className="footer-link"
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {link.text}
                  </Link>
                ))}
              </Box>
            )
          )}
        </Box>
      </Box>

      <Box className="footer-section">
        <Box className="social-icons">
          <IconButton component="a" href="https://x.com" target="_blank">
            <XIcon />
          </IconButton>
          <IconButton
            component="a"
            href="https://instagram.com"
            target="_blank"
          >
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

      <Box className="footer-copyright">
        <Typography variant="body2" className="copyrightText">
          © 2025 FrotaVision Inc. All Rights Reserved
        </Typography>
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        classes={{ paper: "footer-dialog" }}
      >
        <DialogTitle align="center" className="footer-dialog-title">
          Informações de Cancelamento
        </DialogTitle>
        <DialogContent className="footer-dialog-content">
          <Typography variant="body2">
            Para realizar o cancelamento, entre em contato com nosso e-mail:{" "}
            <span className="email-frota-vision">
              frotavisionofficial@gmail.com
            </span>
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
