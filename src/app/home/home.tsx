"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import './home.css';
import Header from "./components/header/header";
import Video from "./components/video/video";
import Servico from "./components/servico/servico";
import Planos from "./components/planos/planos";
import Email from "./components/email/email";
import { Footer } from "./components/footer/footer";
import { Box } from "@mui/material";
import { Element, scroller } from 'react-scroll';

export interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sectionParam = searchParams.get("section");
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }

        if (sectionParam === "planos") {
            setTimeout(() => {
                scroller.scrollTo("planos", {
                    duration: 800,
                    delay: 0,
                    smooth: "easeInOutQuart",
                    offset: -130,
                });

                //Remove o parâmetro da URL após o scroll para evitar problemas ao dar F5 ou voltar para a Home
                router.replace("/", { scroll: false });
            }, 500);
        }
    }, [sectionParam, router]);

    if (!isClient) return null; // Evita renderização no SSR

    return (
        <>
            <Header />
            <Element name="home">
                <Video />
            </Element>
            <Element name="serviço">
                <Box>
                    <Servico />
                </Box>
            </Element>
            <Element name="planos">
                <Box>
                    <Planos />
                </Box>
            </Element>
            <Email />
            <Footer />
        </>
    );
};
