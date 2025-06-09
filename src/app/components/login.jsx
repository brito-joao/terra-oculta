"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Footer from "../components/footer";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/login";
    const payload = isSignUp ? { name, email, password } : { email, password };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error);
      return;
    }

    if (!isSignUp) {
      router.push("/dashboard");
    } else {
      setIsSignUp(false);
    }
  };

  return (
    <motion.div
      className="bg-[#0A0A0A] min-h-screen text-[#A1FF0A] font-mono flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="flex items-center justify-center flex-1 px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-[#111] w-full max-w-md p-8 rounded-lg shadow-2xl border border-[#0ABDC6]/30"
        >
          <h2 className="text-3xl font-bold text-center mb-6 uppercase tracking-wider text-[#A1FF0A]">
            {isSignUp ? "Criar Conta" : "Entrar"}
          </h2>

          {error && (
            <p className="text-red-500 text-center mb-4 font-semibold">{error}</p>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {isSignUp && (
              <input
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2d2d2d] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#A1FF0A]/50"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2d2d2d] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#A1FF0A]/50"
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2d2d2d] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#A1FF0A]/50"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-[#A1FF0A] text-black font-bold rounded-md hover:bg-[#c0ff44] transition"
            >
              {isSignUp ? "Cadastrar" : "Entrar"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-400">
            {isSignUp ? "Já tem uma conta? " : "Ainda não tem conta? "}
            <span
              onClick={toggleAuthMode}
              className="text-[#A1FF0A] hover:underline cursor-pointer"
            >
              {isSignUp ? "Entrar" : "Criar Conta"}
            </span>
          </p>
        </motion.div>
      </div>
      <Footer />
    </motion.div>
  );
}
