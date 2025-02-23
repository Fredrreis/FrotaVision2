"use client";

import React, { useRef, useEffect } from "react";
import './home.css';
import Header from "./components/header/header";
import Video from "./components/video/video";
import Servico from "./components/servico/servico";
import Planos from "./components/planos/planos";
import Email from "./components/email/email";
import { Footer } from "./components/footer/footer";
import { Box } from "@mui/material";
import { Element } from 'react-scroll';

export interface HomeProps {}

export const Home: React.FC<HomeProps> = (props) => {
    const servicoRef = useRef<HTMLDivElement>(null);
    const planosRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <>
            <Header />
            <Element name="home">
                <Video />
            </Element>
            <Element name="serviço">
                <Box ref={servicoRef}>
                    <Servico />
                </Box>
            </Element>
            <Element name="planos">
                <Box ref={planosRef}>
                    <Planos />
                </Box>
            </Element>
            <Email />
            <Footer />
        </>
    );
};