"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ profilePic: "https://i.imgur.com/3zxQ2si.png" });
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setUser(data.user);
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleAuth = () => router.push("/login");
  const handleProfile = () => router.push("/dashboard");

  const navLinks = [
    { href: "/", label: "INÍCIO" },
    { href: "/explore", label: "MAPA" },
    { href: "/finds", label: "FEED" },
    { href: "/about", label: "MISSÃO" },

  ];

  return (
    <motion.nav
      className="sticky top-0 z-50 bg-black border-b border-green-700 px-6 py-3 flex items-center justify-between font-mono uppercase text-[#33ff33] tracking-widest text-sm"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Logo */}
      <div
        onClick={() => router.push("/")}
        className="text-xl font-bold cursor-pointer hover:text-green-400 transition"
      >
        TERRA OCULTA
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex gap-8">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="hover:text-green-300 transition"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Desktop Auth */}
      <div className="hidden md:flex items-center">
        {loading ? (
          <span className="text-green-500 animate-pulse">CARREGANDO...</span>
        ) : isLoggedIn ? (
          <div
            onClick={handleProfile}
            className="w-9 h-9 flex items-center justify-center border border-green-500 text-green-300 font-bold text-sm rounded-full cursor-pointer hover:bg-green-900/30 transition"
          >
            {user.email?.split("@")[0]
              .split(/[.\-_]/)
              .map((word) => word[0]?.toUpperCase())
              .join("")
              .slice(0, 3)}
          </div>

        ) : (
          <button
            onClick={handleAuth}
            className="border border-green-500 px-4 py-1  hover:bg-green-900/20 transition"
          >
            LOGIN
          </button>
        )}
      </div>

      {/* Mobile Toggle */}
      <div className="md:hidden text-[#33ff33]">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="absolute top-full left-0 w-full bg-[#010b05] border-t border-green-700 flex flex-col items-center py-4 space-y-4 md:hidden"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#33ff33] hover:text-green-300 transition"
              >
                {link.label}
              </a>
            ))}

            {loading ? (
              <span className="text-green-500">CARREGANDO...</span>
            ) : isLoggedIn ? (
              <div
                onClick={handleProfile}
                className="w-9 h-9 flex items-center justify-center border border-green-500 text-green-300 font-bold text-sm rounded-full cursor-pointer hover:bg-green-900/30 transition"
              >
                {user.email?.split("@")[0]
                  .split(/[.\-_]/)
                  .map((word) => word[0]?.toUpperCase())
                  .join("")
                  .slice(0, 3)}
              </div>
            ) : (
              <button
                onClick={() => {
                  handleAuth();
                  setMobileMenuOpen(false);
                }}
                className="border border-green-500 px-4 py-1 rounded hover:bg-green-900/20 transition"
              >
                LOGIN
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
