"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AddPlaceForm from "../components/AddPlaceForm";
import AdminUserManagement from "./adminUsers";
import PlaceListAdmin from "./PlaceListAdmin";
import CommentListAdmin from "./CommentListAdmin";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });
  const [sections, setSections] = useState({
    users: false,
    comments: false,
    places: false,
    createAdmin: false,
    addPlace: false,
  });

  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.ok ? res.json() : router.push("/login"))
      .then(data => {
        if (!data?.user || data.user.role !== "ADMIN") return router.push("/dashboard");
        setUser(data.user);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  const createAdmin = async () => {
    try {
      const tokenRes = await fetch("/api/auth/token");
      const tokenData = await tokenRes.json();
      const { token } = tokenData;
      if (!token) return alert("No token received.");

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newAdmin, role: "ADMIN", creatorToken: token }),
      });

      const data = await res.json();
      res.ok ? alert(data.message || "Admin created.") : alert(data.error || "Failed to create admin.");
    } catch {
      alert("Error creating admin.");
    }
  };

  const toggle = (section) =>
    setSections(prev => ({ ...prev, [section]: !prev[section] }));

  if (!user)
    return <p className="text-white text-center mt-20 animate-pulse">A Carregar...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-wide text-purple-400">
          🛸 Painel de Controlo do admin
        </h1>
        <div className="text-sm text-gray-300">
          Logado como <span className="font-semibold text-white">{user.name}</span>
        </div>
      </div>

      {/* MAIN PANELS */}
      <div className="space-y-8">
        {/* USERS */}
        <Section title="👥 Gerir utilizadores" open={sections.users} onToggle={() => toggle("users")} color="blue">
          <AdminUserManagement />
        </Section>

        {/* COMMENTS */}
        <Section title="💬 Moderar Comentários" open={sections.comments} onToggle={() => toggle("comments")} color="orange">
          <CommentListAdmin />
        </Section>

        {/* ADD PLACE */}
        <Section title="➕ Adicionar uma nova localização" open={sections.addPlace} onToggle={() => toggle("addPlace")} color="green">
          <AddPlaceForm />
        </Section>

        {/* CREATE ADMIN */}
        <Section title="👤 Criar um novo admin" open={sections.createAdmin} onToggle={() => toggle("createAdmin")} color="pink">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Admin Name"
              className="bg-white/5 placeholder-white/60 text-white p-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="bg-white/5 placeholder-white/60 text-white p-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="bg-white/5 placeholder-white/60 text-white p-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
            />
            <button
              onClick={createAdmin}
              className="col-span-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 transition-transform duration-200 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-purple-800"
            >
              Criar admin ✨
            </button>
          </div>
        </Section>

        {/* PLACES */}
        <Section title="🌍 Todas as localizações" open={sections.places} onToggle={() => toggle("places")} color="red">
          <PlaceListAdmin />
        </Section>
      </div>

      {/* ADMIN SHORTCUT GRID */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "👁️ Ver todos os utilizadores", color: "from-pink-500 to-purple-600" },
          { title: "🗺️ Gerir localizações", color: "from-cyan-500 to-blue-600" },
          { title: "📊 Ver as estatísticas", color: "from-amber-400 to-yellow-500" },
          { title: "🔒 Segurança e permissões", color: "from-rose-500 to-red-600" },
          { title: "🛠️ Configurações do website", color: "from-indigo-400 to-violet-600" },
        ].map(({ title, color }, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            className={`w-full py-6 px-4 rounded-2xl font-semibold text-white text-center bg-gradient-to-br ${color} shadow-lg hover:shadow-xl transition-all duration-200`}
          >
            {title}
          </motion.button>
        ))}
      </div>

      {/* FOOTER */}
      <div className="mt-16 text-center text-gray-400 text-sm">
        Terra Admin Panel ⚡ Versão 1.0 — Criado com 🚀 pelos Três mestres
      </div>
    </div>
  );
}

// Reusable section with dropdown behavior
function Section({ title, open, onToggle, children, color }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
      <button
        onClick={onToggle}
        className={`w-full text-left flex items-center justify-between px-6 py-4 text-xl font-bold text-${color}-400 hover:text-white transition`}
      >
        {title}
        <span className="text-white text-2xl">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}
