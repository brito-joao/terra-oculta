"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import { ThreeBackground } from "../components/Background";
import Image from "next/image";

const CareersPage = () => {
    return (
        <motion.div
            className="bg-[#0a0a0a] text-white min-h-screen font-sans overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
        >
            <Navbar />

            <div className="bg-[#0a0a0a] fixed top-0 left-0 w-full h-full -z-10">
                <ThreeBackground />
            </div>

            <main className="relative px-6 py-24 max-w-6xl mx-auto z-10">
                <motion.h1
                    className="text-4xl sm:text-6xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-[#A259FF] to-[#0ABDC6]"
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    Junte-se à Revolução
                </motion.h1>

                <motion.p
                    className="text-center text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Na <span className="text-cyan-400 font-semibold">Terra Oculta</span>, não estamos apenas construindo um site — estamos criando um portal para explorar o extraordinário.
                    Se você sente que nasceu para algo maior, esse é o seu chamado.
                </motion.p>

                <motion.div
                    className="bg-gradient-to-br from-[#A259FF]/10 to-[#0ABDC6]/10 p-8 rounded-2xl border border-[#333] shadow-xl mb-24"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#A259FF] to-[#0ABDC6] mb-6">
                        Nossa História
                    </h2>
                    <p className="text-gray-300 text-lg leading-relaxed mb-4">
                        A <strong>Terra Oculta</strong> nasceu como uma ideia maluca entre três jovens do <strong>Instituto Politécnico de Setúbal</strong> — um site simples para reunir imagens estranhas da Terra.
                        O que era um projeto entre amigos se tornou viral. Ganhamos destaque global com nossa forma única de explorar o mundo, e em poucos anos, nos tornamos uma empresa com mais de <strong>100 colaboradores</strong> espalhados pelo planeta.
                    </p>
                    <p className="text-gray-300 text-lg leading-relaxed mb-4">
                        Hoje, temos uma nova missão: transformar a Terra Oculta em uma <strong>plataforma 3D</strong> onde qualquer pessoa possa explorar o planeta em tempo real — com gráficos de última geração, inteligência artificial e experiências imersivas de tirar o fôlego. Deixamos de ser apenas um blog: estamos entrando nos mercados de <strong>game design</strong>, <strong>tecnologia</strong> e <strong>experiência espacial interativa</strong>.
                    </p>
                    <p className="text-gray-400 italic">
                        Agora, precisamos de talentos que compartilhem essa visão.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 mb-24">
                    <motion.div
                        className="relative h-80 w-full rounded-3xl overflow-hidden border border-[#A259FF]/40"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9 }}
                    >
                        <Image src="/picture1.webp" alt="Escritório Terra Oculta 1" fill className="object-cover" />
                    </motion.div>

                    <motion.div
                        className="relative h-80 w-full rounded-3xl overflow-hidden border border-[#0ABDC6]/40"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.1 }}
                    >
                        <Image src="/picture2.jpg" alt="Escritório Terra Oculta 2" fill className="object-cover" />
                    </motion.div>
                </div>

                <motion.div
                    className="bg-gradient-to-br from-[#A259FF]/10 to-[#0ABDC6]/10 p-8 rounded-2xl border border-[#333] shadow-xl mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#A259FF] to-[#0ABDC6] mb-6">
                        Quem estamos procurando
                    </h2>

                    <ul className="space-y-4 text-gray-300 text-lg leading-relaxed list-disc list-inside">
                        <li><strong>Frontend Visionários:</strong> React, Next.js, animações, microinterações, estilo. Se você ama criar experiências visuais... este é o seu lugar.</li>
                        <li><strong>Designers Artísticos:</strong> Estudantes de Design, UX/UI apaixonados, ou artistas digitais — queremos mentes criativas, não só diplomas.</li>
                        <li><strong>Exploradores de Dados:</strong> Você adora descobrir padrões estranhos no mundo, mapas, easter eggs da realidade? Perfeito.</li>
                        <li><strong>Hackers Éticos:</strong> Curiosos, questionadores, que quebram coisas (e depois consertam melhor).</li>
                        <li><strong>Criadores de Conteúdo:</strong> Se você sabe contar histórias, memes ou vídeos — venha dar voz à Terra Oculta.</li>
                    </ul>
                </motion.div>

                <motion.div
                    className="bg-[#111] border border-[#333] p-8 rounded-2xl shadow-xl mb-24"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 }}
                >
                    <h2 className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-4">
                        O que esperamos de você
                    </h2>
                    <ul className="space-y-3 text-gray-400 text-md leading-relaxed list-inside list-disc">
                        <li>Curiosidade e sede por aprender</li>
                        <li>Paixão por criar experiências visuais, ideias novas ou conteúdo autêntico</li>
                        <li>Compromisso — mesmo que em horários flexíveis</li>
                        <li>Vontade de causar impacto real em algo criativo</li>
                        <li>💡 Alunos do <strong>Instituto Politécnico de Setúbal</strong> são altamente encorajados a aplicar!</li>
                        <li>📍 Podes trabalhar <strong>100% remotamente</strong> — seu talento é bem-vindo de qualquer localização do mundo</li>
                    </ul>
                </motion.div>

                <div className="text-center mb-16">
                    <h3 className="text-xl font-semibold mb-2">Vamos fazer história juntos?</h3>
                    <a
                        href="mailto:britojoao366@gmail.com"
                        className="inline-block px-10 py-4 bg-gradient-to-r from-[#A259FF] to-[#0ABDC6] text-black font-bold rounded-full shadow-md hover:scale-105 transition-transform"
                    >
                        Enviar Candidatura
                    </a>
                </div>

                <div className="text-center">
                    <p className="text-gray-500 text-sm">
                        Última atualização: {new Date().toLocaleDateString("pt-PT")}
                    </p>
                </div>
            </main>

            <Footer />
        </motion.div>
    );
};

export default CareersPage;
