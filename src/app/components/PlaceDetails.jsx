"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { FiMapPin, FiHeart } from "react-icons/fi";
import { ThreeBackground } from "./Background";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import MiniMap from "../components/MiniMap";
import { useRouter } from "next/navigation";

const PlaceDetails = ({ id }) => {
  const router = useRouter();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState(null);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      setUserId(data.user?.id);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchPlace = async () => {
      const res = await fetch(`/api/places`);
      const data = await res.json();
      const found = data.find((p) => p.id.toString() === id);
      if (found) {
        setPlace(found);
        setLikes(found.likes?.length || 0);
        setIsLiked(found.likes?.some((l) => l.userId === userId));
      }
      setLoading(false);
    };
    fetchPlace();
  }, [id, userId]);

  const handleLike = async () => {
    if (!userId || isLiked) return;
    const res = await fetch("/api/places", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placeId: place.id, userId, type: "like" }),
    });
    if (res.ok) {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!userId || !comment.trim()) return;
    const res = await fetch("/api/places", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placeId: place.id, userId, type: "comment", content: comment }),
    });
    if (res.ok) {
      setComment("");
      setPlace((prev) => ({
        ...prev,
        comments: [...prev.comments, { user: { name: "You" }, content: comment }],
      }));
    }
  };

  if (loading || !place) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Loader2 className="animate-spin text-white" size={32} />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white min-h-screen relative">
      <Navbar />
      <div className="fixed bg-black inset-0 -z-10">
        <ThreeBackground />
      </div>

      {/* HERO IMAGE */}
      <section className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[21/8] lg:aspect-[21/7] overflow-hidden flex items-center justify-center bg-black">
        {/* Image (only show when map is hidden) */}
        {!showMap && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <Image
              src={place.imageUrl}
              alt={place.name}
              width={1200}
              height={500}
              className="object-contain max-h-full w-auto"
              priority
            />
          </div>
        )}

        {/* Gradient Overlay (on top of image) */}
        {!showMap && (
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        )}

        {/* Show Map Button */}
        <div className="absolute top-6 right-6 z-50">
          <button
            onClick={() => setShowMap((prev) => !prev)}
            className="px-5 py-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur text-white font-medium"
          >
            {showMap ? "Hide Map" : "Show Map"}
          </button>
        </div>

        {/* Map Overlay */}
        {showMap && (
          <div className="absolute inset-0 z-40">
            <div className="absolute inset-0 backdrop-blur-sm bg-black/60 z-10" />
            <div className="absolute inset-0 z-20">
              <MiniMap lat={place.latitude} lng={place.longitude} />
            </div>
          </div>
        )}
      </section>




      {/* DETAILS SECTION */}
      <section className="w-full bg-[#0f0f0f] px-6 py-16 border-t border-white/10">
        <div className="max-w-5xl mx-auto flex flex-col gap-10">

          {/* Title & Description */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-400 mb-4">
              {place.name}
            </h1>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">{place.description}</p>
          </div>

          {/* Like & Coordinates */}
          <div className="flex flex-wrap justify-center items-center gap-4">
            <button
              onClick={handleLike}
              disabled={isLiked}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition shadow ${isLiked
                ? "bg-purple-700 text-white"
                : "bg-white/10 text-purple-400 hover:bg-purple-600 hover:text-white"
                }`}
            >
              <FiHeart />
              {likes} Like{likes !== 1 && "s"}
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FiMapPin />
              {place.latitude}, {place.longitude}
            </div>
          </div>

          {/* Comment Input */}
          <form onSubmit={handleComment} className="flex flex-col gap-4 max-w-2xl mx-auto w-full mt-8">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center text-white font-bold text-sm">
                {userId ? "You" : "?"}
              </div>
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escreva algo incrível..."
                className="flex-1 px-4 py-3 rounded-xl bg-black/50 text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/60 transition"
              />
            </div>
            <button
              type="submit"
              className="self-end px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-full hover:opacity-90 transition"
            >
              Comentar
            </button>
          </form>

          {/* Comment List */}
          <div className="mt-10 space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-500/60">
            {place.comments.length === 0 ? (
              <p className="text-gray-500 text-center">Nenhum comentário ainda...</p>
            ) : (
              [...place.comments].reverse().map((c, i) => {
                const isAdmin = c.user?.role === "ADMIN"; // adjust based on your actual user role field

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-4 max-w-3xl mx-auto"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-[#A259FF]/20 flex items-center justify-center text-purple-300 font-semibold text-sm shrink-0">
                      {c.user?.name?.[0] || "A"}
                    </div>

                    {/* Name + Content */}
                    <div className="flex flex-col text-sm w-full">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${isAdmin ? "text-cyan-400" : "text-purple-400"}`}>
                          {c.user?.name || "Anônimo"}
                        </span>
                        {isAdmin && (
                          <span className="px-2 py-0.5 text-xs bg-cyan-800/30 text-cyan-300 rounded-full uppercase tracking-wide font-bold">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 mt-1 leading-snug">{c.content}</p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

        </div>
      </section>

      <Footer />
    </motion.div>
  );
};

export default PlaceDetails;
