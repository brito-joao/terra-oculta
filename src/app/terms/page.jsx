"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import { ThreeBackground } from "../components/Background";

const terms = [
  "Bem-vindo à Terra Oculta — um espaço livre, louco e cheio de surpresas. Diga o que quiser: teorias malucas, conspirações exorbitantes... tudo é permitido.",
  "⚠️ Este é um ambiente aberto. Nós não filtramos conteúdo — a não ser que os administradores acordem de mau humor. Nesse caso, seu comentário desaparece no multiverso.",
  "Não nos responsabilizamos por opiniões dos utilizadores. Se você se sentiu ofendido... talvez a internet não seja pra ti.",
  "Sem spam. Besteiras sim, flood não. Cripto scam = ban instantâneo.",
  "Este site pode mudar a qualquer momento: regras, design, realidade. Literalmente tudo.",
  "Quer deletar sua conta? Ainda não adicionamos esta funcionalidade, sorry :)  Quer dizer que a Terra é plana? Vai nessa.",
  "Resumindo: liberdade total. Mas os Admin é que mandam, e podem te deletar com um clique se for necessário.",
];

const flicker = {
  initial: { opacity: 0.6 },
  animate: {
    opacity: [0.6, 1, 0.6],
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "easeInOut",
    },
  },
};

const TermsPage = () => {
  return (
    <motion.div
      className="min-h-screen bg-[#010b05] text-[#33ff33] font-mono overflow-hidden relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <Navbar />

      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <ThreeBackground />
        <div className="absolute inset-0 bg-black opacity-80" />
        <div className="absolute inset-0 bg-[linear-gradient(transparent_95%,#0f0_95%)] bg-[length:100%_2px] opacity-5 pointer-events-none" />
      </div>

      {/* Header */}
      <main className="relative max-w-6xl mx-auto px-4 py-24 z-10">
        <motion.h1
          className="text-3xl sm:text-5xl font-extrabold text-center uppercase tracking-[0.2em] border-b border-green-700 pb-6"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          ⚙️ Termos & Condições ⚙️
        </motion.h1>

        {/* Terms */}
        <div className="mt-12 space-y-6">
          {terms.map((text, idx) => (
            <motion.div
              key={idx}
              className="border border-green-700 bg-black p-4 text-sm sm:text-base tracking-wide shadow-[0_0_12px_#33ff3340]"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <p className="text-[#a0ffb2] leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>

        {/* Footer Date */}
        <motion.div
          className="mt-12 text-center text-xs text-green-600 uppercase tracking-widest"
          variants={flicker}
          initial="initial"
          animate="animate"
        >
          Última atualização: {new Date().toLocaleDateString("pt-PT")}
        </motion.div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default TermsPage;
