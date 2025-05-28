"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
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
            router.push("/dashboard"); // Redirect after login
        } else {
            setIsSignUp(false); // Switch to login mode after registering
        }
    };

    return (
        <motion.div>
            <div className="flex items-center justify-center min-h-screen bg-black text-white relative overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-[#111] p-10 rounded-xl shadow-2xl w-full max-w-md border border-gray-800 relative"
                >
                    <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                        {isSignUp ? "Criar Conta" : "Entrar"}
                    </h2>

                    {error && <p className="text-red-500 text-center mt-2">{error}</p>}

                    <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
                        {isSignUp && (
                            <input
                                type="text"
                                placeholder="Nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-black p-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        )}
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-black p-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-black p-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <button className="bg-gradient-to-r from-blue-500 to-purple-500 py-3 rounded-lg font-bold hover:opacity-80 transition-all">
                            {isSignUp ? "Cadastrar" : "Entrar"}
                        </button>
                    </form>

                    <p className="text-center mt-4 text-gray-400">
                        {isSignUp ? "Já tem uma conta? " : "Não tem uma conta? "}
                        <span onClick={toggleAuthMode} className="text-blue-400 cursor-pointer hover:underline">
                            {isSignUp ? "Entrar" : "Cadastre-se"}
                        </span>
                    </p>
                </motion.div>
            </div>
            <Footer />
        </motion.div>
    );
}
