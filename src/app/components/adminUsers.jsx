"use client";
 
import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";
 
const AdminUserManagement = () => {

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);
 
  // Buscar utilizadores

  useEffect(() => {

    const fetchUsers = async () => {

      setLoading(true);

      try {

        const res = await fetch("/api/admin/users");

        const data = await res.json();
        console.log(res, "hello")
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

    return <p className="text-white text-center mt-10">A carregar utilizadores...</p>;

  }
 
  return (
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="mt-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl"
>
  <h2 className="text-2xl font-bold text-green-400 mb-4">👥 Lista de Utilizadores</h2>

  {/* Scrollable area */}
  <div className="overflow-x-auto max-h-[500px] overflow-y-auto bg-[#1A1A1A] rounded-lg border border-gray-700 scrollbar-thin scrollbar-thumb-purple-500/50">
    <table className="w-full text-left text-sm text-white">
      <thead className="bg-[#2d2d2d] text-md text-purple-300 sticky top-0 z-10">
        <tr>
          <th className="px-4 py-2">Nome</th>
          <th className="px-4 py-2">Email</th>
          <th className="px-4 py-2">Tipo</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr
            key={user.id}
            className="bg-[#1E1E1E] border-b border-gray-600 hover:bg-[#2A2A2A] transition-all"
          >
            <td className="px-4 py-3 font-medium">{user.name}</td>
            <td className="px-4 py-3">{user.email}</td>
            <td className="px-4 py-3">{user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</motion.div>

  );

};
 
export default AdminUserManagement;

 