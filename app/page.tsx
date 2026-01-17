"use client";
import { useState } from 'react';
import { http } from '@/services/http';
import { 
  Building2, 
  CheckCircle, 
  Clock, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  UserCircle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

// Imágenes verificadas y estables
const HERO_IMG = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000";
const TEAM_IMG = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000";

export default function LandingPage() {
  const [formData, setFormData] = useState({
    RIF: '', CompanyName: '', Address: '', Phone: '', Email: '', ContactName: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      await http.post("/companies", { ...formData, CreatedAt: new Date(), IsActive:false });
      setStatus({ type: 'success', msg: '¡Empresa registrada con éxito! Pronto te contactaremos.' });
      setFormData({ RIF: '', CompanyName: '', Address: '', Phone: '', Email: '', ContactName: '' });
    } catch (err: any) {
      setStatus({ type: 'error', msg: 'Error al registrar. Verifica los datos.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* 1. NAVEGACIÓN */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-black text-slate-900">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Clock className="text-white" size={24} />
            </div>
            TimeTrack<span className="text-blue-600">Pro</span>
          </div>
          <a href="#register" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all text-sm">
            Prueba Gratis
          </a>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMG} alt="Office" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/70 backdrop-grayscale-[0.5]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-2 rounded-full text-sm font-bold mb-6 backdrop-blur-md">
              <Sparkles size={16} /> Sistema de Control 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-8">
              Tu equipo, <br />
              <span className="text-blue-400 underline decoration-blue-500/30">en sintonía.</span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
              Captura entradas, salidas y reportes automáticos. Diseñado para empresas que valoran la precisión y el tiempo de su talento humano.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#register" className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-blue-600/20">
                Registrar Empresa
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICIOS / CARACTERÍSTICAS */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Control total en un solo lugar</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Nuestra plataforma resuelve la complejidad administrativa del control de asistencia.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:scale-110 transition-transform">
              <Clock size={30} />
            </div>
            <h3 className="text-xl font-bold mb-4">Captura de Datos</h3>
            <p className="text-slate-500 leading-relaxed">Registro exacto de entradas y salidas mediante interfaces móviles intuitivas.</p>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:scale-110 transition-transform">
              <Users size={30} />
            </div>
            <h3 className="text-xl font-bold mb-4">Gestión Humana</h3>
            <p className="text-slate-500 leading-relaxed">Perfiles detallados de empleados, roles y asignación de supervisores inmediata.</p>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-8 group-hover:scale-110 transition-transform">
              <CheckCircle size={30} />
            </div>
            <h3 className="text-xl font-bold mb-4">Reportes Pro</h3>
            <p className="text-slate-500 leading-relaxed">Generación de archivos para nómina y cálculo automático de minutos trabajados.</p>
          </div>
        </div>
      </section>

      {/* 4. FORMULARIO DE REGISTRO */}
      <section id="register" className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
            <img src={TEAM_IMG} alt="Team" className="w-full h-full object-cover grayscale" />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
            
            {/* Lateral Info */}
            <div className="md:w-1/3 bg-blue-600 p-12 text-white flex flex-col justify-center">
              <h2 className="text-4xl font-black mb-6">Empieza el cambio.</h2>
              <p className="text-blue-100 mb-8 leading-relaxed">
                Únete a más de 500 empresas que optimizan su tiempo con nosotros.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm font-bold bg-white/10 p-3 rounded-xl border border-white/20">
                  <CheckCircle size={18} /> Instalación en minutos
                </li>
                <li className="flex items-center gap-3 text-sm font-bold bg-white/10 p-3 rounded-xl border border-white/20">
                  <CheckCircle size={18} /> Soporte técnico 24/7
                </li>
              </ul>
            </div>

            {/* Formulario Real */}
            <div className="md:w-2/3 p-12">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">RIF de Empresa</label>
                  <input required name="RIF" value={formData.RIF} onChange={handleChange} placeholder="J-12345678-0" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Nombre Comercial</label>
                  <input required name="CompanyName" value={formData.CompanyName} onChange={handleChange} placeholder="Nombre de la empresa" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Dirección Principal</label>
                  <textarea required name="Address" value={formData.Address} onChange={handleChange} rows={2} className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Teléfono</label>
                  <input required name="Phone" value={formData.Phone} onChange={handleChange} placeholder="+58..." className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Email Corporativo</label>
                  <input required type="email" name="Email" value={formData.Email} onChange={handleChange} placeholder="admin@empresa.com" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Nombre de Contacto</label>
                  <input required name="ContactName" value={formData.ContactName} onChange={handleChange} placeholder="Ej: Ing. Jorge Torres" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all" />
                </div>

                <div className="md:col-span-2 mt-4">
                  <button disabled={loading} className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] text-lg hover:bg-black transition-all shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center justify-center gap-3">
                    {loading ? "Registrando..." : "Crear Cuenta Corporativa"}
                    {!loading && <ArrowRight size={20} />}
                  </button>
                  {status.msg && (
                    <p className={`mt-4 text-center font-bold ${status.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {status.msg}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 text-center text-slate-400 text-sm border-t border-slate-100 bg-white">
        <p>&copy; {new Date().getFullYear()} TimeTrackPro. Venezuela.</p>
      </footer>
    </div>
  );
}