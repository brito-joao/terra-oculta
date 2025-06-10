"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AddPlaceForm from "../components/AddPlaceForm";
import AdminUserManagement from "./adminUsers";
import CommentListAdmin from "./CommentListAdmin";
import PlaceListAdmin from "./AdminPlacesManage";

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
    return <p className="text-lime-400 text-center mt-20 font-mono animate-pulse">Carregando sistema...</p>;

  return (
    <motion.div
      className="min-h-screen bg-[#010b05] text-[#33ff33] font-mono px-4 py-10 overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <h1 className="text-3xl sm:text-4xl font-bold tracking-widest border-b border-green-800 pb-3 mb-10 uppercase">
        🛸 Painel de Controle – ADMIN
      </h1>

      <p className="text-sm text-green-500 mb-10 border-b border-green-900 pb-2">
        Logado como: <span className="text-[#33ff33] font-semibold">{user.name}</span>
      </p>

      {/* Control Sections */}
      <div className="space-y-8">
        <Section title="👥 Gerir Utilizadores" open={sections.users} onToggle={() => toggle("users")}>
          <AdminUserManagement />
        </Section>

        <Section title="💬 Moderar Comentários" open={sections.comments} onToggle={() => toggle("comments")}>
          <CommentListAdmin />
        </Section>

        <Section title="➕ Adicionar Nova Localização" open={sections.addPlace} onToggle={() => toggle("addPlace")}>
          <AddPlaceForm />
        </Section>

        <Section title="👤 Criar Novo Admin" open={sections.createAdmin} onToggle={() => toggle("createAdmin")}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nome"
              className="bg-black text-lime-300 px-3 py-2 border border-green-800 placeholder-green-600 focus:outline-none"
              onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="bg-black text-lime-300 px-3 py-2 border border-green-800 placeholder-green-600 focus:outline-none"
              onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Senha"
              className="bg-black text-lime-300 px-3 py-2 border border-green-800 placeholder-green-600 focus:outline-none"
              onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
            />
            <button
              onClick={createAdmin}
              className="col-span-full bg-green-900 text-green-300 border border-green-600 py-2 hover:bg-green-700 transition uppercase tracking-wide"
            >
              Criar Admin
            </button>
          </div>
        </Section>

        <Section title="🌍 Ver Localizações" open={sections.places} onToggle={() => toggle("places")}>
          <PlaceListAdmin />
        </Section>
      </div>

      {/* Footer */}
      <div className="mt-20 border-t border-green-900 pt-4 text-sm text-green-700 text-center">
        TERRA OCULTA ADMIN V1.0 ⌁ SISTEMA INTERNO
      </div>
    </motion.div>
  );
}

// Reusable section with toggle dropdown
function Section({ title, open, onToggle, children }) {
  return (
    <div className="border border-green-800">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center px-4 py-3 border-b border-green-800 text-left uppercase tracking-wider text-sm text-lime-300 hover:bg-green-800/10 transition"
      >
        {title}
        <span className="text-lg">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
}
