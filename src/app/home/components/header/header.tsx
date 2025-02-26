"use client";

import { useState } from "react";
import { Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';
import FrotaVisionLogo from "../../../img/FrotaVisionLogo.png";
import Image from 'next/image';
import "./header.css";
import { Link } from 'react-scroll';

export default function Header() {
    const router = useRouter()
    const [active, setActive] = useState("HOME");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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

    return (
        <Box className="header-container">
            {/* Primeiro Toolbar - Azul */}
            <Box className="header-blue-bg">
                <Toolbar className="header-toolbar-blue">
                    <Box>
                        <Image src={FrotaVisionLogo} alt="FrotaVision Logo" className="header-logo" />
                    </Box>
                    <Box sx={{ display: "flex", gap: 2, marginLeft: 'auto' }}>
                        <Button 
                            onClick={() => router.push('/auth')}
                            sx={{ color: "#FFF", textTransform: "none" }}
                        >
                            Log In
                        </Button>
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
                                    onClick={() => handleMenuClick(item)}
                                >
                                    <Link
                                        to={item.toLowerCase()}
                                        smooth={true}
                                        duration={500}
                                        offset={-130} // Ajuste este valor conforme necessário
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
                                to={item.toLowerCase()}
                                smooth={true}
                                duration={500}
                                offset={-130} // Ajuste este valor conforme necessário
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
        </Box>
    );
}