"use client";

import { useState, useEffect } from "react";
import {
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import FrotaVisionLogo from "../../../img/FrotaVisionLogo.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HelpIcon from "@mui/icons-material/Help";
import Image from "next/image";
import "./header.css";
import { Link } from "react-scroll";

export default function Header() {
  const router = useRouter();
  const [active, setActive] = useState("HOME");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (section: string) => {
    setActive(section);
    handleMenuClose();
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Se a tela for menor que 768px, ativa modo mobile
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Se rolou mais de 50px, ativa a classe fixa
    };

    handleResize(); // Definir valor inicial
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box className="header-container">
      {/* Primeiro Toolbar - Azul */}
      <Box
        className={`header-blue-bg ${
          isMobile && isScrolled ? "fixed-header" : ""
        }`}
      >
        <Toolbar className="header-toolbar-blue">
          <Box>
            <Image
              src={FrotaVisionLogo}
              alt="FrotaVision Logo"
              className="header-logo"
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              marginLeft: "auto",
              alignItems: "center",
            }}
          >
            <Button
              onClick={() => router.push("/support")}
              className="header-fale-conosco"
              sx={{ color: "#FFF", textTransform: "none" }}
              startIcon={<HelpIcon />}
            >
              Fale Conosco
            </Button>

            <Button
              onClick={() => router.push("/auth/login")}
              sx={{
                display: { xs: "none", md: "flex" },
                color: "#1B3562",
                textTransform: "none",
                backgroundColor: "white",
                padding: "0.3rem",
                borderRadius: "0.40rem",
              }}
            >
              Login
            </Button>

            <IconButton
              onClick={() => router.push("/auth/login")}
              sx={{ display: { xs: "flex", md: "none" }, color: "#FFF" }}
            >
              <AccountCircleIcon />
            </IconButton>

            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
              sx={{
                display: {
                  xs: "block",
                  md: "none",
                  marginTop: "0.5rem",
                  marginLeft: "0.2rem",
                },
                color: "#FFF",
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {["HOME", "SERVIÇO", "PLANOS", "SOBRE", "SUPORTE"].map((item) => (
                <MenuItem key={item} onClick={() => handleMenuClick(item)}>
                  <Link
                    to={item.toLowerCase()}
                    smooth={true}
                    duration={500}
                    offset={-60}
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
      {!isMobile && (
        <Box
          className={`header-white-bg ${isScrolled ? "fixed-header" : ""}`}
          sx={{ display: { xs: "none", md: "block" } }}
        >
          <Toolbar className="header-toolbar-white">
            <Box sx={{ display: "flex", gap: 4 }}>
              {["HOME", "SERVIÇO", "PLANOS", "SOBRE", "SUPORTE"].map((item) => (
                <Link
                  key={item}
                  to={item.toLowerCase()}
                  smooth={true}
                  duration={500}
                  offset={-130}
                  className={`nav-link ${active === item ? "active" : ""}`}
                  onClick={() => handleMenuClick(item)}
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
      )}
    </Box>
  );
}
