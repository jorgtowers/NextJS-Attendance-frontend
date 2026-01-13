"use client";
import { useState, useEffect } from "react";
import { http } from "@/services/http";
import { 
  User, 
  Building2, 
  Clock, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownLeft,
  Timer
} from "lucide-react";

export default function AttendanceList() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await http.get("/attendance-records/list");
        setRecords(response.data || []);
      } catch (error) {
        console.error("Error fetching attendance list", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "--:--";
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Elegante */}
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Reporte de Asistencia
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Monitoreo en tiempo real de la jornada laboral por compañía.
          </p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-white rounded-3xl animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {records.map((record) => (
              <div 
                key={record._id} 
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 relative overflow-hidden group"
              >
                {/* Status Badge */}
                <div className="absolute top-6 right-6">
                  {!record.CheckOut ? (
                    <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      En curso
                    </span>
                  ) : (
                    <span className="bg-slate-50 text-slate-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      Finalizado
                    </span>
                  )}
                </div>

                {/* Info de Usuario y Compañía */}
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 leading-none">
                        {record.UserData?.FullName}
                      </h3>
                      <p className="text-sm text-blue-600 font-medium mt-1">
                        {record.UserData?.Role}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Building2 size={14} />
                    <span className="truncate">{record.CompanyData?.CompanyName}</span>
                  </div>
                </div>

                {/* Grid de Horarios */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-4 mb-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                      <ArrowDownLeft size={10} className="text-emerald-500" /> Entrada
                    </p>
                    <p className="text-lg font-bold text-slate-700">
                      {formatTime(record.CheckIn)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                      <ArrowUpRight size={10} className="text-rose-500" /> Salida
                    </p>
                    <p className="text-lg font-bold text-slate-700">
                      {formatTime(record.CheckOut)}
                    </p>
                  </div>
                </div>

                {/* Footer del Card */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                    <Calendar size={16} />
                    {record.Date}
                  </div>
                  <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <Timer size={18} className="text-blue-500" />
                    {record.WorkedMinutes} <span className="text-[10px] text-slate-400 uppercase">min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {records.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400">No hay registros de asistencia para mostrar.</p>
          </div>
        )}
      </div>
    </div>
  );
}