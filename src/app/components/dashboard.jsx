"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import { LogOut, PencilLine, User } from "lucide-react";

export default function ProfileDashboard() {
  const [user, setUser] = useState(null);
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

    fetchUser().finally(() => setLoading(false));
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

  if (loading)
    return <p className="text-center text-lime-400 font-mono mt-10">Carregando...</p>;

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
                    className="bg-transparent border border-green-700 px-2 py-1 text-[#99ff99]"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    className="bg-transparent border border-green-700 px-2 py-1 text-[#99ff99]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold tracking-wide text-[#99ff99]">{name}</h1>
                  <p className="text-sm text-[#66ff66]">{email}</p>
                </>
              )}
              <div className="flex items-center gap-2 text-[#66ff66] mt-1 text-sm">
                <User className="w-4 h-4" />
                <span>{role} Tier</span>
              </div>
            </div>
          </div>

          {editing ? (
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="border border-green-600 px-4 py-2 text-[#66ff66] hover:bg-green-900/10"
              >
                Salvar
              </button>
              <button
                onClick={() => setEditing(false)}
                className="border border-green-700 px-4 py-2 text-[#33ff33] hover:bg-green-900/10"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="border border-green-600 px-4 py-2 text-[#66ff66] hover:bg-green-900/10 flex items-center gap-2"
            >
              <PencilLine className="w-4 h-4" />
              Editar Perfil
            </button>
          )}

          {/* Admin Access */}
          {user.role === "ADMIN" && (
            <button
              onClick={() => router.push("/admin")}
              className="w-full border border-green-700 text-[#66ff66] py-2 hover:bg-green-900/10"
            >
              Acessar Painel de Admin
            </button>
          )}

          <button
            onClick={handleLogout}
            className="w-full border border-green-600 text-[#99ff99] py-2 hover:bg-green-900/10"
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
