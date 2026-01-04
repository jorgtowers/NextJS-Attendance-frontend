
"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { http } from "@/services/http";

export default function LoginPage() {
  const { login } = useAuth();
  const [userId, setUserId] = useState("");

  const handleLogin = async () => {
    const { data } = await http.get(`/users/${userId}`);
    login(data);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="border p-6 rounded w-80">
        <h1 className="text-xl mb-4">Login</h1>
        <input
          className="border w-full mb-4 p-2"
          placeholder="User ID"
          value={userId}
          onChange={e => setUserId(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white w-full p-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}
