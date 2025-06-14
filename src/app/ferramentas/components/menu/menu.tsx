"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import EngineeringIcon from "@mui/icons-material/Engineering";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TimelineIcon from "@mui/icons-material/Timeline";
import HelpIcon from "@mui/icons-material/Help";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FrotaVisionLogo from "../../../img/FrotaVisionLogo.png";
import PerfilModal from "./components/perfil-modal/perfil-modal";
import UsuarioDropdown from "./components/usuario-dropdown/usuario-dropdown";
import "./menu.css";

const menuItems = [
  { text: "NOTIFICAÇÕES", icon: <NotificationsIcon /> },
  { text: "VEÍCULOS", icon: <LocalShippingIcon /> },
  { text: "MANUTENÇÕES", icon: <EngineeringIcon /> },
  { text: "MOTORISTAS", icon: <PeopleIcon /> },
  { text: "VIAGENS", icon: <TimelineIcon /> },
  { text: "USUÁRIOS", icon: <AccountCircleIcon /> },
  { text: "AJUDA", icon: <HelpIcon /> },
];

interface MenuFerramentasProps {
  onMenuClick: (pagina: string) => void;
  visible: boolean;
  onToggleMenu: () => void;
}

export default function MenuFerramentas({
  onMenuClick,
  visible,
  onToggleMenu,
}: MenuFerramentasProps) {
  const [activeItem, setActiveItem] = useState(menuItems[0].text);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [perfilModalOpen, setPerfilModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleUserClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setDropdownOpen((prev) => !prev);
  };

  const handleToggleMenuAndCloseDropdown = () => {
    setDropdownOpen(false); // Garante fechamento do dropdown
    onToggleMenu(); // Alterna menu
  };

  return (
    <>
      {!isMobile && visible && (
        <IconButton
          onClick={handleToggleMenuAndCloseDropdown}
          className="menu-hide-floating"
        >
          <ArrowBackIcon sx={{ fontSize: "1.2rem" }} />
        </IconButton>
      )}

      <Box
        className={`menu-container ${isMobile ? "mobile-menu" : ""} ${
          !visible && !isMobile ? "slide-out" : ""
        }`}
      >
        <Box className="menu-header">
          <Image
            src={FrotaVisionLogo}
            alt="FrotaVision Logo"
            className="menu-logo"
            priority
          />

          {isMobile && (
            <Box className="menu-icons-header">
              <IconButton className="avatar-icon">
                <Avatar
                  src="https://randomuser.me/api/portraits/men/1.jpg"
                  sx={{ width: "2rem", height: "2rem" }}
                />
              </IconButton>
              <IconButton
                onClick={handleMenuToggle}
                className="menu-hamburguer"
              >
                <MenuIcon sx={{ fontSize: "1.3rem", color: "white" }} />
              </IconButton>
            </Box>
          )}
        </Box>

        {!isMobile && visible && (
          <Box className="menu-lateral">
            <Box sx={{ padding: "0.5rem" }}>
              <Box className="user-info" onClick={handleUserClick}>
                <AccountCircleIcon
                  className="user-avatar"
                  sx={{ width: "2rem", height: "2rem" }}
                />
                <Typography className="user-name" variant="body1">
                  {session?.user?.nome || "Sem nome"}
                </Typography>
                <KeyboardArrowDownIcon className="user-dropdown-icon" />
              </Box>

              <UsuarioDropdown
                open={dropdownOpen}
                anchorEl={anchorEl}
                onClose={() => setDropdownOpen(false)}
                onOpenSettings={() => {
                  setDropdownOpen(false);
                  setPerfilModalOpen(true);
                }}
              />
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
                  <ListItemIcon className="menu-icon">{item.icon}</ListItemIcon>
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
      </Box>

      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={handleMenuToggle}
        className="drawer-menu"
      >
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
              <ListItemIcon className="menu-icon">{item.icon}</ListItemIcon>
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

      {!isMobile && !visible && (
        <IconButton
          onClick={handleToggleMenuAndCloseDropdown}
          className="menu-float-toggle"
        >
          <MenuIcon sx={{ fontSize: "1.2rem" }} />
        </IconButton>
      )}

      <PerfilModal
        open={perfilModalOpen}
        onClose={() => setPerfilModalOpen(false)}
      />
    </>
  );
}
