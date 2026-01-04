"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { http } from "@/services/http";
import { Clock, LogIn, LogOut, User as UserIcon, Calendar } from "lucide-react"; // Opcional: instalando lucide-react

export default function AttendancePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [openRecord, setOpenRecord] = useState<any>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Función para validar si hay un registro abierto
  const fetchStatus = useCallback(async () => {
    if (!user?._id) return;
    try {
      const response = await http.get(`/attendance-records/open/${user._id}`);
      setOpenRecord(response.data || null);
    } catch (error) {
      console.error("Error fetching status", error);
    } finally {
      setCheckingStatus(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <p className="text-slate-600 animate-pulse">Cargando sesión...</p>
    </div>
  );

  const handleAttendance = async (type: "IN" | "OUT") => {
    setLoading(true);
    try {
      const now = new Date();
      if (type === "IN") {
        await http.post("/attendance-records/check", {
          UserId: user._id,
          CompanyId: user.CompanyId,
          Date: now.toISOString().split('T')[0],
          CheckIn: now.toISOString(),
          CheckOut: null,
          WorkedMinutes: 0,
          Source: "MOBILE",
          CreatedAt: now
        });
      } else {
        const timeIn = new Date(openRecord.CheckIn);
        const diffMinutes = Math.floor((now.getTime() - timeIn.getTime()) / 60000);

        await http.post("/attendance-records/check", {
          _id: openRecord._id,
          ...openRecord,
          CheckOut: now.toISOString(),
          WorkedMinutes: diffMinutes,
        });
      }
      // Refrescar el estado después de la acción
      await fetchStatus();
    } catch (error) {
      alert("Error en el servidor. Intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto">
        
        {/* Header de Bienvenida */}
        <header className="mb-8 flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              ¡Bienvenido, <span className="text-blue-600">{user.FullName || 'Colaborador'}</span>! 
            </h1>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
              <Calendar size={14} /> {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <UserIcon size={24} />
          </div>
        </header>

        {/* Tarjeta Informativa */}
        <div className="bg-blue-600 rounded-2xl p-6 mb-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-lg font-semibold mb-2">Control de Jornada</h2>
            <p className="text-blue-100 text-sm leading-relaxed opacity-90">
              Esta pantalla registra el control de horas y minutos de tu jornada laboral. 
              Recuerda realizar tus marcajes a tiempo para asegurar la precisión de tu nómina.
            </p>
          </div>
          <Clock className="absolute -right-4 -bottom-4 text-blue-500 opacity-20" size={120} />
        </div>

        {/* Panel de Acción */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
          {checkingStatus ? (
            <div className="py-10 animate-pulse text-slate-400">Verificando estado...</div>
          ) : (
            <>
              <div className="mb-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${openRecord ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {openRecord ? "● Jornada en curso" : "○ Sin actividad reciente"}
                </span>
              </div>

              <div className="flex flex-col gap-4 items-center">
                {/* Lógica Condicional de Botones */}
                {!openRecord ? (
                  <button
                    disabled={loading}
                    onClick={() => handleAttendance("IN")}
                    className="group relative w-full md:w-64 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-xl flex items-center justify-center gap-3"
                  >
                    <LogIn size={20} />
                    {loading ? "Registrando..." : "Iniciar Jornada"}
                  </button>
                ) : (
                  <div className="w-full space-y-4">
                    <div className="text-sm text-slate-500">
                      Entrada registrada a las: <b className="text-slate-700">{new Date(openRecord.CheckIn).toLocaleTimeString()}</b>
                    </div>
                    <button
                      disabled={loading}
                      onClick={() => handleAttendance("OUT")}
                      className="group relative w-full md:w-64 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-red-100 flex items-center justify-center gap-3 mx-auto"
                    >
                      <LogOut size={20} />
                      {loading ? "Procesando..." : "Finalizar Jornada"}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <footer className="mt-8 text-center text-slate-400 text-xs">
          Sistema de Gestión de Talento Humano &copy; 2026
        </footer>
      </div>
    </div>
  );
}