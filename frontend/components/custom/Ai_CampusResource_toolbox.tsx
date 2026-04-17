"use client";
import React from "react";
import { BackgroundGradient } from "../ui/background-gradient";
import { Ai_CampusResource_card } from "./Ai_CampusResource_card";
export const Ai_CampusResource_toolbox = () => {

    return (
        <main className="p-5 m-5">
            <BackgroundGradient className=" rounded-lg w-full p-4 bg-card">
                <section className="flex flex-wrap">
                    <Ai_CampusResource_card />
                </section>
            </BackgroundGradient>
        </main>
    )
}
