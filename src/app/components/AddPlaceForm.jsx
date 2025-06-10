"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function AddPlaceForm({ onPlaceAdded }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    imageUrl: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addPlace = async (event) => {
    event.preventDefault();
    setLoading(true);

    const newPlace = {
      name: formData.name,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      imageUrl: formData.imageUrl,
      description: formData.description,
    };

    const response = await fetch("/api/places", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPlace),
    });

    if (response.ok) {
      alert("✅ Localização adicionada com sucesso!");
      setFormData({ name: "", latitude: "", longitude: "", imageUrl: "", description: "" });
      if (onPlaceAdded) onPlaceAdded();
    } else {
      alert("❌ Não foi possível adicionar a localização.");
    }

    setLoading(false);
  };

  return (
    <motion.form
      onSubmit={addPlace}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl p-6 bg-[#010b05] border border-green-800 text-[#33ff33] font-mono"
    >
      <h2 className="text-xl sm:text-2xl uppercase font-bold tracking-widest text-center mb-8 border-b border-green-700 pb-2">
        📍 Adicionar Nova Localização
      </h2>

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Título"
        required
        className="w-full mb-4 px-3 py-2 bg-black border border-green-800 placeholder-green-600 text-lime-300 focus:outline-none focus:ring focus:ring-green-700"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="latitude"
          value={formData.latitude}
          onChange={handleChange}
          placeholder="Latitude"
          required
          className="px-3 py-2 bg-black border border-green-800 text-lime-300 placeholder-green-600 focus:outline-none focus:ring focus:ring-green-700"
        />
        <input
          type="text"
          name="longitude"
          value={formData.longitude}
          onChange={handleChange}
          placeholder="Longitude"
          required
          className="px-3 py-2 bg-black border border-green-800 text-lime-300 placeholder-green-600 focus:outline-none focus:ring focus:ring-green-700"
        />
      </div>

      <input
        type="text"
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleChange}
        placeholder="URL da Imagem"
        required
        className="w-full mt-4 px-3 py-2 bg-black border border-green-800 placeholder-green-600 text-lime-300 focus:outline-none focus:ring focus:ring-green-700"
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Descrição"
        required
        rows="4"
        className="w-full mt-4 px-3 py-2 bg-black border border-green-800 placeholder-green-600 text-lime-300 focus:outline-none focus:ring focus:ring-green-700"
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full mt-6 py-2 uppercase tracking-wide font-semibold text-[#010b05] ${
          loading
            ? "bg-green-700/40 text-green-100 cursor-not-allowed"
            : "bg-[#33ff33] hover:bg-green-300 hover:text-black"
        } transition`}
      >
        {loading ? "A Processar..." : "➕ Adicionar Localização"}
      </button>
    </motion.form>
  );
}
