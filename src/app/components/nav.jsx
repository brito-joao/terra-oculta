"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserCircle2 } from "lucide-react";

export default function Navbar() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({ profilePic: "/default-profile.jpg" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleStartExploring = () => router.push("/explore");
    const handleAuthPage = () => router.push("/login");
    const handleProfileClick = () => router.push("/dashboard");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/me", {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) throw new Error("User not authenticated");
                const data = await res.json();
                setUser(data.user);
                setIsLoggedIn(true);
            } catch (error) {
                setError(error.message);
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const navLinks = [
        { href: "/finds", label: "Novas Finds" },
        { href: "/about", label: "Sobre Nós" },
        { href: "/explore", label: "Mapa Interativo" },
        { href: "/", label: "Página Inicial" },
    ];

    return (
        <motion.nav
            className="sticky top-0 z-50 backdrop-blur-md bg-[#111111]/80 border-b border-[#2d2d2d] flex items-center justify-between px-6 py-4 shadow-xl"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Logo */}
            <div
                className="text-3xl font-extrabold bg-gradient-to-r from-[#00F9D1] to-[#A259FF] text-transparent bg-clip-text tracking-tight cursor-pointer"
                onClick={() => router.push("/")}
            >
                Terra Oculta
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex gap-8 text-white text-base font-medium">
                {navLinks.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        className="relative group transition-all hover:text-[#A259FF]"
                    >
                        {link.label}
                        <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-gradient-to-r from-[#00F9D1] to-[#A259FF] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                    </a>
                ))}
            </div>

            {/* Auth Section */}
            <div className="flex items-center gap-4">
                {loading ? (
                    <button className="bg-[#A259FF] text-white px-5 py-2 rounded-lg font-semibold animate-pulse">
                        A Carregar...
                    </button>
                ) : isLoggedIn ? (
                    <div
                        onClick={handleProfileClick}
                        className="cursor-pointer rounded-full border-2 border-[#A259FF] hover:shadow-[0_0_10px_#A259FF] transition-all duration-300 transform hover:scale-105"
                    >
                        <Image
                            src={user.profilePic || "/defaultUser.png"}
                            alt="Profile Picture"
                            width={42}
                            height={42}
                            className="rounded-full"
                        />
                    </div>
                ) : (
                    <button
                        onClick={handleAuthPage}
                        className="bg-gradient-to-r from-[#00F9D1] to-[#A259FF] px-5 py-2 rounded-lg text-white font-semibold hover:scale-105 hover:shadow-lg transition-all"
                    >
                        Login
                    </button>
                )}
            </div>
        </motion.nav>
    );
}
