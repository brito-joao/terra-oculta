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
      description: place.description,
    });
  };

  const handleSave = async () => {
    const res = await fetch(`/api/places/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
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
          <div key={place.id} className="bg-[#000] border border-green-800 p-4 space-y-3 text-lime-300">
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-black border border-green-700 text-lime-300 focus:outline-none placeholder-green-700"
              placeholder="Nome do Local"
            />
            <input
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 bg-black border border-green-700 text-lime-300 focus:outline-none placeholder-green-700"
              placeholder="URL da Imagem"
            />
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-black border border-green-700 text-lime-300 focus:outline-none placeholder-green-700"
              placeholder="Descrição"
              rows={4}
            />
            <div className="flex gap-4 mt-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-900 text-green-300 border border-green-600 hover:bg-green-800 uppercase tracking-wider"
              >
                Salvar
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="px-4 py-2 bg-red-900 text-red-300 border border-red-600 hover:bg-red-800 uppercase tracking-wider"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div
            key={place.id}
            className="flex justify-between items-center bg-black text-lime-300 border border-green-800 p-4"
          >
            <div>
              <p className="font-bold text-lime-400">{place.name}</p>
              <p className="text-sm text-green-600">{place.imageUrl}</p>
            </div>
            <button
              onClick={() => handleEdit(place)}
              className="px-4 py-2 bg-green-900 text-green-300 border border-green-700 hover:bg-green-800 uppercase tracking-wide"
            >
              Editar
            </button>
          </div>
        )
      )}
    </div>
  );
}
