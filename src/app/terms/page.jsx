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

const TermsPage = () => {
  return (
    <motion.div
      className="bg-[#080808] text-white min-h-screen font-sans overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <Navbar />
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-black opacity-80">
        <ThreeBackground />
      </div>

      <main className="relative px-6 py-24 max-w-6xl mx-auto z-10">
        <motion.h1
          className="text-4xl sm:text-6xl font-extrabold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-[#A259FF] to-[#0ABDC6] animate-pulse"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          ⚙️ Termos & Condições do Terra Oculta ⚙️
        </motion.h1>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {terms.map((text, idx) => (
            <motion.div
              key={idx}
              className="p-6 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl shadow-lg border border-[#A259FF]/30 backdrop-blur-lg hover:scale-105 transition-transform duration-300"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-300 text-md leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 italic mt-12">
          Última atualização: {new Date().toLocaleDateString("pt-PT")}
        </p>
      </main>

      <Footer />
    </motion.div>
  );
};

export default TermsPage;
