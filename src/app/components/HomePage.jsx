"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import PlaceCard from "../components/PlaceCard";
import { ThreeBackground } from "../components/Background";
import { Button } from "../../components/ui/button";

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

  return (
    <motion.div
      className="min-h-screen font-mono overflow-x-hidden"
      style={{ backgroundColor: "#010b05", color: "#33ff33" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <Navbar />

      {/* Header Radar Style */}
      <header className="flex flex-col items-center justify-center px-4 pt-10 text-center border-y border-green-800">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold tracking-[0.3em] uppercase"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          TERRA OCULTA
        </motion.h1>

        <p className="mt-2 text-green-400 text-sm md:text-lg tracking-wider uppercase">
          Desvendando os Mistérios Geográficos
        </p>

        <div className="mt-6 w-[280px] sm:w-[400px] md:w-[480px] border border-green-700 p-4 rounded">
          <ThreeBackground />
        </div>

        <div className="mt-8 text-center max-w-xl">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold uppercase text-green-300">
            IMERSÕES EM MAPAS COMO NUNCA ANTES
          </h2>
          <p className="mt-2 text-green-500 text-sm leading-relaxed">
            Utilize tecnologia e visualização para experiências exploratórias e descobertas
            geográficas únicas ao redor do globo.
          </p>
        </div>

        <div className="mt-6">
          <button
            onClick={() => router.push("/explore")}
            className="border border-green-400 text-green-300 px-5 py-2 rounded hover:bg-green-700/10 transition-all tracking-widest text-sm uppercase"
          >
            EXPLORAR MAPA
          </button>
        </div>
      </header>

      {/* Recent Coordinates - Styled as Radar Posts */}
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
