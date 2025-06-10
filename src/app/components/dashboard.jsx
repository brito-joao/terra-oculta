"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import { Button } from "@/components/ui/button";
import { LogOut, PencilLine, User } from "lucide-react";

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

  if (loading) return <p className="text-center text-lime-400 font-mono mt-10">Carregando...</p>;

  return (
    <motion.div
      className="min-h-screen font-mono overflow-x-hidden"
      style={{ backgroundColor: "#010b05", color: "#33ff33" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 pt-28 pb-16">
        <motion.div
          className="border border-green-700 bg-black p-6 space-y-6"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* User Overview */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-28 h-28 overflow-hidden border border-green-600">
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
                    className="bg-transparent border border-green-700 px-2 py-1 text-lime-300"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    className="bg-transparent border border-green-700 px-2 py-1 text-lime-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold tracking-wide text-lime-300">{name}</h1>
                  <p className="text-sm text-green-500">{email}</p>
                </>
              )}
              <div className="flex items-center gap-2 text-green-400 mt-1 text-sm">
                <User className="w-4 h-4" />
                <span>{role} Tier</span>
              </div>
            </div>
          </div>

          {editing ? (
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="border border-green-500 px-4 py-2 text-green-300 hover:bg-green-800/20"
              >
                Salvar
              </button>
              <button
                onClick={() => setEditing(false)}
                className="border border-red-500 px-4 py-2 text-red-400 hover:bg-red-800/20"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="border border-blue-500 px-4 py-2 text-blue-300 hover:bg-blue-800/20 flex items-center gap-2"
            >
              <PencilLine className="w-4 h-4" />
              Editar Perfil
            </button>
          )}

          {/* Liked Places */}
          <div>
            <h2 className="text-lg font-bold text-lime-400 mb-3">🌍 Locais Curtidos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {liked.length === 0 ? (
                <p className="text-green-500">Nenhum local curtido ainda.</p>
              ) : (
                liked.map((place) => (
                  <div key={place.id} className="border border-green-700 p-4 bg-black text-sm">
                    <h3 className="font-bold text-lime-300">{place.name}</h3>
                    <p className="text-green-500 line-clamp-2">{place.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Admin Access */}
          {user.role === "ADMIN" && (
            <button
              onClick={() => router.push("/admin")}
              className="w-full border border-purple-500 text-purple-300 py-2 hover:bg-purple-900/10"
            >
              Acessar Painel de Admin
            </button>
          )}

          <button
            onClick={handleLogout}
            className="w-full border border-red-500 text-red-400 py-2 hover:bg-red-800/10"
          >
            <LogOut className="inline-block w-4 h-4 mr-2" />
            Sair da Conta
          </button>
        </motion.div>
      </main>

      <Footer />
    </motion.div>
  );
}
