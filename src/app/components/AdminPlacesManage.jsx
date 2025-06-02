
import React, { useEffect, useState } from "react";

export default function PlaceListAdmin() {
  const [places, setPlaces] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", imageUrl: "", description: "" });

  useEffect(() => {
    fetch("/api/places")
      .then((res) => res.json())
      .then(setPlaces);
  }, []);

  const handleEdit = (place) => {
    setEditingId(place.id);
    setFormData({
      name: place.name,
      imageUrl: place.imageUrl,
      description: place.description
    });
  };

  const handleSave = async () => {
    const res = await fetch(`/api/places/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      const updated = await res.json();
      setPlaces((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
      setEditingId(null);
    } else {
      alert("Failed to update");
    }
  };

  return (
    <div className="space-y-6">
      {places.map((place) =>
        editingId === place.id ? (
          <div key={place.id} className="bg-white/5 p-4 rounded-xl space-y-3">
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 rounded bg-black/20 border border-white/20 text-white"
            />
            <input
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full p-2 rounded bg-black/20 border border-white/20 text-white"
            />
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 rounded bg-black/20 border border-white/20 text-white"
            />
            <div className="flex gap-3">
              <button onClick={handleSave} className="bg-green-600 px-4 py-2 rounded text-white">Salvar</button>
              <button onClick={() => setEditingId(null)} className="bg-gray-500 px-4 py-2 rounded text-white">Cancelar</button>
            </div>
          </div>
        ) : (
          <div key={place.id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
            <div>
              <p className="font-bold">{place.name}</p>
              <p className="text-sm text-gray-400">{place.imageUrl}</p>
            </div>
            <button onClick={() => handleEdit(place)} className="bg-blue-600 px-4 py-2 rounded text-white">
              Editar
            </button>
          </div>
        )
      )}
    </div>
  );
}
