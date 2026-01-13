"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { http } from "@/services/http";
import { useRouter } from "next/navigation"; // 1. Importar el router

export default function LoginPage() {
  const { login } = useAuth();
  const [userId, setUserId] = useState("");
  const router = useRouter(); // 2. Inicializar el router

  const handleLogin = async () => {
    try {
      const { data } = await http.get(`/users/${userId}`);

      if (data) {
        // 3. Si el usuario existe, hacemos login y redirigimos
        login(data);
        router.push("/attendance"); 
      } else {
        console.error("User not found");
        alert("Usuario no encontrado");
      }
    } catch (error) {
      console.error("Error durante el login:", error);
      alert("Hubo un error al conectar con el servidor");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="border p-6 rounded w-80 shadow-lg">
        <h1 className="text-xl mb-4 font-bold">Login</h1>
        <input
          className="border w-full mb-4 p-2 rounded"
          placeholder="User ID"
          value={userId}
          onChange={e => setUserId(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full p-2 rounded transition-colors"
        >
          Login
        </button>
      </div>
    </div>
  );
}