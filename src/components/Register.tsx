import { useState } from 'react';
import { Package, Mail, Lock, User, Eye, EyeOff, ArrowLeft, TrendingUp, Shield, Check, Sparkles } from 'lucide-react';

interface RegisterProps {
  onRegister: (name: string, email: string, password: string) => void;
  onBackToLogin: () => void;
  error: string | null;
}

export function Register({ onRegister, onBackToLogin, error }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!name || !email || !password || !confirmPassword) {
      setLocalError('Todos los campos son obligatorios');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    onRegister(name, email, password);
  };

  const passwordStrength = password.length >= 8 ? 'strong' : password.length >= 6 ? 'medium' : 'weak';

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
                  Comienza tu prueba gratuita
                </h2>
                <p className="text-white/90 text-lg">
                  Únete a más de 500 empresas que confían en nuestra plataforma para gestionar su inventario.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 bg-white/10 backdrop-blur-sm rounded-2xl">
                  <div className="p-3 bg-blue-500 rounded-xl shrink-0">
                    <Check size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white mb-1">Configuración Rápida</h4>
                    <p className="text-white/80">Comienza en menos de 5 minutos</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-white/10 backdrop-blur-sm rounded-2xl">
                  <div className="p-3 bg-blue-600 rounded-xl shrink-0">
                    <TrendingUp size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white mb-1">Sin Tarjeta de Crédito</h4>
                    <p className="text-white/80">Prueba gratuita sin compromisos</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-white/10 backdrop-blur-sm rounded-2xl">
                  <div className="p-3 bg-blue-700 rounded-xl shrink-0">
                    <Shield size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white mb-1">100% Seguro</h4>
                    <p className="text-white/80">Tus datos están protegidos</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-blue-400 border-2 border-white" />
                  <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white" />
                  <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white" />
                </div>
                <div>
                  <p className="text-white">Únete a +500 empresas</p>
                  <div className="flex gap-1 mt-1">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="text-white/80 text-sm ml-2">4.9/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Register Form */}
          <div className="bg-white p-12 lg:p-16 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <button
                onClick={onBackToLogin}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors"
              >
                <ArrowLeft size={20} />
                Volver al inicio de sesión
              </button>

              <div className="mb-10 text-center">
                <h2 className="text-slate-900 text-3xl mb-2">Crear Cuenta</h2>
                <p className="text-slate-600">Completa tus datos</p>
              </div>

              {(error || localError) && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600">{error || localError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-slate-700 mb-2">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Juan Pérez"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="correo@ejemplo.com"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            passwordStrength === 'strong'
                              ? 'w-full bg-green-500'
                              : passwordStrength === 'medium'
                              ? 'w-2/3 bg-yellow-500'
                              : 'w-1/3 bg-red-500'
                          }`}
                        />
                      </div>
                      <span
                        className={`text-xs ${
                          passwordStrength === 'strong'
                            ? 'text-green-600'
                            : passwordStrength === 'medium'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {passwordStrength === 'strong'
                          ? 'Fuerte'
                          : passwordStrength === 'medium'
                          ? 'Media'
                          : 'Débil'}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {confirmPassword && password === confirmPassword && (
                    <p className="mt-2 text-green-600 text-sm flex items-center gap-1">
                      <Check size={14} />
                      Las contraseñas coinciden
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                >
                  <span>Crear Cuenta Gratis</span>
                  <Sparkles size={18} />
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-600">
                  ¿Ya tienes una cuenta?{' '}
                  <button
                    onClick={onBackToLogin}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Iniciar sesión
                  </button>
                </p>
              </div>

              <p className="mt-6 text-center text-slate-500 text-sm">
                Al registrarte, aceptas nuestros{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  Términos de Servicio
                </a>{' '}
                y{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  Política de Privacidad
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
