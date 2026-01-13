"use client";
import { useState } from 'react';
import { http } from '@/services/http';
import { 
  Building, // Icono para empresa
  CheckCircle, // Icono para éxito
  Clock, // Control de jornada
  Users, // Empleados
  MapPin, // Dirección
  Phone, // Teléfono
  Mail, // Email
  UserCircle, // Contacto
  Sparkles // Estrellas
} from 'lucide-react';

// URL de imagen ficticia para control de jornada
const heroImageUrl = "https://images.unsplash.com/photo-1510525008502-0e271ee1b474?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
// URL de imagen ficticia para empleados
const employeesImageUrl = "https://images.unsplash.com/photo-1504384308090-c894fd24153e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";


export default function LandingPage() {
  const [formData, setFormData] = useState({
    RIF: '',
    CompanyName: '',
    Address: '',
    Phone: '',
    Email: '',
    ContactName: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Endpoint ficticio para registrar compañías.
      // Asegúrate de que tu API Gateway tenga una Lambda para /companies/register
      await http.post("/companies/register", {
        ...formData,
        // Puedes agregar campos adicionales como CreatedAt, Status, etc. aquí
        CreatedAt: new Date().toISOString(),
        Status: "ACTIVE" // o PENDING si requiere aprobación
      });
      setSuccess(true);
      setFormData({ // Limpiar formulario
        RIF: '', CompanyName: '', Address: '', Phone: '', Email: '', ContactName: '',
      });
    } catch (err: any) {
      console.error("Error al registrar compañía:", err);
      setError(err.response?.data?.message || "Ocurrió un error al intentar registrar la compañía.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white font-sans text-slate-800">
      {/* Navbar Simple */}
      <nav className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
        <div className="text-2xl font-extrabold text-blue-700 flex items-center gap-2">
          <Clock size={28} className="text-blue-500" />
          TimeTrackPro
        </div>
        <div>
          <a href="#register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors shadow-md">
            Registra tu Empresa
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center overflow-hidden mb-16">
        <img 
          src={heroImageUrl} 
          alt="Control de Jornada Laboral" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 blur-[2px]"
        />
        <div className="relative z-10 max-w-4xl px-6 text-white bg-slate-900/60 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg">
            Gestión Inteligente de Jornadas Laborales
          </h1>
          <p className="text-lg md:text-xl font-light mb-6 drop-shadow-md">
            Simplifica el control de entradas y salidas de tu personal. Optimiza el tiempo, mejora la productividad y asegura la precisión.
          </p>
          <a href="#register" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl text-lg transition-all transform hover:scale-105 shadow-xl shadow-blue-300">
            <Sparkles size={20} />
            Comienza Gratis
          </a>
        </div>
      </section>

      {/* Descripción del Servicio (Características) */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-10">¿Por qué elegir nuestro sistema?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Característica 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center transform transition-transform hover:scale-105 hover:shadow-xl duration-300">
            <Clock size={48} className="text-blue-500 mb-6" />
            <h3 className="text-xl font-bold mb-3">Control Preciso de Tiempos</h3>
            <p className="text-slate-600">Registra entradas, salidas y pausas con exactitud milimétrica. Olvídate de los errores manuales.</p>
          </div>
          {/* Característica 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center transform transition-transform hover:scale-105 hover:shadow-xl duration-300">
            <Users size={48} className="text-emerald-500 mb-6" />
            <h3 className="text-xl font-bold mb-3">Gestión de Personal Simplificada</h3>
            <p className="text-slate-600">Accede a reportes completos por empleado y compañía. Monitorea el rendimiento de tu equipo.</p>
          </div>
          {/* Característica 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center transform transition-transform hover:scale-105 hover:shadow-xl duration-300">
            <CheckCircle size={48} className="text-purple-500 mb-6" />
            <h3 className="text-xl font-bold mb-3">Integración y Escalabilidad</h3>
            <p className="text-slate-600">Diseñado para crecer con tu empresa. Fácil de integrar con tus sistemas existentes.</p>
          </div>
        </div>
      </section>

      {/* Imagen Alusiva a Empleados */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
          <img 
            src={employeesImageUrl} 
            alt="Equipo de trabajo" 
            className="w-full h-96 object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent flex items-end p-10">
            <h3 className="text-white text-3xl font-bold leading-tight">
              Un equipo productivo es el corazón de tu negocio.
            </h3>
          </div>
        </div>
      </section>

      {/* Formulario de Registro de Compañía */}
      <section id="register" className="max-w-4xl mx-auto px-6 py-16 bg-white rounded-3xl shadow-xl border border-blue-50 mb-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">
          Registra tu Compañía
        </h2>
        <p className="text-slate-600 mb-10 text-center max-w-2xl mx-auto">
          Comienza hoy mismo a optimizar la gestión de asistencia de tu equipo.
          Completa el formulario y nos pondremos en contacto.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* RIF */}
          <div className="space-y-2">
            <label htmlFor="RIF" className="block text-sm font-medium text-slate-700">RIF</label>
            <input 
              type="text" 
              id="RIF" 
              name="RIF"
              value={formData.RIF}
              onChange={handleChange}
              placeholder="J-12345678-9"
              required
              className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          {/* Nombre de Compañía */}
          <div className="space-y-2">
            <label htmlFor="CompanyName" className="block text-sm font-medium text-slate-700">Nombre de la Compañía</label>
            <input 
              type="text" 
              id="CompanyName" 
              name="CompanyName"
              value={formData.CompanyName}
              onChange={handleChange}
              placeholder="Tu Empresa C.A."
              required
              className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          {/* Dirección */}
          <div className="md:col-span-2 space-y-2">
            <label htmlFor="Address" className="block text-sm font-medium text-slate-700">Dirección</label>
            <textarea 
              id="Address" 
              name="Address"
              rows={3}
              value={formData.Address}
              onChange={handleChange}
              placeholder="Avenida Principal, Edificio Tal, Piso 5..."
              required
              className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            ></textarea>
          </div>
          {/* Teléfono */}
          <div className="space-y-2">
            <label htmlFor="Phone" className="block text-sm font-medium text-slate-700">Teléfono</label>
            <input 
              type="tel" 
              id="Phone" 
              name="Phone"
              value={formData.Phone}
              onChange={handleChange}
              placeholder="+XX XXX XXX XX XX"
              required
              className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="Email" className="block text-sm font-medium text-slate-700">Email Corporativo</label>
            <input 
              type="email" 
              id="Email" 
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              placeholder="contacto@tuempresa.com"
              required
              className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          {/* Nombre Contacto */}
          <div className="md:col-span-2 space-y-2">
            <label htmlFor="ContactName" className="block text-sm font-medium text-slate-700">Nombre del Contacto Principal</label>
            <input 
              type="text" 
              id="ContactName" 
              name="ContactName"
              value={formData.ContactName}
              onChange={handleChange}
              placeholder="Juan Pérez (Gerente de RRHH)"
              required
              className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Mensajes de feedback */}
          {success && (
            <div className="md:col-span-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <CheckCircle size={20} />
              <span>¡Registro exitoso! Nos pondremos en contacto a la brevedad.</span>
            </div>
          )}
          {error && (
            <div className="md:col-span-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <Sparkles size={20} />
              <span>Error: {error}</span>
            </div>
          )}

          {/* Botón de Registro */}
          <div className="md:col-span-2 text-center mt-6">
            <button 
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-200 disabled:bg-blue-400 disabled:shadow-none"
            >
              {loading ? (
                <>
                  <Clock size={20} className="animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  <Building size={20} />
                  Registrar mi Compañía
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto text-center py-10 border-t border-slate-100 text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} TimeTrackPro. Todos los derechos reservados.
      </footer>
    </div>
  );
}