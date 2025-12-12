# 📦 Proyecto Inventory - Arquitectura MVC con React + Express + Supabase

## 🏗️ Estructura del Proyecto

```
Inventory/
├── backend/                    # Backend Node.js + Express (MVC)
│   ├── config/                 # Configuración
│   │   └── supabaseClient.js   # Cliente Supabase (Service Role)
│   ├── models/                 # Modelos (lógica de datos)
│   │   └── Product.js          # Modelo de Producto
│   ├── controllers/            # Controladores (lógica de negocio)
│   │   └── productController.js
│   ├── routes/                 # Rutas Express
│   │   └── productRoutes.js
│   ├── server.js               # Servidor principal
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Frontend React + Vite + TypeScript
│   ├── src/
│   │   ├── components/         # Componentes React (Vistas)
│   │   │   ├── ProductsApiView.tsx  # Vista de productos con API
│   │   │   └── ...             # Otros componentes existentes
│   │   ├── services/           # Servicios para consumir API
│   │   │   └── productService.ts
│   │   ├── utils/              # Utilidades
│   │   │   └── supabaseClient.ts    # Cliente Supabase (Frontend)
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── bd/                         # Scripts de base de datos
├── .env                        # Variables de entorno
├── .env.example                # Plantilla de variables
└── README.md                   # Este archivo
```

## 🚀 Inicio Rápido

### 1️⃣ Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (ya está creado con tus credenciales):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://bnznireqkcwteeqpocmh.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_mx37g_eCm1Id_Jfyajaxhg_s2PH0lLM
SUPABASE_SERVICE_ROLE_KEY=sb_secret_WhsLAjMgQ6kvUWjGs1O8ZQ__bn5KcFJ
DATABASE_URL=postgresql://postgres:123456@db.bnznireqkcwteeqpocmh.supabase.co:5432/postgres

# API
API_PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 2️⃣ Instalar Dependencias

```bash
# Raíz (para scripts concurrentes)
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3️⃣ Crear la Tabla en Supabase

Ejecuta este SQL en tu panel de Supabase (ver archivo completo en `bd/schema.sql`):

```sql
-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  codigo VARCHAR(100),
  categoria VARCHAR(100),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_productos_active ON productos(active);
CREATE INDEX idx_productos_codigo ON productos(codigo);
```

### 4️⃣ Ejecutar el Proyecto

#### Opción A: Ejecutar Backend y Frontend por Separado

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
El backend estará en: `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
El frontend estará en: `http://localhost:5173`

#### Opción B: Ejecutar Ambos Juntos (Recomendado)

Desde la raíz del proyecto:
```bash
npm run dev
```

## 📡 API Endpoints

### Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos` | Obtener todos los productos |
| GET | `/api/productos/:id` | Obtener un producto por ID |
| POST | `/api/productos` | Crear un nuevo producto |
| PUT | `/api/productos/:id` | Actualizar un producto |
| DELETE | `/api/productos/:id` | Eliminar un producto (soft delete) |

### Ejemplo de Petición

**Crear un producto:**
```bash
curl -X POST http://localhost:3001/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Laptop HP",
    "descripcion": "Laptop HP 15.6 pulgadas",
    "precio": 899.99,
    "stock": 10,
    "codigo": "LAP-001",
    "categoria": "Electrónica"
  }'
```

## 🎯 Arquitectura MVC

### Modelo (Model)
- **Ubicación:** `backend/models/`
- **Responsabilidad:** Interactúa directamente con Supabase
- **Ejemplo:** `Product.js` - Define métodos para CRUD de productos

### Vista (View)
- **Ubicación:** `frontend/src/components/`
- **Responsabilidad:** Interfaz de usuario en React
- **Ejemplo:** `ProductsApiView.tsx` - Muestra y gestiona productos

### Controlador (Controller)
- **Ubicación:** `backend/controllers/`
- **Responsabilidad:** Lógica de negocio, validaciones, coordina Modelo y Vista
- **Ejemplo:** `productController.js` - Procesa peticiones HTTP

### Rutas (Routes)
- **Ubicación:** `backend/routes/`
- **Responsabilidad:** Define endpoints y los conecta con controladores
- **Ejemplo:** `productRoutes.js` - Rutas de `/api/productos`

## 🔧 Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **Supabase** - Base de datos PostgreSQL como servicio
- **TypeScript** - Tipado estático (opcional)
- **dotenv** - Manejo de variables de entorno

### Frontend
- **React 19** - Librería UI
- **Vite** - Build tool y dev server
- **TypeScript** - Tipado estático
- **Axios** - Cliente HTTP
- **Radix UI** - Componentes accesibles
- **Tailwind CSS** - Estilos (vía componentes UI)

## 📝 Notas Importantes

### Seguridad
- ⚠️ **NUNCA** subas el archivo `.env` a Git
- ✅ La clave `SERVICE_ROLE_KEY` solo debe usarse en el backend
- ✅ La clave `PUBLISHABLE_KEY` es segura para el frontend

### Desarrollo
- El backend usa **nodemon** para recargar automáticamente
- El frontend usa **HMR** (Hot Module Replacement) de Vite
- Los puertos por defecto: Backend `3001`, Frontend `5173`

## 🧪 Testing

Para probar que todo funciona:

1. Levanta el backend: `cd backend && npm run dev`
2. Levanta el frontend: `cd frontend && npm run dev`
3. Abre `http://localhost:5173`
4. Navega al componente `ProductsApiView`
5. Crea un producto de prueba

## 📚 Próximos Pasos

- [ ] Añadir autenticación con Supabase Auth
- [ ] Implementar middleware de validación
- [ ] Crear más modelos (Users, Movements, etc.)
- [ ] Añadir testing con Jest/Vitest
- [ ] Configurar Docker para desarrollo
- [ ] Añadir logging con Winston
- [ ] Implementar paginación en los endpoints

## 🤝 Contribuir

Este proyecto usa una arquitectura limpia y modular. Al añadir nuevas funcionalidades:

1. Crea el **Modelo** en `backend/models/`
2. Crea el **Controlador** en `backend/controllers/`
3. Define las **Rutas** en `backend/routes/`
4. Crea el **Servicio** en `frontend/src/services/`
5. Crea la **Vista** en `frontend/src/components/`

## 📄 Licencia

Este proyecto es privado y de uso interno.

---

**¿Necesitas ayuda?** Revisa la documentación de:
- [Express](https://expressjs.com/)
- [Supabase](https://supabase.com/docs)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
