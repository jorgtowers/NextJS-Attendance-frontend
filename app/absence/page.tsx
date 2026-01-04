"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { http } from "@/services/http";
import { 
  CalendarDays, 
  Plus, 
  Trash2, 
  Edit3, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  ChevronRight
} from "lucide-react";

const TYPES = ["PERMISSION", "ABSENCE", "VACATION", "MEDICAL", "OTHER"];
const STATUS_COLORS: any = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  APPROVED: "bg-green-100 text-green-700 border-green-200",
  REJECTED: "bg-red-100 text-red-700 border-red-200",
};

export default function AbsencesPage() {
  const { user } = useAuth();
  const [absences, setAbsences] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Estado para el formulario (Crear/Editar)
  const [formData, setFormData] = useState({
    _id: "",
    Type: "VACATION",
    StartDate: "",
    EndDate: "",
    Reason: "",
    Status: "PENDING"
  });

  const fetchAbsences = useCallback(async () => {
    if (!user?._id) return;
    try {
      const response = await http.get(`/absences/${user.CompanyId}/${user._id}`);
      setAbsences(response.data || []);
    } catch (error) {
      console.error("Error fetching absences", error);
    }
  }, [user?._id]);

  useEffect(() => { fetchAbsences(); }, [fetchAbsences]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        UserId: user?._id,
        CompanyId: user?.CompanyId,
        CreatedAt: new Date().toISOString()
      };

      if (formData._id) {
        await http.put(`/absences/${formData._id}`, payload);
      } else {
        await http.post("/absences", payload);
      }
      
      resetForm();
      fetchAbsences();
    } catch (error) {
      alert("Error al guardar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta solicitud?")) return;
    try {
      await http.delete(`/absences/${id}`);
      fetchAbsences();
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  const resetForm = () => {
    setFormData({ _id: "", Type: "VACATION", StartDate: "", EndDate: "", Reason: "", Status: "PENDING" });
    setIsFormOpen(false);
  };

  if (!user) return <div className="p-10 text-center">Cargando sesión...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Gestión de Ausencias para {user?.FullName}</h1>
            <p className="text-slate-500 mt-1">Solicita permisos, vacaciones o reporta ausencias médicas.</p>
          </div>
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-100"
          >
            {isFormOpen ? <XCircle size={20} /> : <Plus size={20} />}
            {isFormOpen ? "Cancelar" : "Nueva Solicitud"}
          </button>
        </header>

        {/* Formulario de Registro (Colapsable) */}
        {isFormOpen && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-700">
              <FileText className="text-blue-500" size={20} />
              {formData._id ? "Editar Solicitud" : "Detalles de la Solicitud"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Tipo de Ausencia</label>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.Type}
                  onChange={(e) => setFormData({...formData, Type: e.target.value})}
                >
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Estado (Simulación)</label>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.Status}
                  onChange={(e) => setFormData({...formData, Status: e.target.value})}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Fecha Inicio</label>
                <input 
                  type="date" 
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.StartDate}
                  onChange={(e) => setFormData({...formData, StartDate: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Fecha Fin</label>
                <input 
                  type="date" 
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.EndDate}
                  onChange={(e) => setFormData({...formData, EndDate: e.target.value})}
                  required
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-slate-600">Motivo / Justificación</label>
                <textarea 
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Explique brevemente el motivo..."
                  value={formData.Reason}
                  onChange={(e) => setFormData({...formData, Reason: e.target.value})}
                  required
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="px-6 py-2 rounded-xl text-slate-500 hover:bg-slate-100 font-medium"
                >
                  Cancelar
                </button>
                <button 
                  disabled={loading}
                  className="bg-slate-900 text-white px-8 py-2 rounded-xl font-bold hover:bg-slate-800 disabled:bg-slate-400 transition-all shadow-lg"
                >
                  {loading ? "Guardando..." : "Enviar Solicitud"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Listado Histórico */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-slate-700 flex items-center gap-2">
              <Clock size={18} className="text-slate-400" />
              Historial de Solicitudes
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs uppercase text-slate-400 font-semibold bg-slate-50">
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Periodo</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {absences.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                      No se encontraron registros de ausencias.
                    </td>
                  </tr>
                ) : (
                  absences.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <CalendarDays size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-700 text-sm">{item.Type}</p>
                            <p className="text-xs text-slate-400 truncate max-w-[150px]">{item.Reason}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600 font-medium">
                          {item.StartDate} <span className="text-slate-300 mx-1">→</span> {item.EndDate}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${STATUS_COLORS[item.Status]}`}>
                          {item.Status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.Status === "PENDING" && (
                            <>
                              <button 
                                onClick={() => handleEdit(item)}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                title="Editar"
                              >
                                <Edit3 size={18} />
                              </button>
                              <button 
                                onClick={() => handleDelete(item._id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Eliminar"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                          <ChevronRight size={18} className="text-slate-300" />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}