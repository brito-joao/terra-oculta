"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "../components/nav";
import { ThreeBackground } from "../components/Background";
import Footer from "../components/footer";
import PlaceCard from "./PlaceCard";

export default function NovasDescobertas() {
  const [places, setPlaces] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { method: "GET", credentials: "include" });
        if (!res.ok) throw new Error("User not authenticated");
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
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
      console.error("Error liking place:", error);
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
      console.error("Error adding comment:", error);
    }
  };

  return (
    <motion.div
      className="relative min-h-screen  text-white font-sans overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="fixed inset-0 -z-10 bg-black/90">
        <ThreeBackground />
      </div>

      <Navbar />

      <header className="text-center py-24 px-6">
        <motion.h1
          className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#A259FF] to-[#0ABDC6] text-transparent bg-clip-text drop-shadow-md"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          NOVAS DESCOBERTAS
        </motion.h1>
        <motion.p
          className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto italic"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {"[ Transmissão Iniciada ]"} — Coordenadas recebidas, imagens decodificadas. Novas anomalias detectadas via satélite.
        </motion.p>
      </header>

      <section className="px-6 md:px-12 pb-24">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {places
            .slice()
            .reverse()
            .map((place, index) => (
              <motion.div
                key={place.id}
                className="hover:scale-[1.02] hover:shadow-xl transition-transform duration-300 rounded-2xl bg-[#111111] border border-[#1a1a1a] p-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PlaceCard
                  place={place}
                  userId={user?.id}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              </motion.div>
            ))}
        </motion.div>

        <div className="mt-24 text-center">
          <p className="text-sm text-gray-600 uppercase tracking-widest">
            {`Última atualização: ${new Date().toLocaleDateString("pt-PT")}`}
          </p>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
}
