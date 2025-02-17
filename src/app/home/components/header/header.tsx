"use client";

import { useState } from "react";
import { Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import FrotaVisionLogo from "../../../img/FrotaVisionLogo.png";
import Image from 'next/image';
import Link from "next/link";
import "./header.css";

export default function Header() {
  const [active, setActive] = useState("HOME");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box className="header-container">
      {/* Primeiro Toolbar - Azul */}
      <Box className="header-blue-bg">
        <Toolbar className="header-toolbar-blue">
          <Box>
            <Image src={FrotaVisionLogo} alt="FrotaVision Logo" className="header-logo" />
          </Box>
          <Box sx={{ display: "flex", gap: 2, marginLeft: 'auto' }}>
            <Button sx={{ color: "#FFF", textTransform: "none" }}>Log In</Button>
            <Button 
              variant="contained" 
              sx={{ 
                backgroundColor: "#FFF", 
                borderRadius: "0.5rem",
                color: "#173165", 
                textTransform: "none", 
                display: { xs: 'none', md: 'block' },
                "&:hover": { backgroundColor: "#E5E5E5" } 
              }}
            >
              Inscreva-se
            </Button>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
              sx={{ display: { xs: 'block', md: 'none', marginTop: "0.5rem" }, color: '#FFF' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {["HOME", "SERVIÇO", "PLANOS", "SOBRE", "SUPORTE"].map((item) => (
                <MenuItem
                  key={item}
                  onClick={() => {
                    setActive(item);
                    handleMenuClose();
                  }}
                >
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className={`nav-link ${active === item ? "active" : ""}`}
                  >
                    <Typography
                      variant="body1"
                      className={`nav-text ${active === item ? "active" : ""}`}
                      sx={{ fontWeight: active === item ? "bold" : "medium" }}
                    >
                      {item}
                    </Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Box>

      {/* Segundo Toolbar - Branco */}
      <Box className="header-white-bg" sx={{ display: { xs: 'none', md: 'block' } }}> 
        <Toolbar className="header-toolbar-white">
          <Box sx={{ display: 'flex', gap: 4 }}>
            {["HOME", "SERVIÇO", "PLANOS", "SOBRE", "SUPORTE"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className={`nav-link ${active === item ? "active" : ""}`}
                onClick={() => setActive(item)}
              >
                <Typography
                  variant="body1"
                  className={`nav-text ${active === item ? "active" : ""}`}
                  sx={{ fontWeight: active === item ? "bold" : "medium" }}
                >
                  {item}
                </Typography>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </Box>
    </Box>
  );
}