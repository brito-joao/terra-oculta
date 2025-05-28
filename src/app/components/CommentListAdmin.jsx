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
    if (!confirm("Are you sure you want to delete this comment?")) return;

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
      alert("Failed to delete comment.");
    }
  };

  const togglePlaceComments = (placeId) => {
    setOpenPlaceIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(placeId)) {
        newSet.delete(placeId);
      } else {
        newSet.add(placeId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-4">
      {places.map(place => (
        <div
          key={place.id}
          className="rounded-xl bg-white/5 border border-white/20 overflow-hidden"
        >
          <button
            onClick={() => togglePlaceComments(place.id)}
            className="w-full flex justify-between items-center px-4 py-3 text-left bg-white/10 hover:bg-white/20 transition-colors"
          >
            <h3 className="text-lg font-bold text-cyan-400">
              {place.name}
            </h3>
            <span className="text-sm text-gray-300">
              {place.comments.length} commentario{place.comments.length !== 1 && "s"}
            </span>
          </button>

          {openPlaceIds.has(place.id) && (
            <div className="px-4 py-3 space-y-2 bg-black/30 border-t border-white/10">
              {place.comments.length === 0 ? (
                <p className="text-gray-400 text-sm">Nenhum comentário para esta publicação.</p>
              ) : (
                place.comments.map(comment => (
                  <div
                    key={comment.id}
                    className="p-3 bg-white/5 border border-white/10 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm text-purple-400 font-semibold">
                        {comment.user?.name || "Anon"}
                      </p>
                      <p className="text-white">{comment.content}</p>
                    </div>
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="ml-4 text-sm px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-white"
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
