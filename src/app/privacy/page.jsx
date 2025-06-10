"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import { ThreeBackground } from "../components/Background";

const privacyLines = [
  "Política de Privacidade Iniciada...",
  "--------------------------------------------------",
  "Valorizamos mais o dinheiro do que a sua privacidade.",
  "Todos os dados são tratados com segurança (ou não).",
  "Coletamos tudo: nome, e-mail, comentários, localização, pensamentos...",
  "Esses dados podem ser compartilhados com terceiros sem aviso prévio.",
  "Você pode comentar livremente, mas a moderação é ditadura.",
  "Utilizamos cookies para personalizar sua submissão ao sistema.",
  "Ao continuar, você consente com tudo que ainda não leu.",
  "Não garantimos segurança, apenas entretenimento.",
  "Para dúvidas, contate suporte@terraoculta.gov",
  "--------------------------------------------------",
  "FIM DA POLÍTICA. Reiniciando...",
];

const PrivacyPage = () => {
  const [lines, setLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    let typingTimeout;

    // Finished typing all lines
    if (currentLineIndex >= privacyLines.length) {
      typingTimeout = setTimeout(() => {
        setLines([]);
        setCurrentLineIndex(0);
        setCurrentText("");
        setCharIndex(0);
      }, 4000);
      return () => clearTimeout(typingTimeout);
    }

    // Finished typing current line
    if (charIndex >= privacyLines[currentLineIndex]?.length) {
      typingTimeout = setTimeout(() => {
        setLines((prev) => [...prev, privacyLines[currentLineIndex]]);
        setCurrentLineIndex((prev) => prev + 1);
        setCharIndex(0);
        setCurrentText("");
      }, 800);
    } else {
      // Typing next character
      typingTimeout = setTimeout(() => {
        setCurrentText((prev) => prev + privacyLines[currentLineIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 35); // Speed of typing per character
    }

    return () => clearTimeout(typingTimeout);
  }, [charIndex, currentLineIndex]);

  return (
    <motion.div
      className="bg-black text-green-400 min-h-screen overflow-hidden font-mono relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Navbar />

      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <ThreeBackground />
      </div>

      <main className="relative z-10 px-4 sm:px-10 pt-24 pb-32 max-w-4xl mx-auto">
        <div className="bg-black/80 p-6 sm:p-10 border border-green-700 rounded-xl shadow-md backdrop-blur-md">
          <h1 className="text-xl sm:text-2xl font-bold text-lime-300 mb-6">
            [ Terminal: Política de Privacidade ]
          </h1>
          <div className="space-y-2 text-sm sm:text-base leading-relaxed tracking-wider">
            {lines.map((line, i) => (
              <p key={i} className="whitespace-pre-wrap">{line}</p>
            ))}
            {currentText && (
              <p className="whitespace-pre-wrap">
                {currentText}
                <span className="animate-pulse">█</span>
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default PrivacyPage;
