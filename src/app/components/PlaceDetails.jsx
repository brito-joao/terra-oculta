"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiMapPin, FiHeart, FiMap } from "react-icons/fi";
import { Loader2 } from "lucide-react";

import Navbar from "../components/nav";
import Footer from "../components/footer";
import MiniMap from "../components/MiniMap";
import { ThreeBackground } from "./Background";

const PlaceDetails = ({ id }) => {
  const router = useRouter();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState(null);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
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
    if (!userId) return router.push("/login");
    if (!comment.trim()) return;
    const res = await fetch("/api/places", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placeId: place.id, userId, type: "comment", content: comment }),
    });
    if (res.ok) {
      setComment("");
      const data = await res.json();
      setPlace((prev) => ({
        ...prev,
        comments: [...prev.comments, data],
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white min-h-screen bg-black relative">
      <Navbar />
     

      {/* Banner */}
      <section className="w-full relative aspect-[21/6] overflow-hidden border-b border-lime-500/10">
        <img
          src={place.imageUrl}
          alt={place.name}
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80" />
        <div className="absolute bottom-4 left-4 z-10">
          <button
            onClick={() => setShowMap((prev) => !prev)}
            className="bg-lime-600 hover:bg-lime-500 text-black text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2 tracking-wide"
          >
            <FiMap />
            {showMap ? "Ocultar Mapa" : "Mostrar Mapa"}
          </button>
        </div>
      </section>

      {/* MiniMap */}
      {showMap && (
        <section className="w-full sm:aspect-[21/6] aspect-[4/3] overflow-hidden relative z-0 border-b border-lime-600/10">
          <MiniMap lat={place.latitude} lng={place.longitude} />
        </section>
      )}

      {/* Content */}
      <section className="w-full bg-[#0a0a0a] px-4 sm:px-6 md:px-10 py-12 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">

          {/* Title + Coordinates + Like */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-lime-400">{place.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-green-300 font-mono">
              <span className="flex items-center gap-2">
                <FiMapPin className="text-cyan-400" />
                {place.latitude.toFixed(4)}° N, {place.longitude.toFixed(4)}° W
              </span>
              <button
                onClick={handleLike}
                disabled={isLiked}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition ${
                  isLiked
                    ? "bg-lime-700 border-lime-600 text-black"
                    : "bg-black border-lime-500 text-lime-300 hover:bg-lime-500 hover:text-black"
                }`}
              >
                <FiHeart className="inline-block mr-1" />
                {likes} Like{likes !== 1 && "s"}
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="text-gray-300 text-sm tracking-wide font-sans leading-relaxed">
            <p className={`${showFullDesc ? "" : "line-clamp-3"} transition-all duration-200`}>
              {place.description}
            </p>
            {place.description?.length > 120 && (
              <button
                className="mt-2 text-lime-400 text-xs hover:underline font-mono"
                onClick={() => setShowFullDesc(!showFullDesc)}
              >
                {showFullDesc ? "Mostrar menos" : "Mostrar mais"}
              </button>
            )}
          </div>

          {/* Comment Input */}
          <form onSubmit={handleComment} className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-lime-500/20 flex items-center justify-center text-lime-300 font-semibold text-sm">
                {userId ? "You" : "?"}
              </div>
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escreva um comentário..."
                className="flex-1 px-4 py-2.5 rounded-lg bg-black/50 border border-lime-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
                disabled={!userId}
                onFocus={() => {
                  if (!userId) router.push("/login");
                }}
              />
            </div>
            <button
              type="submit"
              className="self-end px-6 py-2 bg-lime-500 hover:bg-lime-400 text-black font-semibold rounded-full transition"
            >
              Comentar
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-lime-500/60">
            {place.comments.length === 0 ? (
              <p className="text-gray-600 text-center text-sm">Nenhum comentário ainda.</p>
            ) : (
              [...place.comments].reverse().map((c, i) => {
                const isAdmin = c.user?.role === "ADMIN";
                const createdAt = new Date(c.createdAt).toLocaleString("pt-PT", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <motion.div
                    key={c.id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-lime-700/10 pb-4 mb-4 flex items-start gap-4"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#A259FF]/20 flex items-center justify-center text-lime-300 font-semibold text-sm shrink-0">
                      {c.user?.name?.[0] || "A"}
                    </div>
                    <div className="flex flex-col text-sm w-full">
                      <div className="flex items-center justify-between flex-wrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold ${isAdmin ? "text-cyan-400" : "text-lime-300"}`}
                            title={c.user?.email || ""}
                          >
                            {c.user?.name || "Anônimo"}
                          </span>
                          {isAdmin && (
                            <span className="px-2 py-0.5 text-[10px] bg-cyan-800/30 text-cyan-300 rounded-full uppercase font-bold">
                              Admin
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{createdAt}</span>
                      </div>
                      <p className="text-gray-300 mt-0.5">{c.content}</p>
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
