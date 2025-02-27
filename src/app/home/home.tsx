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
    const [hasScrolled, setHasScrolled] = useState(false);

    useEffect(() => {
        setIsClient(true);

        if (sectionParam === "planos" && !hasScrolled) {
            setTimeout(() => {
                scroller.scrollTo("planos", {
                    duration: 800,
                    delay: 0,
                    smooth: "easeInOutQuart",
                    offset: -130,
                });

                setHasScrolled(true); 
                
                setTimeout(() => {
                    router.replace("/", { scroll: false });
                }, 500);
            }, 500);
        }
    }, [sectionParam, router, hasScrolled]);

    if (!isClient) return null;

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
