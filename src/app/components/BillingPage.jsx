"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const plans = [
  {
    id: "ultimate",
    name: "Ultimate",
    price: "€97.54/mês",
    features: ["Efeito especial do username e caveira", "Acesso prioritário ao suporte", "Badge exclusivo no perfil"],
    gradient: "from-purple-700 via-pink-500 to-red-500",
  },
  {
    id: "pro",
    name: "Pro",
    price: "€51.98/mês",
    features: ["Cor do nome diferenciada", "Acesso a conteúdos exclusivos", "Participação em eventos especiais"],
    gradient: "from-blue-600 via-indigo-500 to-purple-600",
  },
  {
    id: "basic",
    name: "Básico",
    price: "€9.98/mês",
    features: ["Cor do nome fica amarela", "Acesso ao fórum da comunidade", "Suporte padrão"],
    gradient: "from-yellow-400 via-yellow-500 to-yellow-600",
  },
];

const BillingPage = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState("basic");

  const handleContinue = () => {
    // Implement your logic to handle plan selection
    //router.push(`/subscribe/${selectedPlan}`);
    router.push(`/`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#0A0A0A] via-[#141414] to-[#0A0A0A] opacity-90 blur-3xl z-[-1] animate-pulse"></div>

        {/* Heading */}
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-[#A259FF] to-[#0ABDC6] text-transparent bg-clip-text mb-12 text-center">
          Escolha o seu plano (Estamos a trabalhar nisto)
        </h1>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              className={`relative bg-gradient-to-br ${plan.gradient} p-8 rounded-2xl shadow-2xl border-4 ${
                selectedPlan === plan.id ? "border-white" : "border-transparent"
              } hover:scale-105 transition-transform cursor-pointer`}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {selectedPlan === plan.id && (
                <motion.div
                  className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded-full text-xs font-semibold shadow-md"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  Selecionado
                </motion.div>
              )}
              <h2 className="text-3xl font-bold text-center mb-4">{plan.name}</h2>
              <p className="text-center text-xl font-semibold mb-6">{plan.price}</p>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-white mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Continue Button */}
        <motion.button
          onClick={handleContinue}
          className="mt-12 px-8 py-4 bg-gradient-to-r from-[#0ABDC6] to-[#A259FF] text-black font-bold rounded-full hover:scale-110 transition-transform shadow-lg"
          whileHover={{ scale: 1.1 }}
        >
          Continuar com o plano {plans.find((p) => p.id === selectedPlan)?.name}
        </motion.button>
      </div>
      <Footer />
    </motion.div>
  );
};

export default BillingPage;
