"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import { OtherBackground } from "../components/Background";

const people = [
  {
    name: "Rafael",
    img: "https://i.imgur.com/h62zdzd.jpeg",
    role: "Cruzado Digital",
    description:
      "Com visão afiada e dedicação imbatível, Rafa lidera as incursões digitais com ousadia e precisão. Construtor da ponte entre ideia e execução.",
  },
  {
    name: "João",
    img: "https://i.imgur.com/J2VyiW5.jpeg",
    role: "Estrategista Mestre",
    description:
      "Sempre dois passos à frente, João conecta pontos invisíveis com maestria. Um arquiteto de narrativas e movimentos certeiros.",
  },
  {
    name: "Israel",
    img: "https://i.imgur.com/JgQ0UwG.jpeg",
    role: "Guerreiro da Arte",
    description:
      "Movido por expressão e detalhe, Israel traz alma visual à missão. Um escultor do intangível e defensor da beleza oculta.",
  },
];

const values = [
  {
    title: "Visão Imersiva",
    description: "Enxergamos além do óbvio. Tudo que fazemos parte da curiosidade pelo que está oculto.",
  },
  {
    title: "Exploração Constante",
    description: "Não há destino final, apenas novas coordenadas a investigar. O movimento é eterno.",
  },
  {
    title: "Autonomia Radical",
    description: "Cada membro da equipe é livre para agir com propósito e responsabilidade.",
  },
  {
    title: "Design com Significado",
    description: "Beleza não é estética: é comunicação profunda. Tudo que criamos tem alma.",
  },
  {
    title: "Transparência Tática",
    description: "Confiamos uns nos outros com informação e intenções. A clareza é arma.",
  },
  {
    title: "Espírito de Missão",
    description: "Cada projeto é uma chamada. Cada entrega é uma vitória coletiva.",
  },
];

export default function AboutUsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState(1);

  return (
    <motion.div className="relative min-h-screen text-white font-mono overflow-hidden">
      <div className="fixed inset-0 bg-black -z-10">
        <OtherBackground />
      </div>

      <Navbar />

      <section className="pt-28 pb-10 px-4 sm:px-8 max-w-6xl mx-auto text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold tracking-widest uppercase bg-gradient-to-r from-[#aaff33] to-[#66ff99] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Sobre Nós
        </motion.h1>
        <p className="mt-4 text-lime-300 max-w-xl mx-auto text-sm sm:text-base">
          Cada mente aqui é uma peça essencial no enigma Terra Oculta. Conheça quem move os sistemas por trás do radar.
        </p>
      </section>

      {/* Team Selector */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-[#1f1f1f]">
          {people.map((person, index) => (
            <button
              key={index}
              onClick={() => setSelected(index)}
              className={`text-sm sm:text-base font-semibold uppercase tracking-wide py-4 px-3 border-r border-[#222] transition-all duration-200
                ${
                  selected === index
                    ? "bg-[#aaff33] text-black"
                    : "bg-[#0f0f0f] text-[#aaff33] hover:bg-[#181818]"
                } ${index === people.length - 1 ? "border-r-0" : ""}`}
            >
              {person.name}
            </button>
          ))}
        </div>

        <div className="relative w-full h-[400px] sm:h-[500px] bg-black overflow-hidden shadow-xl border-x border-b border-[#1a1a1a]">
          <Image
            src={people[selected].img}
            alt={people[selected].name}
            fill
            className="object-cover object-center opacity-90 transition-all duration-500"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

          <div className="absolute bottom-0 left-0 w-full p-6 text-left text-white bg-black/30 backdrop-blur-md">
            <h2 className="text-xl sm:text-2xl font-bold text-[#aaff33] uppercase">
              {people[selected].name}
            </h2>
            <p className="text-sm text-lime-300 mt-1">{people[selected].role}</p>
            <p className="text-sm text-gray-300 mt-3 max-w-xl">{people[selected].description}</p>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-[#050805] border-t border-green-900 py-20 px-6 sm:px-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-lime-300 mb-16">
          Nossos Valores
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-left text-white">
          {values.map((value, index) => (
            <div key={index} className="space-y-3 border-t border-green-800 pt-4">
              <h3 className="text-lg font-bold text-lime-300">{value.title}</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </motion.div>
  );
}
