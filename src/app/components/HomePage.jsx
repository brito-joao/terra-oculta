"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import PlaceCard from "../components/PlaceCard";
import { ThreeBackground } from "../components/Background";

// 🔁 Animated Coordinates
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
    <p className="text-sm font-mono text-lime-400 mt-2 tracking-widest">
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
  const [zooming, setZooming] = useState(false);

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

  const ensureAuthenticated = () => {
    if (!user?.id) {
      router.push("/login");
      return false;
    }
    return true;
  };

  const handleLike = async (placeId) => {
    if (!ensureAuthenticated()) return;
    await fetch("/api/places", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placeId, userId: user.id, type: "like" }),
    }).then(() =>
      setPlaces((prev) =>
        prev.map((p) => (p.id === placeId ? { ...p, likes: (p.likes || 0) + 1 } : p))
      )
    );
  };

  const handleComment = async (placeId, content) => {
    if (!ensureAuthenticated()) return;
    const res = await fetch("/api/places", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placeId, userId: user.id, type: "comment", content }),
    });
    const data = await res.json();
    if (res.ok) {
      setPlaces((prev) =>
        prev.map((p) =>
          p.id === placeId ? { ...p, comments: [...(p.comments || []), data] } : p
        )
      );
    }
  };

  const handleZoomGlobe = () => {
    setZooming(true);
    setTimeout(() => router.push("/explore"), 1000);
  };

  return (
    <motion.div
      className="min-h-screen font-mono overflow-x-hidden"
      style={{ backgroundColor: "#010b05", color: "#33ff33" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <Navbar />

      {/* 📡 Hero Section */}
      <header className="flex flex-col items-center justify-center px-4 pt-12 text-center border-y border-green-800 relative overflow-hidden">
        <motion.div
          animate={zooming ? { scale: 2, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="w-full flex flex-col items-center justify-center"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold tracking-[0.3em] uppercase"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            TERRA OCULTA
          </motion.h1>

          <p className="mt-2 text-green-400 text-sm md:text-base tracking-wide uppercase">
            Desvendando os Mistérios Geográficos
          </p>

          <AnimatedCoordinates text="Lat: 38.7169° N | Long: 9.1399° W" />

          <div
            onClick={handleZoomGlobe}
            className="mt-6 w-[280px] sm:w-[400px] md:w-[480px] border border-green-700 rounded p-2 bg-black cursor-pointer hover:border-green-500 transition"
          >
            <ThreeBackground />
          </div>

          <div className="mt-8 max-w-xl text-center px-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold uppercase text-green-300">
              Imersões em Mapas Como Nunca Antes
            </h2>
            <p className="mt-2 text-green-500 text-sm leading-relaxed">
              Utilize tecnologia e visualização para experiências exploratórias e descobertas
              geográficas únicas ao redor do globo.
            </p>
          </div>

          <div className="mt-6">
            <button
              onClick={handleZoomGlobe}
              className="border border-green-400 text-green-300 px-6 py-2 rounded-md hover:bg-green-700/10 transition-all tracking-widest text-sm uppercase"
            >
              EXPLORAR MAPA
            </button>
          </div>
        </motion.div>
      </header>

      {/* 🛰️ Recent Places */}
      <section className="px-4 sm:px-8 md:px-12 mt-16 max-w-6xl mx-auto">
        <h2 className="text-xl sm:text-2xl text-center font-bold mb-10 border-b border-green-800 pb-4 uppercase tracking-widest">
          TRANSMISSÕES RECENTES
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {places.slice(0, 4).reverse().map((place) => (
            <div
              key={place.id || place.name}
              className="border border-green-700 p-4 rounded text-sm hover:bg-green-900/10 transition"
            >
              <PlaceCard
                place={place}
                userId={user?.id}
                onLike={handleLike}
                onComment={handleComment}
                colorMode="green"
              />
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
