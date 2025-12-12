import { useState } from 'react';
import { Package, Mail, Lock, Eye, EyeOff, TrendingUp, Shield, BarChart3, Users, Zap } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onShowRegister: () => void;
  error: string | null;
}

export function Login({ onLogin, onShowRegister, error }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side - Branding */}
          <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 p-12 lg:p-16 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-12">
                <div className="p-3 bg-blue-500 rounded-2xl">
                  <Package size={36} className="text-white" />
                </div>
                <div>
                  <h1 className="text-white text-2xl">InventoryPro</h1>
                  <p className="text-white text-sm">Sistema de Gestión Inteligente</p>
                </div>
              </div>

              <div className="mb-12">
                <h2 className="text-white text-4xl mb-4">
                  Bienvenido de nuevo
                </h2>
                <p className="text-white/90 text-lg">
                  Accede a tu panel de control y gestiona tu inventario con inteligencia artificial.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 bg-white/10 backdrop-blur-sm rounded-2xl">
                  <div className="p-3 bg-blue-500 rounded-xl shrink-0">
                    <TrendingUp size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white mb-1">Análisis en Tiempo Real</h4>
                    <p className="text-white/80">Métricas actualizadas al instante con IA</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-white/10 backdrop-blur-sm rounded-2xl">
                  <div className="p-3 bg-blue-600 rounded-xl shrink-0">
                    <Shield size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white mb-1">Seguridad Avanzada</h4>
                    <p className="text-white/80">Encriptación de datos de nivel empresarial</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-white/10 backdrop-blur-sm rounded-2xl">
                  <div className="p-3 bg-blue-700 rounded-xl shrink-0">
                    <BarChart3 size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white mb-1">Reportes Inteligentes</h4>
                    <p className="text-white/80">Visualizaciones interactivas y exportables</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-blue-400 border-2 border-white" />
                <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white" />
                <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white" />
              </div>
              <div>
                <p className="text-white">+500 empresas</p>
                <p className="text-white/80 text-sm">confían en nosotros</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-white p-12 lg:p-16 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-10 text-center">
                <h2 className="text-slate-900 text-3xl mb-2">Iniciar Sesión</h2>
                <p className="text-slate-600">Accede a tu cuenta</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-slate-700 mb-2">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                >
                  <span>Iniciar Sesión</span>
                  <Zap size={18} />
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-600">
                  ¿No tienes una cuenta?{' '}
                  <button
                    onClick={onShowRegister}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Crear cuenta gratis
                  </button>
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-slate-500 text-center mb-4 text-sm flex items-center justify-center gap-2">
                  <Shield size={16} />
                  Credenciales de prueba
                </p>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('admin@sgii.com');
                      setPassword('admin123');
                    }}
                    className="w-full bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Shield size={16} className="text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-slate-900">Administrador</p>
                        <p className="text-slate-500 text-sm">admin@sgii.com / admin123</p>
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('empleado@sgii.com');
                      setPassword('emp123');
                    }}
                    className="w-full bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <Users size={16} className="text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-slate-900">Empleado</p>
                        <p className="text-slate-500 text-sm">empleado@sgii.com / emp123</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
