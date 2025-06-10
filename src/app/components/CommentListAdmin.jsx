"use client";
import { useEffect, useState } from "react";

export default function CommentListAdmin() {
  const [places, setPlaces] = useState([]);
  const [openPlaceIds, setOpenPlaceIds] = useState(new Set());

  useEffect(() => {
    fetch("/api/places")
      .then(res => res.json())
      .then(data => setPlaces(data))
      .catch(err => console.error("Error fetching places:", err));
  }, []);

  const deleteComment = async (commentId) => {
    if (!confirm("⚠️ Tens a certeza que queres deletar este comentário?")) return;

    const res = await fetch("/api/places", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId }),
    });

    if (res.ok) {
      setPlaces(prev =>
        prev.map(p => ({
          ...p,
          comments: p.comments.filter(c => c.id !== commentId),
        }))
      );
    } else {
      alert("❌ Falha ao deletar comentário.");
    }
  };

  const togglePlaceComments = (placeId) => {
    setOpenPlaceIds(prev => {
      const newSet = new Set(prev);
      newSet.has(placeId) ? newSet.delete(placeId) : newSet.add(placeId);
      return newSet;
    });
  };

  return (
    <div className="space-y-4 font-mono text-[#33ff33]">
      {places.map(place => (
        <div
          key={place.id}
          className="border border-green-800 bg-black/60"
        >
          <button
            onClick={() => togglePlaceComments(place.id)}
            className="w-full flex justify-between items-center px-4 py-3 text-left bg-[#010b05] hover:bg-[#062d06] transition"
          >
            <h3 className="text-base sm:text-lg font-bold text-[#00ffd0] uppercase tracking-wide">
              {place.name}
            </h3>
            <span className="text-sm text-lime-300">
              {place.comments.length} comentário{place.comments.length !== 1 && "s"}
            </span>
          </button>

          {openPlaceIds.has(place.id) && (
            <div className="px-4 py-3 space-y-3 border-t border-green-700 bg-black/80">
              {place.comments.length === 0 ? (
                <p className="text-green-500 text-sm">Sem comentários para esta localização.</p>
              ) : (
                place.comments.map(comment => (
                  <div
                    key={comment.id}
                    className="p-3 border border-green-700 bg-[#010b05] flex justify-between items-start gap-4"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-cyan-400 font-semibold mb-1">
                        {comment.user?.name || "Anon"}
                      </p>
                      <p className="text-green-200 text-sm leading-snug">
                        {comment.content}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white text-xs uppercase font-bold tracking-widest"
                    >
                      Deletar
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
