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
      className="w-full max-w-2xl p-8 bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl text-white shadow-2xl"
    >
      <h2 className="text-3xl font-bold text-center mb-6 text-purple-400 tracking-wide">
        📍 Adicionar uma nova Localização
      </h2>

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Título"
        required
        className="w-full mb-4 p-4 bg-white/5 border border-white/20 placeholder-white/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="latitude"
          value={formData.latitude}
          onChange={handleChange}
          placeholder="Latitude"
          required
          className="p-4 bg-white/5 border border-white/20 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <input
          type="text"
          name="longitude"
          value={formData.longitude}
          onChange={handleChange}
          placeholder="Longitude"
          required
          className="p-4 bg-white/5 border border-white/20 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <input
        type="text"
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleChange}
        placeholder="Url da imagem"
        required
        className="w-full mt-4 p-4 bg-white/5 border border-white/20 placeholder-white/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Descrição"
        required
        rows="4"
        className="w-full mt-4 p-4 bg-white/5 border border-white/20 placeholder-white/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full mt-6 py-3 text-white font-semibold rounded-xl transition-all duration-300 ${
          loading
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 hover:shadow-purple-700 hover:scale-105"
        }`}
      >
        {loading ? "Adding..." : "➕ Adicionar a localização"}
      </button>
    </motion.form>
  );
}
