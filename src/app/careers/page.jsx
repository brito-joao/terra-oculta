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
      className="bg-[#010b05] text-[#33ff33] min-h-screen font-mono overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <Navbar />

      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <ThreeBackground />
      </div>

      <main className="relative px-6 py-24 max-w-5xl mx-auto z-10 border-x border-green-700">
        <motion.h1
          className="text-3xl sm:text-5xl font-bold uppercase tracking-widest text-center border-b border-green-800 pb-6"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          JUNTE-SE À REVOLUÇÃO
        </motion.h1>

        <motion.p
          className="text-center text-sm sm:text-base mt-6 text-green-300 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Na <span className="text-[#00ff99] font-bold">Terra Oculta</span>, não estamos apenas criando um site —
          estamos construindo uma nova realidade digital. Se você sente que nasceu para algo
          maior, este é o seu chamado.
        </motion.p>

        <motion.div
          className="border border-green-700 p-6 mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-2xl font-bold uppercase tracking-wider border-b border-green-600 pb-2 mb-4">
            Nossa História
          </h2>
          <p className="text-sm text-green-400 leading-relaxed mb-3">
            A <strong>Terra Oculta</strong> nasceu como uma ideia entre três jovens do
            <strong> Instituto Politécnico de Setúbal</strong> — um site para reunir imagens
            bizarras da Terra. Rapidamente se tornou viral.
          </p>
          <p className="text-sm text-green-400 leading-relaxed mb-3">
            Hoje, somos uma empresa global com mais de <strong>100 colaboradores</strong> e estamos
            construindo uma plataforma 3D com experiências imersivas em tempo real, combinando
            <strong> game design</strong>, <strong>AI</strong> e visualização espacial.
          </p>
          <p className="text-xs italic text-green-600">Precisamos de mentes como a sua.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mt-16">
          <motion.div
            className="relative h-72 w-full overflow-hidden border border-green-700"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Image src="/picture1.webp" alt="Escritório Terra Oculta 1" fill className="object-cover" />
          </motion.div>

          <motion.div
            className="relative h-72 w-full overflow-hidden border border-green-700"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 }}
          >
            <Image src="/picture2.jpg" alt="Escritório Terra Oculta 2" fill className="object-cover" />
          </motion.div>
        </div>

        <motion.div
          className="border border-green-700 p-6 mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <h2 className="text-2xl font-bold uppercase tracking-wider border-b border-green-600 pb-2 mb-4">
            Procuramos
          </h2>
          <ul className="text-sm text-green-400 space-y-2 list-disc list-inside">
            <li><strong>Frontend Visionários</strong>: React, animações, microinterações, estilo visual forte.</li>
            <li><strong>Designers Artísticos</strong>: UX/UI ou artistas digitais com visão única.</li>
            <li><strong>Exploradores de Dados</strong>: Obcecados por padrões, mapas e realidade alternativa.</li>
            <li><strong>Hackers Éticos</strong>: Curiosos que quebram e consertam melhor.</li>
            <li><strong>Criadores de Conteúdo</strong>: Narradores, memers, editores — você nos completa.</li>
          </ul>
        </motion.div>

        <motion.div
          className="border border-green-800 p-6 mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
        >
          <h2 className="text-xl font-bold text-[#00ff99] uppercase mb-4">O que esperamos de você</h2>
          <ul className="text-sm text-green-500 space-y-2 list-disc list-inside">
            <li>Curiosidade e sede por aprender</li>
            <li>Paixão por criar coisas únicas ou conteúdos autênticos</li>
            <li>Comprometimento — mesmo que com horários flexíveis</li>
            <li>Desejo de causar impacto real</li>
            <li>🎓 Estudantes do <strong>IPS</strong> são altamente encorajados</li>
            <li>🌐 Trabalho <strong>100% remoto</strong> — de qualquer lugar do mundo</li>
          </ul>
        </motion.div>

        <div className="text-center mt-20">
          <h3 className="text-lg font-semibold uppercase mb-2">Vamos fazer história juntos?</h3>
          <a
            href="mailto:britojoao366@gmail.com"
            className="inline-block px-6 py-2 border border-green-400 text-green-300 hover:bg-green-900/20 transition-all tracking-widest text-sm uppercase"
          >
            Enviar Candidatura
          </a>
        </div>

        <div className="text-center mt-8">
          <p className="text-green-600 text-xs">
            Última atualização: {new Date().toLocaleDateString("pt-PT")}
          </p>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default CareersPage;
