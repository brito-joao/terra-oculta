"use client";

import React from "react";
import { motion } from "framer-motion";

const categories = [

    { name: "Naufrágios", icon: "🌊" },
    { name: "Desertos", icon: "🏜️" },
    { name: "Montanhas", icon: "🏔️" },
    { name: "Florestas", icon: "🌳" },
    { name: "Cidades", icon: "🏙️" },
];

const CategoryCard = ({ name, icon }) => (
    <motion.div
        className="bg-gradient-to-r from-purple-600 to-cyan-400 rounded-xl p-6 w-64 h-64 flex items-center justify-center flex-col shadow-2xl transition-transform transform hover:scale-110"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
    >
        <div className="text-5xl text-white mb-4">{icon}</div>
        <h3 className="text-2xl text-white font-extrabold text-center">{name}</h3>
    </motion.div>
);

const ExplorationCategories = () => {
    return (
        <div className="  min-h-screen flex flex-col items-center justify-center backdrop-blur-lg bg-black/1 p-8 rounded-lg py-16">
            <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <h2 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-400 mb-4">
                    Explore o Mundo
                </h2>
                <p className="text-lg text-gray-300">
                    Descubra os maiores mistérios que vão deixar você maluco
                </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                {categories.map((category, index) => (
                    <CategoryCard key={index} name={category.name} icon={category.icon} />
                ))}
            </div>
        </div>
    );
};

export default ExplorationCategories;
