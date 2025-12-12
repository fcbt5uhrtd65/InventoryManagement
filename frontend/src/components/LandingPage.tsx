import { Package, TrendingUp, Shield, BarChart3, Users, CheckCircle, Zap, ArrowRight, Star, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface LandingPageProps {
  onShowLogin: () => void;
  onShowRegister: () => void;
}

export function LandingPage({ onShowLogin, onShowRegister }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: TrendingUp,
      title: 'Análisis en Tiempo Real',
      description: 'Visualiza el estado de tu inventario con dashboards interactivos y métricas actualizadas al instante.'
    },
    {
      icon: Shield,
      title: 'Control de Acceso',
      description: 'Sistema de roles y permisos para gestionar quién puede ver y modificar la información.'
    },
    {
      icon: BarChart3,
      title: 'Reportes Detallados',
      description: 'Genera informes completos con gráficos interactivos y exporta a CSV o PDF.'
    },
    {
      icon: Package,
      title: 'Gestión de Productos',
      description: 'CRUD completo con categorías personalizadas, códigos de barras y alertas de stock.'
    },
    {
      icon: Users,
      title: 'Multi-usuario',
      description: 'Colaboración en equipo con auditoría completa de todas las acciones realizadas.'
    },
    {
      icon: Zap,
      title: 'Alertas Inteligentes',
      description: 'Notificaciones automáticas de stock bajo, productos vencidos y más.'
    }
  ];

  const benefits = [
    'Reduce pérdidas por stock agotado',
    'Optimiza el espacio de almacenamiento',
    'Toma decisiones basadas en datos',
    'Mejora la eficiencia operativa',
    'Control total de proveedores',
    'Auditoría completa de movimientos'
  ];

  const stats = [
    { value: '500+', label: 'Empresas Activas' },
    { value: '99.9%', label: 'Tiempo Activo' },
    { value: '24/7', label: 'Soporte' },
    { value: '4.9/5', label: 'Calificación' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-xl">
                <Package size={24} className="text-white" />
              </div>
              <span className="text-slate-900">InventoryPro</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#inicio" className="text-slate-600 hover:text-blue-600 transition-colors">Inicio</a>
              <a href="#funcionalidades" className="text-slate-600 hover:text-blue-600 transition-colors">Funcionalidades</a>
              <a href="#beneficios" className="text-slate-600 hover:text-blue-600 transition-colors">Beneficios</a>
              <a href="#precios" className="text-slate-600 hover:text-blue-600 transition-colors">Precios</a>
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={onShowLogin}
                className="px-6 py-2.5 text-blue-600 hover:text-blue-700 transition-colors"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={onShowRegister}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                Comenzar Gratis
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200">
            <nav className="flex flex-col p-4 space-y-2">
              <a href="#inicio" className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Inicio</a>
              <a href="#funcionalidades" className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Funcionalidades</a>
              <a href="#beneficios" className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Beneficios</a>
              <a href="#precios" className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Precios</a>
              <button
                onClick={onShowLogin}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-left"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={onShowRegister}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Comenzar Gratis
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="inicio" className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-6">
                <Zap size={16} />
                <span>Sistema de Gestión Inteligente</span>
              </div>
              <h1 className="text-slate-900 mb-6">
                Controla tu inventario con inteligencia
              </h1>
              <p className="text-slate-600 text-xl mb-8 leading-relaxed">
                InventoryPro es la solución completa para gestionar tu stock, proveedores, 
                almacenes y movimientos en tiempo real. Toma decisiones informadas con 
                reportes y análisis avanzados.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onShowRegister}
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Comenzar Ahora
                  <ArrowRight size={20} />
                </button>
                <button
                  onClick={onShowLogin}
                  className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all"
                >
                  Iniciar Sesión
                </button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mt-12">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <h3 className="text-blue-600 mb-1">{stat.value}</h3>
                    <p className="text-slate-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 rounded-3xl blur-3xl opacity-10" />
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-slate-200">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                    <div className="p-3 bg-blue-600 rounded-xl">
                      <Package size={24} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-slate-900">1,250 Productos</h4>
                      <p className="text-slate-500">En inventario activo</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl">
                    <div className="p-3 bg-emerald-600 rounded-xl">
                      <TrendingUp size={24} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-slate-900">+23% Este mes</h4>
                      <p className="text-slate-500">Crecimiento en ventas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                    <div className="p-3 bg-blue-600 rounded-xl">
                      <BarChart3 size={24} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-slate-900">$45,320 USD</h4>
                      <p className="text-slate-500">Valor total inventario</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-slate-900 mb-4">Funcionalidades Poderosas</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Todo lo que necesitas para gestionar tu inventario de manera profesional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 bg-white border border-slate-200 rounded-2xl hover:shadow-lg hover:border-blue-200 transition-all group"
                >
                  <div className="p-3 bg-blue-100 rounded-xl inline-block mb-4 group-hover:bg-blue-600 transition-all">
                    <Icon size={28} className="text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-slate-900 mb-6">
                ¿Por qué elegir InventoryPro?
              </h2>
              <p className="text-slate-600 text-lg mb-8">
                Nuestra plataforma te ayuda a tener control total de tu negocio con 
                herramientas diseñadas para maximizar tu eficiencia.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="p-1 bg-blue-100 rounded-full">
                      <CheckCircle size={20} className="text-blue-600" />
                    </div>
                    <span className="text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <Star className="text-yellow-400" size={24} fill="currentColor" />
                <Star className="text-yellow-400" size={24} fill="currentColor" />
                <Star className="text-yellow-400" size={24} fill="currentColor" />
                <Star className="text-yellow-400" size={24} fill="currentColor" />
                <Star className="text-yellow-400" size={24} fill="currentColor" />
              </div>
              <p className="text-slate-700 text-lg mb-6 italic">
                "InventoryPro transformó completamente nuestra gestión de inventario. 
                Ahora tenemos visibilidad total y hemos reducido pérdidas en un 40%. 
                Altamente recomendado para cualquier negocio."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <span>MC</span>
                </div>
                <div>
                  <h4 className="text-slate-900">María Castillo</h4>
                  <p className="text-slate-500">CEO, TechStore Colombia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precios" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-slate-900 mb-4">Planes Flexibles</h2>
            <p className="text-slate-600 text-lg">Elige el plan perfecto para tu negocio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Plan Básico */}
            <div className="p-8 bg-white border-2 border-slate-200 rounded-2xl hover:shadow-lg hover:border-blue-200 transition-all">
              <div className="mb-6">
                <h3 className="text-slate-900 mb-2">Básico</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-slate-900">$29</span>
                  <span className="text-slate-500">/mes</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-600">
                  <div className="p-1 bg-blue-100 rounded-full">
                    <CheckCircle size={18} className="text-blue-600" />
                  </div>
                  Hasta 100 productos
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <div className="p-1 bg-blue-100 rounded-full">
                    <CheckCircle size={18} className="text-blue-600" />
                  </div>
                  1 usuario
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <div className="p-1 bg-blue-100 rounded-full">
                    <CheckCircle size={18} className="text-blue-600" />
                  </div>
                  Reportes básicos
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <div className="p-1 bg-blue-100 rounded-full">
                    <CheckCircle size={18} className="text-blue-600" />
                  </div>
                  Soporte por email
                </li>
              </ul>
              <button
                onClick={onShowRegister}
                className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all"
              >
                Comenzar
              </button>
            </div>

            {/* Plan Pro - POPULAR */}
            <div className="p-8 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-400 rounded-2xl shadow-xl transform md:scale-105 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-linear-to-r from-amber-400 to-yellow-400 text-amber-900 rounded-full shadow-lg">
                <span className="flex items-center gap-1">
                  <Star size={14} fill="currentColor" />
                  Popular
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-slate-900 mb-2">Profesional</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-slate-900">$79</span>
                  <span className="text-slate-600">/mes</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-700">
                  <div className="p-1 bg-amber-200 rounded-full">
                    <CheckCircle size={18} className="text-amber-700" />
                  </div>
                  Productos ilimitados
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <div className="p-1 bg-amber-200 rounded-full">
                    <CheckCircle size={18} className="text-amber-700" />
                  </div>
                  5 usuarios
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <div className="p-1 bg-amber-200 rounded-full">
                    <CheckCircle size={18} className="text-amber-700" />
                  </div>
                  Reportes avanzados
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <div className="p-1 bg-amber-200 rounded-full">
                    <CheckCircle size={18} className="text-amber-700" />
                  </div>
                  Soporte prioritario
                </li>
              </ul>
              <button
                onClick={onShowRegister}
                className="w-full px-6 py-3 bg-linear-to-r from-amber-400 to-yellow-400 text-amber-900 rounded-xl hover:from-amber-500 hover:to-yellow-500 transition-all shadow-lg"
              >
                Comenzar
              </button>
            </div>

            {/* Plan Enterprise */}
            <div className="p-8 bg-white border-2 border-slate-200 rounded-2xl hover:shadow-lg hover:border-blue-200 transition-all">
              <div className="mb-6">
                <h3 className="text-slate-900 mb-2">Enterprise</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-slate-900">$199</span>
                  <span className="text-slate-500">/mes</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-600">
                  <div className="p-1 bg-blue-100 rounded-full">
                    <CheckCircle size={18} className="text-blue-600" />
                  </div>
                  Todo ilimitado
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <div className="p-1 bg-blue-100 rounded-full">
                    <CheckCircle size={18} className="text-blue-600" />
                  </div>
                  Usuarios ilimitados
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <div className="p-1 bg-blue-100 rounded-full">
                    <CheckCircle size={18} className="text-blue-600" />
                  </div>
                  API personalizada
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <div className="p-1 bg-blue-100 rounded-full">
                    <CheckCircle size={18} className="text-blue-600" />
                  </div>
                  Soporte 24/7
                </li>
              </ul>
              <button
                onClick={onShowRegister}
                className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all"
              >
                Contactar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-white mb-6">
            ¿Listo para optimizar tu inventario?
          </h2>
          <p className="text-blue-100 text-xl mb-8">
            Únete a más de 500 empresas que ya confían en InventoryPro
          </p>
          <button
            onClick={onShowRegister}
            className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-slate-50 transition-all shadow-xl text-lg flex items-center gap-2 mx-auto"
          >
            Comenzar Gratis Ahora
            <ArrowRight size={24} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-600 rounded-xl">
                  <Package size={24} className="text-white" />
                </div>
                <span className="text-white">InventoryPro</span>
              </div>
              <p className="text-slate-400">
                Sistema de gestión inteligente de inventario para empresas modernas.
              </p>
            </div>
            <div>
              <h4 className="text-white mb-4">Producto</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">Empresa</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Seguridad</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-slate-400">
            <p>© 2025 InventoryPro. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}