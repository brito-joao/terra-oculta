"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import { Button } from "@/components/ui/button";
import { Sparkles, LogOut, PencilLine, User } from "lucide-react";

export default function ProfileDashboard() {
  const [user, setUser] = useState(null);
  const [liked, setLiked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) return router.push("/login");
      const data = await res.json();
      setUser(data.user);
      setName(data.user.name);
      setEmail(data.user.email);
      setRole(data.user.role);
    };

    const fetchLikedPlaces = async () => {
      const res = await fetch("/api/user/liked");
      if (res.ok) {
        const data = await res.json();
        setLiked(data);
      }
    };

    Promise.all([fetchUser(), fetchLikedPlaces()]).finally(() => setLoading(false));
  }, [router]);

  const handleSave = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (trimmedName.length < 2 || trimmedName.length > 50) {
      alert("O nome deve ter entre 2 e 50 caracteres.");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }

    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail, role }),
      });

      if (res.ok) {
        setUser((prev) => ({ ...prev, name: trimmedName, email: trimmedEmail }));
        setEditing(false);
      } else {
        const data = await res.json();
        alert(data.error || "Erro ao salvar.");
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("Erro inesperado. Tente novamente.");
    }
  };

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    if (res.ok) router.push("/");
  };

  if (loading) return <p className="text-center text-white">Carregando...</p>;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-black via-[#0c0c0f] to-[#0a0a0a] text-white font-sans relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <Navbar />

      {/* Neon Aura */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute w-72 h-72 top-20 left-10 bg-[#A259FF] opacity-20 blur-3xl rounded-full animate-pulse" />
        <div className="absolute w-72 h-72 bottom-10 right-10 bg-[#0ABDC6] opacity-20 blur-3xl rounded-full animate-pulse" />
      </div>

      <main className="relative z-10 flex flex-col items-center p-6 pt-28">
        <motion.div
          className="w-full max-w-5xl bg-[#111111]/80 backdrop-blur-xl border border-[#2f2f2f] rounded-3xl shadow-2xl p-8 space-y-8"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9 }}
        >
          {/* User Overview */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-[#0ABDC6] shadow-[0_0_25px_#0ABDC6]">
              <Image
                src={user?.profilePic || "/defaultUser.png"}
                fill
                className="object-cover"
                alt="Avatar"
              />
            </div>
            <div className="flex flex-col gap-1 text-center sm:text-left">
              {editing ? (
                <>
                  <input
                    className="bg-black/20 p-2 rounded-md border border-white/20 text-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    className="bg-black/20 p-2 rounded-md border border-white/20 text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold tracking-tight text-[#A259FF] drop-shadow-md">{name}</h1>
                  <p className="text-gray-400 text-sm">{email}</p>
                </>
              )}
              <div className="flex items-center gap-2 mt-2 text-sm text-[#0ABDC6]">
                <User className="w-4 h-4" />
                <span>{role} Tier</span>
              </div>
            </div>
          </div>

          {editing ? (
            <div className="flex gap-4">
              <Button className="bg-green-600" onClick={handleSave}>Salvar</Button>
              <Button className="bg-gray-600" onClick={() => setEditing(false)}>Cancelar</Button>
            </div>
          ) : (
            <Button className="bg-blue-600" onClick={() => setEditing(true)}>
              <PencilLine className="mr-2 h-4 w-4" /> Editar Perfil
            </Button>
          )}

          {/* Liked Places */}
          <div>
            <h2 className="text-xl font-semibold text-purple-300 mb-4">🌍 Locais Curtidos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {liked.length === 0 ? (
                <p className="text-gray-500">Nenhum local curtido ainda.</p>
              ) : (
                liked.map((place) => (
                  <div key={place.id} className="bg-[#1a1a1a] p-4 rounded-xl border border-[#2a2a2a]">
                    <h3 className="text-lg font-bold text-purple-400">{place.name}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{place.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Admin + Logout */}
          {user.role === "ADMIN" && (
            <Button
              className="w-full mt-6 bg-purple-600 hover:bg-purple-700"
              onClick={() => router.push("/admin")}
            >
              Acessar Painel de Admin
            </Button>
          )}

          <Button onClick={handleLogout} className="w-full mt-4 bg-red-500 hover:bg-red-600">
            <LogOut className="mr-2" /> Sair da Conta
          </Button>
        </motion.div>
      </main>

      <Footer />
    </motion.div>
  );
}
