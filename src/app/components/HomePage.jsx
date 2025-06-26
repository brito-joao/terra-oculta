"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import PlaceCard from "../components/PlaceCard";
import { ThreeBackground } from "../components/Background";

const getInitialCharArray = (text) =>
  text.split("").map((char) =>
    /\d/.test(char)
      ? { char, isDigit: true, display: char }
      : { char, isDigit: false, display: char }
  );

const AnimatedCoordinates = ({ text }) => {
  const [charArray, setCharArray] = useState(() => getInitialCharArray(text));

  useEffect(() => {
    const interval = setInterval(() => {
      setCharArray((prev) => {
        const digitIndices = prev
          .map((c, i) => (c.isDigit ? i : -1))
          .filter((i) => i !== -1);
        const randomIndex =
          digitIndices[Math.floor(Math.random() * digitIndices.length)];

        const updated = [...prev];
        const original = updated[randomIndex].char;
        updated[randomIndex] = {
          ...updated[randomIndex],
          display: Math.floor(Math.random() * 10).toString(),
        };

        setTimeout(() => {
          setCharArray((current) => {
            const reverted = [...current];
            reverted[randomIndex] = {
              ...reverted[randomIndex],
              display: original,
            };
            return reverted;
          });
        }, 250);

        return updated;
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-sm font-mono text-[#33ff33] mt-2 tracking-widest z-10">
      {charArray.map((c, i) => (
        <span key={i}>{c.display}</span>
      ))}
    </p>
  );
};

const HomePage = () => {
  const router = useRouter();
  const [places, setPlaces] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me", { method: "GET", credentials: "include" })
      .then((res) => res.ok && res.json())
      .then((data) => setUser(data?.user))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    fetch("/api/places")
      .then((res) => res.json())
      .then((data) => setPlaces(Array.isArray(data) ? data : Object.values(data)))
      .catch(console.error);
  }, []);

  const handleZoomGlobe = () => {
    router.push("/explore");
  };

  return (
    <motion.div
      className="relative min-h-screen font-mono text-[#33ff33] overflow-x-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #14532d;
          border-radius: 4px;
        }
      `}</style>

      <Navbar />

      {/* 🌍 Hero Section */}
      <section className="relative w-full h-[700px] bg-black overflow-hidden flex flex-col md:flex-row items-center justify-center px-6 md:px-12 gap-6">
        <div className="z-10 text-left md:w-1/2 max-w-xl md:translate-x-[-5%]">
          <motion.h1
            className="text-4xl sm:text-8xl font-extrabold tracking-[0.25em] uppercase"
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            TERRA OCULTA
          </motion.h1>

          <p className="mt-3 text-[#33ff33] text-base md:text-lg tracking-wide uppercase">
            A desvendar os Mistérios Geográficos
          </p>

          <AnimatedCoordinates text="Lat: 38.7169° N | Long: 9.1399° W" />

          <div className="mt-6">
            <button
              onClick={handleZoomGlobe}
              className="border border-[#33ff33] text-[#33ff33] px-6 py-2 hover:bg-green-800/20 transition-all tracking-widest text-sm uppercase"
            >
              EXPLORAR MAPA
            </button>
          </div>
        </div>

        <div
          className="relative w-full md:w-1/2 h-[400px] md:h-[600px] z-0 md:translate-x-[5%] cursor-pointer"
          onClick={handleZoomGlobe}
        >
          <ThreeBackground />
        </div>
      </section>

      {/* ℹ️ Informative Sections */}
      <section className="px-6 py-20 md:px-16 lg:px-32 space-y-24">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-[#99ff99] space-y-5">
            <h3 className="text-3xl font-bold text-[#33ff33] uppercase">Como Funciona</h3>
            <p className="text-md">
              O nosso sistema cruza imagens de satélite com coordenadas suspeitas. Tudo é validado por utilizadores e moderadores.
            </p>
            <p className="text-sm text-[#66ff66]">
              Sem filtros. Só os factos geográficos mais estranhos do planeta.
            </p>
          </div>
          <div className="lg:w-1/2 rounded-xl overflow-hidden border border-green-700 shadow-md bg-green-950 p-6 text-[#33ff33] text-sm space-y-3 h-[250px] overflow-y-auto leading-relaxed">
            <h4 className="text-md uppercase text-[#66ff66] font-bold mb-2">Mistérios Visíveis Apenas por Satélite</h4>
            <ul className="list-disc pl-4 space-y-2">
              <li>No Cazaquistão, o “Símbolo do Enigma” forma um pentagrama de 366 metros no solo — descoberto apenas via Google Earth.</li>
              <li>Uma ilha com formato de olho humano, chamada "Ojo de Tigre", gira lentamente no delta do Paraná, Argentina.</li>
              <li>No deserto do Nevada (EUA), há estruturas quadradas que aparecem e desaparecem periodicamente em imagens de satélite.</li>
              <li>Nas Montanhas Bucegi (Roménia), imagens térmicas revelam uma câmara subterrânea não registrada oficialmente.</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
          <div className="lg:w-1/2 text-[#99ff99] space-y-5">
            <h3 className="text-3xl font-bold text-[#33ff33] uppercase">Interage</h3>
            <p className="text-md">
              Comenta, teoriza, ou deixa a tua marca nos lugares ocultos do mundo.
            </p>
            <p className="text-sm text-[#66ff66]">
              Comunidade global de exploradores. Sem barreiras.
            </p>
          </div>

          <div className="lg:w-1/2 rounded-xl overflow-hidden border border-green-700 shadow-md bg-green-950 p-6 text-[#33ff33] text-sm space-y-2 h-[250px] overflow-y-auto">
            <div className="border-b border-green-600 pb-2">
              <strong>Utilizador123</strong>: Este local parece artificial...
            </div>
            <div className="border-b border-green-600 pb-2">
              <strong>Misterioso99</strong>: Já viram isto no Google Earth?
            </div>
            <div className="border-b border-green-600 pb-2">
              <strong>Explorador_PT</strong>: Há padrões geométricos aqui.
            </div>
            <div>
              <strong>TeoriaFinal</strong>: Claramente uma base subterrânea.
            </div>
          </div>
        </div>
      </section>

      {/* 🛰️ Recent Places */}
      <section className="px-4 sm:px-8 md:px-12 mt-10 max-w-6xl mx-auto backdrop-blur-md bg-black/60 py-16 rounded-xl">
        <h2 className="text-xl sm:text-2xl text-center font-bold mb-10 border-b border-green-800 pb-4 uppercase tracking-widest">
          TRANSMISSÕES RECENTES
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {places.slice(0, 4).reverse().map((place) => (
            <div
              key={place.id || place.name}
              className="border border-green-700 p-4 rounded text-sm hover:bg-green-900/10 transition"
            >
              <PlaceCard place={place} userId={user?.id} colorMode="green" />
            </div>
          ))}
        </div>
      </section>

      <Footer />
      <Analytics />
    </motion.div>
  );
};

export default HomePage;
