"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import { FiMapPin, FiHeart, FiMessageCircle } from "react-icons/fi";

export default function NovasDescobertas() {
  const [places, setPlaces] = useState([]);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      }
    };

    const fetchPlaces = async () => {
      try {
        const res = await fetch("/api/places");
        const data = await res.json();
        setPlaces(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchUser();
    fetchPlaces();
  }, []);

  const filteredAndSorted = [...places]
    .filter((place) =>
      place.name.toLowerCase().includes(filter.toLowerCase()) ||
      place.description?.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "likes") {
        return (b.likes?.length || 0) - (a.likes?.length || 0);
      } else {
        return Number(b.id) - Number(a.id);
      }
    });

  return (
    <motion.div
      className="min-h-screen bg-[#010b05] text-lime-400 font-mono"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Navbar />

      {/* HEADER */}
      <header className="text-center py-12 px-4">
        <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-wider text-lime-400">
          NOVAS <br className="sm:hidden" /> DESCOBERTAS
        </h1>
        <p className="text-green-500 text-sm sm:text-base mt-4 max-w-xl mx-auto">
          Coordenadas recentes detectadas. <br />
          Feed de anomalias em tempo real.
        </p>
      </header>

      {/* SEARCH + SORT */}
      <div className="max-w-2xl mx-auto px-4 flex flex-col sm:flex-row items-center gap-4 pb-10">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Buscar por nome ou descrição..."
          className="w-full flex-1 px-4 py-2 bg-black border border-green-700 rounded-full text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-lime-500"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 bg-black border border-green-700 rounded-full text-green-400 focus:outline-none focus:ring-2 focus:ring-lime-500"
        >
          <option value="date">Mais Recentes</option>
          <option value="likes">Mais Curtidos</option>
        </select>
      </div>

      {/* FEED */}
      <main className="max-w-xl mx-auto">
        {filteredAndSorted.map((place, index) => (
          <motion.div
            key={place.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="border-t border-green-800 pb-6"
          >
            {/* Title */}
            <div className="flex items-center gap-2 text-lime-400 text-base font-bold px-4 py-2">
              <FiMapPin className="text-green-400" />
              {place.name}
            </div>

            {/* Image */}
            <div
              onClick={() => router.push(`/place/${place.id}`)}
              className="cursor-pointer"
            >
              <img
                src={place.imageUrl}
                alt={place.name}
                className="w-full h-auto max-h-[420px] object-cover"
              />
            </div>

            {/* Description */}
            <div className="text-green-400 text-sm px-4 mt-3 whitespace-pre-line leading-relaxed">
              {place.description?.slice(0, 500)}
              {place.description?.length > 500 ? "..." : ""}
            </div>

            {/* Footer: likes/comments */}
            <div className="flex items-center gap-6 text-green-600 text-sm mt-3 px-4">
              <div className="flex items-center gap-1">
                <FiHeart className="text-lg" />
                {(place.likes?.length || 0)}
              </div>
              <div className="flex items-center gap-1">
                <FiMessageCircle className="text-lg" />
                {(place.comments?.length || 0)}
              </div>
            </div>
          </motion.div>
        ))}

        {filteredAndSorted.length === 0 && (
          <p className="text-center text-green-600 mt-12">
            Nenhuma coordenada encontrada com esse filtro.
          </p>
        )}
      </main>

      <Footer />
    </motion.div>
  );
}
