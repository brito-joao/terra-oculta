"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const BroadcastLogos = () => {
    const logos = [
        "/logos/bbc.png",      // BBC logo
        "/logos/cnn.png",      // CNN logo
        "/logos/france24.png", // France 24 logo
        "/logos/fox.png",       // RT logo
        "/logos/sky-news.png",  // Sky News logo
    ];

    return (
        <motion.div
            className="relative w-full overflow-hidden"
            initial={{ x: "-50%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 5, ease: "linear", repeat: Infinity }}
        >
            <div className="flex items-center space-x-12 py-8">
                {logos.map((logo, index) => (
                    <div key={index} className="flex-shrink-0">
                        <Image
                            src={logo}
                            alt={`Broadcast Network Logo ${index}`}
                            width={120}
                            height={120}
                            className="object-contain"
                        />
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default BroadcastLogos;
