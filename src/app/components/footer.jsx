import React from "react";
import { FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-[#141414] text-gray-300 py-12 px-6 md:px-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand Section */}
                <div>
                    <h2 className="text-3xl font-bold text-white">Discover Unique Places</h2>
                    <p className="text-sm text-gray-400 mt-2">
                        Explorando os maiores segredos da terra, uma localização de cada vez.
                    </p>
                </div>
                
                {/* Quick Links */}
                <div>
                    <h3 className="text-xl font-semibold text-white">Empresa</h3>
                    <ul className="mt-3 space-y-2 text-gray-400">
                        <li className="hover:text-white transition"><a href="/about">Sobre Nós</a></li>
                        <li className="hover:text-white transition"><a href="/careers">Oportunidades de emprego</a></li>

                    </ul>
                </div>
                
                {/* Social Media */}
                <div>
                    <h3 className="text-xl font-semibold text-white">Nos siga</h3>
                    <div className="mt-3 flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-white transition text-2xl">
                            <FaTwitter />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition text-2xl">
                            <FaInstagram />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition text-2xl">
                            <FaLinkedin />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition text-2xl">
                            <FaYoutube />
                        </a>
                    </div>
                </div>
                

            </div>
            
            {/* Bottom Section */}
            <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} Terra Oculta. Todos os direitos reservados</p>
                <p className="mt-2">
                    <a href="/privacy" className="hover:text-white transition">Política de privacidade</a> |
                    <a href="/terms" className="hover:text-white transition"> Termos e condições</a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;