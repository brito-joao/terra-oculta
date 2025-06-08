"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import { ThreeBackground } from "../components/Background";
import PlaceCard from "./PlaceCard";

export default function NovasDescobertas() {
  const [places, setPlaces] = useState([]);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("date"); // "date" | "likes"
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) throw new Error();
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
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };

    fetchUser();
    fetchPlaces();
  }, []);

  const ensureAuthenticated = () => {
    if (!user || !user.id) {
      router.push("/login");
      return false;
    }
    return true;
  };

  const handleLike = async (placeId) => {
    if (!ensureAuthenticated()) return;
    try {
      const res = await fetch("/api/places", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId, userId: user.id, type: "like" }),
      });
      const data = await res.json();
      if (res.ok) {
        setPlaces((prev) =>
          prev.map((p) => (p.id === placeId ? { ...p, likes: (p.likes || 0) + 1 } : p))
        );
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  const handleComment = async (placeId, content) => {
    if (!ensureAuthenticated()) return;
    try {
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
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Comment error:", error);
    }
  };

  const filteredAndSortedPlaces = places
    .filter((place) =>
      place.name.toLowerCase().includes(filter.toLowerCase()) ||
      place.description?.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "likes") {
        return (b.likes || 0) - (a.likes || 0);
      } else {
        return Number(b.id) - Number(a.id); // Mais recentes primeiro
      }
    });
    

  return (
    <motion.div
      className="relative min-h-screen text-white font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="fixed inset-0 -z-10 bg-black/90">
        <ThreeBackground />
      </div>

      <Navbar />

      <header className="text-center py-12 px-4">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#A259FF] to-[#0ABDC6] text-transparent bg-clip-text"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Novas Descobertas
        </motion.h1>
        <motion.p
          className="mt-4 text-gray-400 text-base max-w-xl mx-auto italic"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          [Transmissão Iniciada] — Coordenadas recebidas. Novas anomalias detectadas via satélite.
        </motion.p>

        {/* Filter and Sort Controls */}
        <motion.div
          className="mt-6 max-w-xl mx-auto flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <input
            type="text"
            placeholder="Filtrar por nome ou descrição..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full sm:w-2/3 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A259FF] transition"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-1/3 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#0ABDC6] transition"
          >
            <option value="date">Mais Recentes</option>
            <option value="likes">Mais Curtidos</option>
          </select>
        </motion.div>
      </header>

      <section className="px-4 sm:px-6 pb-16 space-y-12 max-w-3xl mx-auto">
        {filteredAndSortedPlaces.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum resultado encontrado.</p>
        ) : (
          filteredAndSortedPlaces.map((place, index) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl overflow-hidden bg-[#111] border border-white/10 shadow-lg"
            >
              <img
                src={place.imageUrl}
                alt={place.name}
                className="w-full h-[400px] object-cover"
              />
              <div className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-white">{place.name}</h2>
                <p className="text-sm text-gray-400 whitespace-pre-line">
                  {place.description?.length > 300
                    ? place.description.slice(0, 300) + "..."
                    : place.description}
                </p>
                <PlaceCard
                  place={place}
                  userId={user?.id}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              </div>
            </motion.div>
          ))
        )}
      </section>

      <Footer />
    </motion.div>
  );
}
