"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import InteractiveMap from "./interactiveMap";
import AddPlaceForm from "./AddPlaceForm";
import Navbar from "./nav";
import PlaceCard from "./PlaceCard";
import Footer from "./footer";

export default function StartExploring() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [places, setPlaces] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchPlaces();
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (places.length || 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [places.length]);

  const fetchPlaces = async () => {
    try {
      const response = await fetch("/api/places");
      const data = await response.json();
      if (Array.isArray(data)) {
        setPlaces(data);
      } else {
        console.error("Invalid data from API:", data);
        setPlaces([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setPlaces([]);
    }
  };

  const handleLike = async (placeId) => {
    await fetch("/api/places", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placeId, userId: 1, type: "like" }),
    });
  };

  const handleComment = async (placeId, content) => {
    await fetch("/api/places", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placeId, userId: 1, type: "comment", content }),
    });
  };

  return (
    <motion.div
      className="bg-[#0a0a0a] text-[#A1FF0A] min-h-screen font-mono overflow-hidden relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* NAVIGATION */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* INTERACTIVE MAP */}
      <div className="relative z-10">
        <InteractiveMap places={places} />
      </div>

      {/* PLACES LIST */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-20 py-12 border-t border-[#1f1f1f] z-10 relative">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-center mb-10 uppercase tracking-wider text-[#A1FF0A]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Últimas Descobertas
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {places.slice().reverse().map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onLike={handleLike}
              onComment={handleComment}
            />
          ))}
        </div>
      </section>

      {/* FEATURE SECTION */}
      <motion.section
        className="p-10 text-center bg-[#101810] border-t border-[#1f1f1f] text-[#A1FF0A] tracking-wide relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-4xl sm:text-5xl font-bold uppercase mb-4">
          Navegação 3D Tática em Desenvolvimento
        </h2>
        <p className="text-md sm:text-lg text-[#bbffbb] max-w-2xl mx-auto">
          Em breve, explorarás o mundo oculto em três dimensões. Prepare-se para uma interface que imita a realidade.
        </p>
      </motion.section>

      {/* FOOTER */}
      <Footer />
    </motion.div>
  );
}
