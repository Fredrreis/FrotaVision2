"use client";

import React, { useEffect } from "react"; // Adicione o useEffect aqui
import './home.css';
import { Button, Container, Typography } from "@mui/material";
import Header from "./components/header/header";
import Video from "./components/video/video";
import Servico from "./components/servico/servico";
import Planos from "./components/planos/planos";

export interface HomeProps {}

export const Home: React.FC<HomeProps> = (props) => {

    return (
        <>
            <Header />
            <Video />
            <Servico />
            <Planos />
        </>
    );
};
