"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import { OtherBackground } from "../components/Background";

const founders = [
    { name: "Rafa", img: "/rafa.jpeg", role: "Digital Crusader" },
    { name: "João", img: "/joao.jpeg", role: "Mastermind Tactician" },
    { name: "Israel Bapolo", img: "/defaultUser.png", role: "Art Warrior" },
];

const team = [
    { name: "Ana Silva", role: "Code Enchanter" },
    { name: "Miguel Torres", role: "Vision Scout" },
    { name: "Leonor Matos", role: "Texture Alchemist" },
    { name: "Carlos Mendes", role: "Server Whisperer" },
    { name: "Bruna Costa", role: "UI Sorceress" },
    { name: "Pedro Lemos", role: "Bug Hunter" },
];

export default function AboutUsPage() {
    const router = useRouter();

    return (
        <motion.div className="relative min-h-screen text-white overflow-hidden font-sans">
            <div className="fixed bg-black inset-0 -z-10">
                <OtherBackground />
            </div>

            <Navbar />

            <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
                <motion.h1
                    className="text-6xl md:text-8xl font-black bg-gradient-to-r from-[#A259FF] to-[#0ABDC6] text-transparent bg-clip-text drop-shadow-lg"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    Mentes por Trás da Missão
                </motion.h1>
                <motion.p
                    className="text-gray-400 text-lg md:text-2xl mt-4 max-w-2xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Fundadores visionários que unem arte, tecnologia e curiosidade para revelar os segredos do mundo.
                </motion.p>
                <motion.button
                    onClick={() => router.push("/")}
                    className="mt-10 px-8 py-3 rounded-full bg-[#0ABDC6] text-black font-bold shadow-lg hover:shadow-xl hover:bg-[#09a9b5] transition"
                    whileHover={{ scale: 1.05 }}
                >
                    Voltar ao Início
                </motion.button>
            </section>

            {/* Founders Section */}
            <section className="px-6 pb-28 max-w-6xl mx-auto">
                <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
                    {founders.map((member, idx) => (
                        <motion.div
                            key={idx}
                            className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-3xl p-6 text-center shadow-[0_0_30px_#0ABDC680] hover:shadow-[0_0_50px_#A259FF90] transition-all duration-300 group relative overflow-hidden"
                            whileHover={{ y: -10, scale: 1.03 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#0ABDC620] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse pointer-events-none z-0 rounded-3xl" />
                            <div className="w-36 h-36 mx-auto relative mb-6 rounded-full overflow-hidden shadow-inner border-4 border-[#A259FF30] z-10">
                                <Image
                                    src={member.img}
                                    fill
                                    alt={member.name}
                                    className="object-cover scale-105 transition-transform duration-500 group-hover:scale-110"
                                    priority
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-[#A259FF] z-10 relative tracking-wide drop-shadow-sm uppercase">
                                {member.name}
                            </h3>
                            <p className="text-sm mt-2 text-[#b3b3b3] tracking-widest z-10 relative font-mono">
                                {member.role}
                            </p>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-1 bg-gradient-to-r from-[#A259FF] via-[#0ABDC6] to-[#A259FF] opacity-70 rounded-full blur-sm group-hover:opacity-100 transition-all duration-500 z-10" />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Additional Team Members */}
            <section className="px-6 pb-32 max-w-5xl mx-auto">
                <motion.h2
                    className="text-3xl sm:text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#A259FF] to-[#0ABDC6]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Guerreiros da Nova Geração
                </motion.h2>

                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {team.map((member, idx) => (
                        <motion.div
                            key={idx}
                            className="bg-[#101010] border border-[#222] rounded-xl p-4 text-center shadow-md hover:shadow-[0_0_20px_#A259FF60] transition-all"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                        >
                            <div className="w-24 h-24 mx-auto mb-4 relative rounded-full overflow-hidden border-2 border-[#A259FF30]">
                                <Image
                                    src="/defaultUser.png"
                                    fill
                                    alt={member.name}
                                    className="object-cover"
                                />
                            </div>
                            <h4 className="text-lg font-semibold text-[#0ABDC6]">{member.name}</h4>
                            <p className="text-sm text-gray-400 font-mono mt-1">{member.role}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <motion.section
                className="bg-gradient-to-r from-[#0ABDC6] to-[#A259FF] text-black py-24 px-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <h2 className="text-4xl md:text-6xl font-extrabold drop-shadow-xl">
                    Junte-se à Revolução da Terra Oculta
                </h2>
                <p className="text-lg md:text-xl mt-6 max-w-2xl mx-auto">
                    Descubra mistérios geográficos através de tecnologia de visualização futurista e experiências imersivas.
                </p>
                <motion.button
                    onClick={() => router.push("/careers")}
                    className="mt-10 px-8 py-3 rounded-full bg-black text-white font-bold shadow-lg hover:bg-gray-800 transition"
                    whileHover={{ scale: 1.05 }}
                >
                    Faça Parte da Equipa
                </motion.button>

            </motion.section>

            <Footer />
        </motion.div>
    );
}
