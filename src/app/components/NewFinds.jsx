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
      </header>

      <section className="px-4 sm:px-6 pb-16 space-y-12 max-w-3xl mx-auto">
        {places
          .slice()
          .reverse()
          .map((place, index) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl overflow-hidden bg-[#111] border border-white/10 shadow-lg"
            >
              {/* Place Image */}
              <img
                src={place.imageUrl}
                alt={place.name}
                className="w-full h-[400px] object-cover"
              />

              {/* Place Content */}
              <div className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-white">{place.name}</h2>
                <p className="text-sm text-gray-400 whitespace-pre-line">
                  {place.description?.length > 300
                    ? place.description.slice(0, 300) + "..."
                    : place.description}
                </p>

                {/* Interactions */}
                <PlaceCard
                  place={place}
                  userId={user?.id}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              </div>
            </motion.div>
          ))}
      </section>

      <Footer />
    </motion.div>
  );
}
