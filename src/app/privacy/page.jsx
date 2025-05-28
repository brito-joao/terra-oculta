"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import { ThreeBackground } from "../components/Background";

const PrivacyPage = () => {
    return (
        <motion.div
            className="bg-[#0a0a0a] text-white min-h-screen font-sans overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
        >
            <Navbar />

            <div className="bg-[#0a0a0a] fixed top-0 left-0 w-full h-full -z-2">
                <ThreeBackground />
            </div>

            <main className="relative overflow-hidden h-screen z-10">
                <div className="perspective">
                    <div className="crawl">
                        <div className="text">
                            <h1>Política de Privacidade</h1>
                            <p>
                                Valorizamos mais o dinheiro do que a sua privacidade. Todas as informações fornecidas neste site são tratadas com
                                o mais alto nível de segurança e respeito sempre visando o lúcro.
                            </p>
                            <p>
                                Coletamos quaisquer dados que pensamos ser necessários para oferecer a melhor experiência de navegação,
                                incluindo nome, e-mail, comentários.
                            </p>
                            <p>
                                Esses dados poderão ser vendidos ou compartilhados com terceiros sem o seu
                                consentimento explícito.
                            </p>
                            <p>
                                Você é livre para poder alterar e falar livremente sobre qualquer assunto neste site, nós deixamos.
                                Porém, caso os administradores pensem que não se encaixa com este site, então eles estão livres para remover qualquer comentário.
                            </p>
                            <p>
                                Usamos cookies e tecnologias semelhantes para personalizar sua experiência,
                                analisar o tráfego e entender padrões de uso do site.
                            </p>
                            <p>
                                Ao continuar a navegar neste site, você concorda com o uso dessas práticas e permite que os seus dados sejam vendidos (brincadeira).
                            </p>
                            <p>
                                Não garantimos que os seus dados estão seguros, mas podemos garantir que não contratamos nenhuma equipe de investigação privada para stalkear os nossos utilizadores.

                                Prometemos que iremos trazer os melhores conteúdos e informações que seriam bloqueadas em outros websites.
                            </p>
                            <p>
                                Se tiver dúvidas, entre em contato com nossa equipe de suporte via e-mail
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <style jsx global>{`
                .perspective {
                    perspective: 600px;
                    height: 100vh;
                    overflow: hidden;
                    position: relative;
                }

                .crawl {
                    position: absolute;
                    bottom: -100%;
                    width: 100%;
                    transform: rotateX(25deg);
                    animation: crawl 60s linear infinite;
                }

                .text {
                    font-size: 1.25rem;
                    text-align: center;
                    max-width: 600px;
                    margin: 0 auto;
                    color: #e0e0e0;
                    padding: 0 1rem;
                }

                .text h1 {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                    color: #A259FF;
                }

                @keyframes crawl {
                    0% {
                        bottom: -100%;
                        opacity: 0;
                    }
                    5% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        bottom: 100%;
                        opacity: 0;
                    }
                }
            `}</style>
        </motion.div>
    );
};

export default PrivacyPage;
