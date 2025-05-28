"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaRegHeart } from "react-icons/fa";

const PlaceCard = ({ place }) => {
    return (
        <Link href={`/place/${place.id}`}>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="group relative bg-[#0c0c0c]/60 backdrop-blur-md border border-[#A259FF]/20 rounded-3xl overflow-hidden shadow-[0_0_30px_#A259FF33] hover:shadow-[0_0_50px_#A259FF88] transition-all duration-500"
            >
                {/* Image */}
                <div className="relative w-full h-56 overflow-hidden">
                    <Image
                        src={place.imageUrl}
                        alt={place.name}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c]/80 to-transparent z-10" />
                </div>

                {/* Info */}
                <div className="z-20 p-5 relative text-white">
                    {/* Title */}
                    <h3 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-[#00F9D1] to-[#A259FF] text-transparent bg-clip-text">
                        {place.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-300 mt-2 leading-relaxed max-h-[4.5rem] overflow-hidden">
                        {place.description}
                    </p>

                    {/* Likes */}
                    <div className="flex items-center mt-4 text-[#A259FF] text-sm">
                        <FaRegHeart className="mr-2" />
                        <span>{place.likes.length} Likes</span>
                    </div>

                    {/* Comments */}
                    <div className="mt-4 max-h-28 overflow-y-auto scrollbar-thin scrollbar-thumb-[#A259FF]/50 scrollbar-track-transparent pr-1 space-y-2">
                        {place.comments.length > 0 ? (
                            [...place.comments].reverse().map((comment, index) => (
                                <p key={index} className="text-gray-400 text-xs">
                                    <span
                                        className={`font-medium ${comment.user.role === "ADMIN"
                                                ? "bg-gradient-to-r from-[#00F9D1] via-[#A259FF] to-[#FF6EC4] bg-clip-text text-transparent animate-gradient-move"
                                                : "text-[#A259FF]"
                                            }`}
                                    >
                                        {comment.user.name}
                                    </span>: {comment.content}
                                </p>
                            ))
                        ) : (
                            <p className="text-gray-600 text-xs">Nenhum comentário ainda...</p>
                        )}

                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default PlaceCard;
