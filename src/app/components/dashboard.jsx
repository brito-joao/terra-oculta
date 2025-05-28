"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, LogOut, PencilLine, Coins, User } from "lucide-react";

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
      if (!res.ok) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setUser(data.user);
      setName(data.user.name);
      setEmail(data.user.email);
      setRole(data.user.role);
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  const handleSave = async () => {
    const res = await fetch("/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email,role }),
    });
    if (res.ok) {
      setUser({ ...user, name, email,role });
      setEditing(false);
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

      {/* Neon Aura Background */}
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
              <h1 className="text-3xl font-bold tracking-tight text-[#A259FF] drop-shadow-md">{user.name}</h1>
              <p className="text-gray-400 text-sm">{user.email}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-[#0ABDC6]">
                <User className="w-4 h-4" />
                <span>{user.role} Tier</span>
              </div>
            </div>
          </div>


          {/* Extras */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#141414] rounded-lg p-4 border border-[#2c2c2c] text-center hover:shadow-neon-blue transition-all duration-300">
              <Sparkles className="w-6 h-6 mx-auto text-[#A259FF]" />
              <p className="mt-2 text-sm text-gray-400">Divirta-se nesta mágica aventura</p>
            </div>
            
            {user.role == "ADMIN" && (
              <button
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                onClick={() => router.push("/admin")}
              >
                Acessar Painel de Admin
              </button>
            )}
          </div>

          {/* Logout */}
          <Button onClick={handleLogout} className="w-full mt-6 bg-red-500 hover:bg-red-600">
            <LogOut className="mr-2" /> Sair da Conta
          </Button>
        </motion.div>
      </main>

      <Footer />
    </motion.div>
  );
}
