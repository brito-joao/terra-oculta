import React from "react";
import { FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] text-lime-300 font-mono border-t border-lime-700/20 px-6 py-12 md:px-24 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold tracking-wider text-white">TERRA OCULTA</h2>
          <p className="mt-3 text-sm text-green-400">
            Explorando os maiores segredos da Terra, uma coordenada de cada vez.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-green-500">Terminal</h3>
          <ul className="mt-3 space-y-2 text-sm text-green-300">
            <li className="hover:text-white transition">
              <a href="/about">&gt; Sobre Nós</a>
            </li>
            <li className="hover:text-white transition">
              <a href="/careers">&gt; Oportunidades</a>
            </li>
          </ul>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-xl font-semibold text-green-500">Navegação</h3>
          <ul className="mt-3 space-y-2 text-sm text-green-300">
            <li className="hover:text-white transition">
              <a href="/finds">&gt; Novas Finds</a>
            </li>
            <li className="hover:text-white transition">
              <a href="/explore">&gt; Mapa Interativo</a>
            </li>
            <li className="hover:text-white transition">
              <a href="/">&gt; Página Inicial</a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold text-green-500">Comando Social</h3>
          <div className="mt-4 flex space-x-4 text-2xl text-lime-400">
            <a href="#" className="hover:text-white transition"><FaTwitter /></a>
            <a href="#" className="hover:text-white transition"><FaInstagram /></a>
            <a href="#" className="hover:text-white transition"><FaLinkedin /></a>
            <a href="#" className="hover:text-white transition"><FaYoutube /></a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-10 border-t border-lime-700/20 pt-6 text-center text-xs text-green-500 tracking-wide">
        <p>&copy; {new Date().getFullYear()} Terra Oculta — Todos os direitos reservados</p>
        <p className="mt-2">
          <a href="/privacy" className="hover:text-white transition">Política de Privacidade</a> &nbsp;|&nbsp;
          <a href="/terms" className="hover:text-white transition">Termos e Condições</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
