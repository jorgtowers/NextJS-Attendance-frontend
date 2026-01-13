"use client";
import { useState, useEffect } from "react";
import { http } from "@/services/http";
import { Building2, Search, Calendar, Timer } from "lucide-react";

export default function AttendanceTable() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await http.get("/attendance-records/list");
        setRecords(response.data || []);
      } catch (error) {
        console.error("Error fetching list", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  /**
   * Lógica para formatear la salida:
   * Si la fecha de salida es distinta a la de entrada, muestra DD/MM hh:mm AM/PM
   */
  const formatDateTime = (checkOutStr: string | null, checkInStr: string) => {
    if (!checkOutStr) return "--:--";

    const dateIn = new Date(checkInStr);
    const dateOut = new Date(checkOutStr);

    // Comparamos si es el mismo día, mes y año
    const isSameDay = 
      dateIn.getDate() === dateOut.getDate() &&
      dateIn.getMonth() === dateOut.getMonth() &&
      dateIn.getFullYear() === dateOut.getFullYear();

    if (isSameDay) {
      // Solo hora: 08:30 PM
      return dateOut.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } else {
      // Fecha y hora: 12/01 02:15 AM
      const day = String(dateOut.getDate()).padStart(2, '0');
      const month = String(dateOut.getMonth() + 1).padStart(2, '0');
      const time = dateOut.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      return `${day}/${month} ${time}`;
    }
  };

  const formatSimpleTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header con búsqueda */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight text-balance">Registro de Asistencia</h1>
            <p className="text-slate-500 text-sm">Control de jornadas con detección de cambios de día.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar colaborador..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all w-64"
            />
          </div>
        </div>

        {/* Contenedor de Tabla */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Colaborador</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Compañía</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha In</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Entrada / Salida</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Estado</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Duración</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-50">
              {!loading && records.map((record) => (
                <tr key={record._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {record.UserData?.FullName?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{record.UserData?.FullName}</p>
                        <p className="text-xs text-slate-400 font-medium">{record.UserData?.Role}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-slate-300" />
                      {record.CompanyData?.CompanyName}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {record.Date}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-center">
                        <span className="text-[10px] block text-slate-400 font-bold uppercase">Entrada</span>
                        <span className="text-sm font-semibold text-slate-700">{formatSimpleTime(record.CheckIn)}</span>
                      </div>
                      <div className="h-4 w-[1px] bg-slate-200"></div>
                      <div className="text-center">
                        <span className="text-[10px] block text-slate-400 font-bold uppercase">Salida</span>
                        <span className={`text-sm font-semibold ${record.CheckOut && new Date(record.CheckOut).getDate() !== new Date(record.CheckIn).getDate() ? 'text-blue-600' : 'text-slate-700'}`}>
                          {formatDateTime(record.CheckOut, record.CheckIn)}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    {!record.CheckOut ? (
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        En Curso
                      </span>
                    ) : (
                      <span className="inline-flex items-center bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight">
                        Cerrado
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm font-bold text-slate-900">{record.WorkedMinutes}</span>
                      <span className="text-[10px] text-slate-400 font-bold">MIN</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}