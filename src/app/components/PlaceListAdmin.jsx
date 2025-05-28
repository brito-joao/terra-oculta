"use client";

import { useEffect, useState } from "react";

export default function PlaceListAdmin() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/places");
      const data = await res.json();
      setPlaces(data);
    } catch (err) {
      console.error("Failed to load places", err);
    }
    setLoading(false);
  };

  const deletePlace = async (placeId) => {
    if (!confirm("Are you sure you want to delete this place?")) return;
    try {
      const res = await fetch("/api/places", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId }),
      });
      if (res.ok) {
        setPlaces((prev) => prev.filter((p) => p.id !== placeId));
      } else {
        alert("Failed to delete place");
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  if (loading) return <p className="text-gray-300">Loading places...</p>;

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/50">
      {places.map((place) => (
        <div
          key={place.id}
          className="flex justify-between items-center bg-[#1a1a1a] p-4 rounded-xl border border-gray-600"
        >
          <div>
            <h3 className="text-lg font-semibold text-purple-300">{place.name}</h3>
            <p className="text-sm text-gray-400">{place.description.slice(0, 60)}...</p>
          </div>
          <button
            onClick={() => deletePlace(place.id)}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white text-sm font-semibold"
          >
            Deletar
          </button>
        </div>
      ))}
    </div>
  );
}
