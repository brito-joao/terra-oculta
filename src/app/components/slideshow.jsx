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
    setSelectedItems(shuffled.slice(0, 5));
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
      className="relative w-full md:w-[600px] h-[260px] sm:h-[320px] md:h-[480px] rounded-3xl overflow-hidden shadow-2xl bg-black"
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

      <div className="absolute inset-0 bg-black/55 backdrop-blur-[1.8px] z-10" />

      {/* Overlay Text */}
      <motion.div
        key={currentIndex + "-overlay"}
        className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 z-20 max-w-[90%] sm:max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-white text-xl sm:text-3xl md:text-4xl font-bold drop-shadow tracking-tight leading-snug">
          {current.name}
        </h2>
        {current.description && (
          <p className="text-gray-200 mt-2 sm:mt-4 text-sm sm:text-base leading-snug sm:leading-relaxed line-clamp-3">
            {current.description}
          </p>
        )}
        <button
          onClick={() => router.push(`/place/${current.id}`)}
          className="mt-4 sm:mt-6 px-4 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-[#A259FF] to-[#0ABDC6] text-black font-semibold rounded-full shadow-md hover:opacity-90 transition-all duration-300 text-sm sm:text-base"
        >
          Explorar
        </button>
      </motion.div>

      {/* Dots */}
      <div className="absolute bottom-3 right-4 sm:bottom-6 sm:right-6 flex space-x-1 z-20">
        {selectedItems.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "bg-[#A259FF] scale-110"
                : "bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
