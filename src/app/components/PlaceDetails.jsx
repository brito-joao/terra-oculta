"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiMapPin, FiHeart, FiMap } from "react-icons/fi";
import { Loader2 } from "lucide-react";

import Navbar from "../components/nav";
import Footer from "../components/footer";
import MiniMap from "../components/MiniMap";

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
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.ok && res.json())
      .then((data) => setUserId(data?.user?.id));
  }, []);

  useEffect(() => {
    fetch(`/api/places`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => p.id.toString() === id);
        if (found) {
          setPlace(found);
          setLikes(found.likes?.length || 0);
          setIsLiked(found.likes?.some((l) => l.userId === userId));
        }
        setLoading(false);
      });
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
      const data = await res.json();
      setPlace((prev) => ({
        ...prev,
        comments: [...prev.comments, data],
      }));
      setComment("");
    }
  };

  if (loading || !place) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Loader2 className="animate-spin text-lime-500" size={36} />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-black text-white font-mono">
      <Navbar />

      {/* Hero Section */}
      <div className="relative aspect-video bg-black border-b border-lime-600">
        <img
          src={place.imageUrl}
          alt={place.name}
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/80" />
        <div className="absolute bottom-4 left-6 z-10">
          <button
            onClick={() => setShowMap((prev) => !prev)}
            className="bg-lime-600 hover:bg-lime-400 text-black font-bold px-4 py-2 rounded-full flex items-center gap-2 text-sm"
          >
            <FiMap />
            {showMap ? "Fechar Mapa" : "Ver Localização"}
          </button>
        </div>
      </div>

      {/* Optional MiniMap */}
      {showMap && (
        <div className="w-full aspect-[21/9] border-b border-lime-800">
          <MiniMap lat={place.latitude} lng={place.longitude} />
        </div>
      )}

      {/* Details Content */}
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        {/* Title + Meta */}
        <div className="space-y-3">
          <h1 className="text-3xl text-lime-400 font-extrabold">{place.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-green-300">
            <span className="flex items-center gap-2">
              <FiMapPin className="text-cyan-400" />
              {place.latitude.toFixed(4)}° N, {place.longitude.toFixed(4)}° W
            </span>
            <button
              onClick={handleLike}
              disabled={isLiked}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
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
        <div className="text-sm text-gray-300 leading-relaxed border-t border-b border-white/10 py-6">
          <p className={showFullDesc ? "" : "line-clamp-4"}>
            {place.description}
          </p>
          {place.description?.length > 120 && (
            <button
              className="text-xs mt-2 text-lime-400 hover:underline"
              onClick={() => setShowFullDesc(!showFullDesc)}
            >
              {showFullDesc ? "Mostrar menos" : "Mostrar mais"}
            </button>
          )}
        </div>

        {/* Comment Input */}
        <form onSubmit={handleComment} className="space-y-4">
          <div className="flex gap-3 items-start">
            <div className="w-10 h-10 bg-lime-600/30 rounded-full flex items-center justify-center text-lime-300 font-bold">
              {userId ? "You" : "?"}
            </div>
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Deixe um comentário público..."
              className="flex-1 px-4 py-3 rounded-lg bg-black/40 border border-lime-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
          </div>
          <button
            type="submit"
            className="ml-auto px-6 py-2 bg-lime-500 hover:bg-lime-400 text-black font-bold rounded-full transition"
          >
            Comentar
          </button>
        </form>

        {/* Comments */}
        <div className="space-y-6 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-lime-600/50 pr-2">
          {place.comments.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">Nenhum comentário ainda.</p>
          ) : (
            [...place.comments].reverse().map((c, i) => {
              const isAdmin = c.user?.role === "ADMIN";
              const createdAt = new Date(c.createdAt).toLocaleString("pt-PT", {
                day: "2-digit",
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
                  transition={{ delay: i * 0.02 }}
                  className="flex items-start gap-3 border-b border-lime-600/10 pb-4"
                >
                  <div className="w-9 h-9 bg-[#A259FF]/30 rounded-full flex items-center justify-center font-bold text-lime-300 text-sm">
                    {c.user?.name?.[0] || "A"}
                  </div>
                  <div className="flex flex-col text-sm w-full">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${isAdmin ? "text-cyan-400" : "text-lime-300"}`}>
                        {c.user?.name || "Anônimo"}
                      </span>
                      <span className="text-gray-500 text-xs">{createdAt}</span>
                    </div>
                    <p className="text-gray-300">{c.content}</p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      <Footer />
    </motion.div>
  );
};

export default PlaceDetails;
