"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const TopPlaces = ({ places }) => {
    if (!Array.isArray(places) || places.length === 0) {
        return (
            <div className="text-center text-gray-500 text-lg py-12">
                Nenhuma localização disponível no momento.
            </div>
        );
    }

    // Get first 3 created (assuming order = created)
    const featuredPlaces = places.slice(0, 3);

    return (
        <section className="px-6 py-16 md:px-20 lg:px-32 backdrop-blur-xs relative z-10">
            <motion.h2
                className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-[#00F9D1] via-[#A259FF] to-[#00F9D1] text-transparent bg-clip-text mb-12"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                ✨ Destaques Iniciais
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {featuredPlaces.map((place, index) => (
                    <Link key={place.id} href={`/place/${place.id}`}>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2, duration: 0.8 }}
                            whileHover={{ scale: 1.04 }}
                            className="cursor-pointer relative bg-[#111111]/50 border border-[#A259FF]/30 rounded-3xl backdrop-blur-xl shadow-[0_0_20px_#A259FF33] hover:shadow-[0_0_40px_#A259FFaa] overflow-hidden transition-all duration-500"
                        >
                            <div className="relative w-full h-56 overflow-hidden rounded-t-3xl">
                                <Image
                                    src={place.imageUrl}
                                    alt={place.name}
                                    layout="fill"
                                    objectFit="cover"
                                    className="transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 to-transparent" />
                            </div>

                            <div className="p-6 text-white space-y-3">
                                <h3 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-[#A259FF] to-[#00F9D1] text-transparent bg-clip-text">
                                    {place.name}
                                </h3>
                                <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
                                    {place.description}
                                </p>
                            </div>

                            {/* Likes Badge */}
                            <motion.div
                                className="absolute top-4 right-4 bg-gradient-to-r from-[#A259FF] to-[#00F9D1] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-md"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                ❤️ {place.likes.length}
                            </motion.div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default TopPlaces;
