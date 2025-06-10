"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
        } else {
          alert("Erro ao buscar utilizadores.");
        }
      } catch (error) {
        console.error("Erro ao buscar utilizadores:", error);
        alert("Erro ao buscar utilizadores.");
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p className="text-[#33ff33] text-center mt-10 font-mono animate-pulse">A carregar utilizadores...</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-10 bg-[#010b05] border border-green-800 rounded-none shadow-[0_0_20px_#00ff8877] p-6 text-[#33ff33] font-mono"
    >
      <h2 className="text-xl sm:text-2xl font-bold tracking-wider mb-4 text-[#00ffcc] uppercase">
        👥 Lista de Utilizadores
      </h2>

      <div className="overflow-x-auto max-h-[500px] overflow-y-auto border border-green-700 bg-black/70 scrollbar-thin scrollbar-thumb-[#00ff88]/40">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#010b05] text-[#66ffe6] uppercase border-b border-green-700 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 border-r border-green-800">Nome</th>
              <th className="px-4 py-2 border-r border-green-800">Email</th>
              <th className="px-4 py-2">Tipo</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-[#062d06] transition-colors border-t border-green-900"
              >
                <td className="px-4 py-2 text-green-300">{user.name}</td>
                <td className="px-4 py-2 text-green-400">{user.email}</td>
                <td className="px-4 py-2 text-[#00ffaa] uppercase font-bold tracking-wide">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminUserManagement;
