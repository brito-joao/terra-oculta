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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white min-h-screen relative">
      <Navbar />
      <div className="fixed bg-black inset-0 -z-10">
        <ThreeBackground />
      </div>

      {/* IMAGE BANNER */}
      <section className="w-full relative aspect-[21/6] overflow-hidden">
        <img
          src={place.imageUrl}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 " />
        <div className="absolute bottom-4 left-4 z-10">
          <button
            onClick={() => setShowMap((prev) => !prev)}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2"
          >
            <FiMap />
            {showMap ? "Ocultar Mapa" : "Mostrar Mapa"}
          </button>
        </div>
      </section>

      {/* MINIMAP */}
      {showMap && (
        <section className="w-full aspect-[21/6] overflow-hidden relative z-0 border-b border-white/10">
          <MiniMap lat={place.latitude} lng={place.longitude} />
        </section>
      )}

      {/* DETAILS */}
      <section className="w-full bg-[#0f0f0f] px-4 sm:px-6 md:px-10 py-10 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          {/* TITLE + META */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{place.name}</h1>
            <div className="flex flex-wrap gap-3 items-center text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <FiMapPin className="text-purple-400" />
                {place.latitude}, {place.longitude}
              </div>
              <button
                onClick={handleLike}
                disabled={isLiked}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  isLiked
                    ? "bg-purple-700 text-white"
                    : "bg-white/10 text-purple-400 hover:bg-purple-600 hover:text-white"
                }`}
              >
                <FiHeart />
                {likes} Like{likes !== 1 && "s"}
              </button>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="text-gray-300 text-sm whitespace-pre-wrap relative">
            <p className={`${showFullDesc ? "" : "line-clamp-2"} transition-all duration-200`}>
              {place.description}
            </p>
            {place.description?.length > 120 && (
              <button
                className="mt-2 text-purple-400 text-xs hover:underline"
                onClick={() => setShowFullDesc(!showFullDesc)}
              >
                {showFullDesc ? "Mostrar menos" : "Mostrar mais"}
              </button>
            )}
          </div>

          {/* COMMENT FORM */}
          <form onSubmit={handleComment} className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-500/30 flex items-center justify-center text-white font-semibold text-sm">
                {userId ? "You" : "?"}
              </div>
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escreva um comentário..."
                className="flex-1 px-4 py-2.5 rounded-lg bg-black/40 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={!userId}
                onFocus={() => {
                  if (!userId) router.push("/login");
                }}
              />
            </div>
            <button
              type="submit"
              className="self-end px-5 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-full hover:opacity-90 transition"
            >
              Comentar
            </button>
          </form>

          {/* COMMENT LIST */}
          <div className="mt-6 space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-500/60">
            {place.comments.length === 0 ? (
              <p className="text-gray-500 text-center text-sm">Nenhum comentário ainda.</p>
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
                    className="border-b border-white/10 pb-4 mb-4 flex items-start gap-4"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#A259FF]/20 flex items-center justify-center text-purple-300 font-semibold text-sm shrink-0">
                      {c.user?.name?.[0] || "A"}
                    </div>
                    <div className="flex flex-col text-sm w-full">
                      <div className="flex items-center justify-between flex-wrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold ${isAdmin ? "text-cyan-400" : "text-purple-400"}`}
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
