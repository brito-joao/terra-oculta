"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Slideshow({ places }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!Array.isArray(places) || places.length === 0) return;

    const withImages = places.filter((p) => p.imageUrl);

    if (withImages.length === 0) return;

    const shuffled = [...withImages].sort(() => 0.5 - Math.random());
    setSelectedItems(shuffled.slice(0, 5)); // even if less than 5, it still works
  }, [places]);

  useEffect(() => {
    if (selectedItems.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % selectedItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedItems]);

  if (!Array.isArray(places) || places.length === 0 || selectedItems.length === 0) {
    return (
      <div className="text-center text-gray-500 text-lg py-12">
        Nenhuma localização disponível no momento.
      </div>
    );
  }

  const current = selectedItems[currentIndex];

  return (
    <motion.div
      className="relative w-full md:w-[600px] h-[30vh] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={current.imageUrl}
          alt={current.name || "Slideshow image"}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm-1 z-10" />

      <motion.div
        key={currentIndex + "-overlay"}
        className="absolute bottom-12 left-12 z-20 max-w-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-white text-4xl md:text-5xl font-bold drop-shadow-xl tracking-wide">
          {current.name}
        </h2>
        {current.description && (
          <p className="text-gray-200 mt-4 text-md md:text-lg leading-relaxed max-w-lg line-clamp-3">
            {current.description}
          </p>
        )}
        <button
          onClick={() => router.push(`/place/${current.id}`)}
          className="mt-6 px-6 py-2 bg-gradient-to-r from-[#A259FF] to-[#0ABDC6] text-black font-semibold rounded-full shadow-lg hover:opacity-90 transition-all duration-300"
        >
          Explorar
        </button>
      </motion.div>

      <div className="absolute bottom-6 right-12 flex space-x-2 z-20">
        {selectedItems.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "bg-[#A259FF] scale-125"
                : "bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
