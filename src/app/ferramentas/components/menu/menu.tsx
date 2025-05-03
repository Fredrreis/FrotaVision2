"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import EngineeringIcon from "@mui/icons-material/Engineering";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TimelineIcon from "@mui/icons-material/Timeline";
import DescriptionIcon from "@mui/icons-material/Description";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FrotaVisionLogo from "../../../img/FrotaVisionLogo.png";
import Image from "next/image";
import "./menu.css";
import React from "react";

const menuItems = [
  { text: "NOTIFICAÇÕES", icon: <NotificationsIcon /> },
  { text: "VEÍCULOS", icon: <LocalShippingIcon /> },
  { text: "MANUTENÇÕES", icon: <EngineeringIcon /> },
  { text: "MOTORISTAS", icon: <PeopleIcon /> },
  { text: "VIAGENS", icon: <TimelineIcon /> },
  { text: "USUÁRIOS", icon: <AccountCircleIcon /> },
  { text: "AJUDA", icon: <HelpOutlineIcon /> },
  { text: "SAIR", icon: <ExitToAppIcon /> },
];

interface MenuFerramentasProps {
  onMenuClick: (pagina: string) => void;
}

export default function MenuFerramentas({ onMenuClick }: MenuFerramentasProps) {
  const [activeItem, setActiveItem] = useState(menuItems[0].text);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detecta quando a tela fica menor que 768px e FECHA o Drawer ao aumentar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
        setIsMobile(false);
      } else {
        setIsMobile(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Box className={`menu-container ${isMobile ? "mobile-menu" : ""}`}>
      {/* Header Azul */}
      <Box className="menu-header">
        <Image
          src={FrotaVisionLogo}
          alt="FrotaVision Logo"
          className="menu-logo"
          priority
        />
        <Box className="menu-icons-header">
          {/* Ícone do Avatar no Mobile - Agora com imagem real */}
          {isMobile && (
            <IconButton className="avatar-icon">
              <Avatar
                src="https://randomuser.me/api/portraits/men/1.jpg"
                sx={{ width: "2rem", height: "2rem" }}
              />
            </IconButton>
          )}

          {/* Ícone do Menu Hamburguer - Somente no Mobile */}
          {isMobile && (
            <IconButton onClick={handleMenuToggle} className="menu-hamburguer">
              <MenuIcon sx={{ fontSize: "1.3rem", color: "white" }} />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Menu lateral fixo no Desktop */}
      {!isMobile && (
        <Box className="menu-lateral">
          <Box className="user-info">
            <Typography className="user-empresa" variant="body1">
              EMPRESA 1
            </Typography>
            <Avatar
              src="https://randomuser.me/api/portraits/men/1.jpg"
              className="user-avatar"
              sx={{ width: "4.5rem", height: "4.5rem" }}
            />
            <Typography className="user-name" variant="body1">
              Paulo Franco
            </Typography>
            <Typography className="user-role" variant="body2">
              Admin
            </Typography>
          </Box>

          <Divider />

          <List className="menu-list">
            {menuItems.map((item, index) => (
              <ListItem
                key={index}
                className={`menu-item ${
                  activeItem === item.text ? "active" : ""
                }`}
                onClick={() => {
                  setActiveItem(item.text);
                  onMenuClick(item.text);
                }}
              >
                <ListItemIcon className="menu-icon">
                  {React.createElement(item.icon.type, {
                    sx: { fontSize: "1.3rem" },
                  })}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography className="menu-text" variant="body2">
                      {item.text}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Drawer para Mobile */}
      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={handleMenuToggle}
        className="drawer-menu"
      >
        {/* Informações do usuário no Drawer */}
        <Box className="user-info-menu">
          <Typography className="user-empresa" variant="body1">
            EMPRESA 1
          </Typography>
          <Avatar
            src="https://randomuser.me/api/portraits/men/1.jpg"
            className="user-avatar"
            sx={{ width: "4.5rem", height: "4.5rem", margin: "auto" }}
          />
          <Typography className="user-name" variant="body1">
            Paulo Franco
          </Typography>
          <Typography className="user-role" variant="body2">
            Admin
          </Typography>
        </Box>

        <Divider />

        <List className="menu-list">
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              className={`menu-item ${
                activeItem === item.text ? "active" : ""
              }`}
              onClick={() => {
                setActiveItem(item.text);
                onMenuClick(item.text);
                setMenuOpen(false);
              }}
            >
              <ListItemIcon className="menu-icon">
                {React.createElement(item.icon.type, {
                  sx: { fontSize: "1.3rem" },
                })}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography className="menu-text" variant="body2">
                    {item.text}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
