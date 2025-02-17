"use client"
import React, { useEffect } from "react";
import Home from "./home/page";
import { useDispatch, useSelector } from "react-redux";
import HomePage from "./home/page";

export default function App() {

    const dispatch = useDispatch()
    

    return (
        <HomePage />
    );
}