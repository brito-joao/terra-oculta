"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const MapExplain = () => {
    const router = useRouter();

    return (
        <section className="px-6 py-20 md:px-20 lg:px-32 bg-[#0a0a0a]/90 relative z-10 space-y-24">
            {/* Map Explanation */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
                {/* Image block */}
                <motion.div
                    onClick={() => router.push("/explore")}
                    className="w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-lg border border-[#A259FF]/20 cursor-pointer group"
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
                        <Image
                            src="/interactive-map.png"
                            alt="Mapa Interativo"
                            fill
                            className="object-cover w-full h-full block transition-transform duration-300 group-hover:scale-[1.01]"
                            loading="lazy"
                        />
                    </div>
                </motion.div>

                {/* Text block */}
                <motion.div
                    className="w-full lg:w-1/2 text-gray-300 space-y-5"
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-[#A259FF] to-[#00F9D1] text-transparent bg-clip-text">
                        Mapa Interativo
                    </h3>
                    <p className="text-lg">
                        Navegue pelo mundo com nosso minimapa interativo. Clique em pontos de
                        interesse e descubra locais únicos diretamente do espaço!
                    </p>
                    <p className="text-sm text-gray-400">
                        Zoom, explore e veja coordenadas precisas — tudo ao seu alcance.
                    </p>
                </motion.div>
            </div>

            {/* Comment Explanation */}
            <motion.div
                className="mx-auto w-full max-w-4xl bg-gradient-to-r from-[#1c1c1c] to-[#0f0f0f] border border-[#00F9D1]/20 shadow-xl rounded-2xl px-8 py-12 text-center text-gray-300 space-y-5"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-[#00F9D1] to-[#A259FF] text-transparent bg-clip-text">
                    💬 Deixe Seu Comentário
                </h3>
                <p className="text-lg">
                    Dentro de cada exploração, você pode deixar comentários e compartilhar suas
                    descobertas com outros exploradores. Adicione observações, teorias ou apenas
                    reações!
                </p>
                <p className="text-sm text-gray-400">
                    Interaja, responda e participe da comunidade global.
                </p>
            </motion.div>
        </section>
    );
};

export default MapExplain;
