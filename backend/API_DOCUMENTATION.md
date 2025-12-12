# 📚 Documentación de API - Sistema de Inventario

Base URL: `http://localhost:3001/api`

## 🔐 Autenticación

### POST /auth/register
Registrar un nuevo usuario en el sistema.

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "rol": "empleado"
}
```

**Roles disponibles:**
- `admin` - Acceso completo
- `empleado` - Operaciones básicas
- `auditor` - Solo lectura y auditoría
- `encargado_bodega` - Gestión de bodegas

**Response 201:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": "uuid",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "empleado",
    "activo": true,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### POST /auth/login
Iniciar sesión en el sistema.

**Body:**
```json
{
  "email": "admin@inventory.com",
  "password": "admin123"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "id": "uuid",
    "nombre": "Administrador",
    "email": "admin@inventory.com",
    "rol": "admin",
    "activo": true,
    "avatar": null
  }
}
```

---

### GET /auth/user/:userId
Obtener información del usuario actual.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nombre": "Administrador",
    "email": "admin@inventory.com",
    "rol": "admin"
  }
}
```

---

### POST /auth/logout
Cerrar sesión (registra en auditoría).

**Body:**
```json
{
  "userId": "uuid",
  "userName": "Administrador"
}
```

---

## 👥 Usuarios

### GET /usuarios
Obtener todos los usuarios.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "rol": "empleado",
      "activo": true,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### GET /usuarios/:id
Obtener usuario por ID.

---

### POST /usuarios
Crear nuevo usuario (requiere permisos admin).

**Body:**
```json
{
  "nombre": "María García",
  "email": "maria@example.com",
  "password": "password123",
  "rol": "empleado",
  "avatar": "https://..."
}
```

---

### PUT /usuarios/:id
Actualizar usuario.

**Body (todos los campos opcionales):**
```json
{
  "nombre": "María García López",
  "email": "maria.garcia@example.com",
  "password": "newpassword123",
  "rol": "encargado_bodega",
  "activo": true,
  "avatar": "https://..."
}
```

---

### DELETE /usuarios/:id
Desactivar usuario (soft delete).

---

## 📦 Productos

### GET /productos
Obtener todos los productos activos.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nombre": "Laptop Dell XPS 15",
      "descripcion": "Laptop profesional...",
      "codigo": "LAP-001",
      "categoria": "Electrónica",
      "precio": 1299.99,
      "stock": 5,
      "min_stock": 2,
      "max_stock": 20,
      "proveedor": "Tech Solutions",
      "proveedor_id": "uuid",
      "imagen": "https://...",
      "activo": true
    }
  ]
}
```

---

### GET /productos/stock-bajo
Obtener productos con stock bajo o crítico.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nombre": "Producto",
      "stock": 1,
      "min_stock": 5
    }
  ]
}
```

---

### GET /productos/:id
Obtener producto por ID (incluye información del proveedor y bodega).

---

### POST /productos
Crear nuevo producto.

**Body:**
```json
{
  "nombre": "Mouse Logitech MX",
  "descripcion": "Mouse ergonómico",
  "codigo": "MOU-001",
  "categoria": "Accesorios",
  "subcategoria": "Periféricos",
  "precio": 99.99,
  "stock": 15,
  "min_stock": 5,
  "max_stock": 50,
  "proveedor": "Tech Solutions",
  "proveedor_id": "uuid-del-proveedor",
  "imagen": "https://...",
  "ubicacion": "Estante A-1",
  "bodega_id": "uuid-de-bodega",
  "codigo_barras": "1234567890",
  "numero_lote": "LOTE-2024-01",
  "fecha_expiracion": "2025-12-31"
}
```

**Campos obligatorios:**
- nombre
- descripcion
- codigo (único)
- categoria
- precio
- proveedor
- imagen

---

### PUT /productos/:id
Actualizar producto.

---

### DELETE /productos/:id
Desactivar producto (soft delete).

---

## 📊 Movimientos

### GET /movimientos
Obtener todos los movimientos de inventario.

**Query params (opcionales):**
- `tipo` - entrada, salida, ajuste, devolucion
- `productoId` - Filtrar por producto
- `usuarioId` - Filtrar por usuario
- `fechaInicio` - Fecha inicio (ISO 8601)
- `fechaFin` - Fecha fin (ISO 8601)

**Ejemplo:** `/movimientos?tipo=entrada&fechaInicio=2024-01-01`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "tipo": "entrada",
      "producto_id": "uuid",
      "producto_nombre": "Laptop Dell XPS 15",
      "cantidad": 10,
      "fecha": "2024-01-15T10:30:00Z",
      "observacion": "Pedido #1234",
      "usuario_id": "uuid",
      "usuario_nombre": "Juan Pérez"
    }
  ]
}
```

---

### GET /movimientos/:id
Obtener movimiento por ID.

---

### POST /movimientos
Crear movimiento y actualizar stock automáticamente.

**Body:**
```json
{
  "tipo": "entrada",
  "producto_id": "uuid",
  "producto_nombre": "Laptop Dell XPS 15",
  "cantidad": 10,
  "observacion": "Pedido #1234",
  "usuario_id": "uuid",
  "usuario_nombre": "Juan Pérez",
  "numero_lote": "LOTE-2024-01",
  "razon": "Compra mensual",
  "bodega": "Bodega Principal"
}
```

**Tipos de movimiento:**
- `entrada` - Suma al stock
- `salida` - Resta del stock (valida que haya suficiente)
- `ajuste` - Establece el stock exacto
- `devolucion` - Suma al stock

**Response 201:**
```json
{
  "success": true,
  "message": "Movimiento de entrada registrado exitosamente",
  "data": {
    "movimiento": { /* datos del movimiento */ },
    "nuevoStock": 25
  }
}
```

---

## 🏢 Proveedores

### GET /proveedores
Obtener todos los proveedores.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nombre": "Tech Solutions",
      "contacto": "Carlos Pérez",
      "email": "contacto@techsolutions.com",
      "telefono": "+1-555-0100",
      "nit": "123456789",
      "direccion": "Av. Principal 123",
      "activo": true
    }
  ]
}
```

---

### GET /proveedores/:id
Obtener proveedor por ID.

---

### GET /proveedores/:id/productos
Obtener todos los productos de un proveedor.

---

### POST /proveedores
Crear nuevo proveedor.

**Body:**
```json
{
  "nombre": "Office Supplies Inc",
  "contacto": "María González",
  "email": "ventas@officesupplies.com",
  "telefono": "+1-555-0200",
  "nit": "987654321",
  "direccion": "Calle Comercio 456"
}
```

---

### PUT /proveedores/:id
Actualizar proveedor.

---

### DELETE /proveedores/:id
Desactivar proveedor (soft delete).

---

## 🏭 Bodegas

### GET /bodegas
Obtener todas las bodegas (incluye información del encargado).

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nombre": "Bodega Principal",
      "ubicacion": "Planta Baja - Sector A",
      "capacidad": 1000,
      "encargado_id": "uuid",
      "encargado": {
        "id": "uuid",
        "nombre": "Juan Pérez",
        "email": "juan@example.com"
      },
      "activo": true
    }
  ]
}
```

---

### GET /bodegas/:id
Obtener bodega por ID.

---

### GET /bodegas/:id/productos
Obtener todos los productos en una bodega.

---

### POST /bodegas
Crear nueva bodega.

**Body:**
```json
{
  "nombre": "Bodega Secundaria",
  "ubicacion": "Primer Piso - Sector B",
  "capacidad": 500,
  "encargado_id": "uuid-del-usuario"
}
```

---

### PUT /bodegas/:id
Actualizar bodega.

---

### DELETE /bodegas/:id
Desactivar bodega (soft delete).

---

## 📋 Auditoría

### GET /auditoria
Obtener registros de auditoría.

**Query params (opcionales):**
- `usuarioId` - Filtrar por usuario
- `entidad` - usuarios, productos, movimientos, etc.
- `accion` - CREAR, ACTUALIZAR, ELIMINAR, LOGIN, LOGOUT, etc.
- `fechaInicio` - Fecha inicio
- `fechaFin` - Fecha fin
- `limit` - Número de registros (default: 100)

**Ejemplo:** `/auditoria?entidad=productos&accion=CREAR&limit=50`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "usuario_id": "uuid",
      "usuario_nombre": "Juan Pérez",
      "accion": "CREAR",
      "entidad": "productos",
      "entidad_id": "uuid",
      "detalles": "Producto Laptop Dell XPS 15 creado...",
      "ip_address": "192.168.1.100",
      "user_agent": "Mozilla/5.0...",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### GET /auditoria/:id
Obtener registro de auditoría por ID.

---

### GET /auditoria/usuario/:usuarioId
Obtener actividad reciente de un usuario.

**Query param:** `limit` (default: 50)

---

### GET /auditoria/entidad/:entidad/:entidadId
Obtener historial completo de una entidad específica.

**Ejemplo:** `/auditoria/entidad/productos/uuid-del-producto`

---

## 🚨 Códigos de Respuesta

- `200` - OK
- `201` - Created
- `400` - Bad Request (validación fallida)
- `401` - Unauthorized (credenciales inválidas)
- `403` - Forbidden (usuario desactivado)
- `404` - Not Found
- `409` - Conflict (duplicado, ej: email o código ya existe)
- `500` - Internal Server Error

## 📝 Estructura de Respuestas de Error

```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "Detalle técnico del error (solo en desarrollo)"
}
```

## 🔒 Seguridad

- ✅ Las contraseñas se hashean con bcrypt (10 rounds)
- ✅ Todas las acciones importantes se registran en auditoría
- ✅ Los eliminados son soft deletes (activo = false)
- ✅ Validación de datos en backend
- ⚠️ TODO: Implementar JWT para autenticación
- ⚠️ TODO: Implementar middleware de autorización por roles
- ⚠️ TODO: Rate limiting para prevenir ataques

## 💡 Ejemplos de Uso

### Login completo
```javascript
// 1. Login
const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@inventory.com',
    password: 'admin123'
  })
});
const { data: user } = await loginResponse.json();

// 2. Guardar usuario en localStorage
localStorage.setItem('user', JSON.stringify(user));

// 3. Crear un producto
const createResponse = await fetch('http://localhost:3001/api/productos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nombre: 'Nuevo Producto',
    descripcion: 'Descripción...',
    codigo: 'PROD-001',
    categoria: 'Electrónica',
    precio: 99.99,
    stock: 10,
    min_stock: 2,
    max_stock: 50,
    proveedor: 'Tech Solutions',
    imagen: 'https://...'
  })
});

// 4. Registrar movimiento de entrada
const movementResponse = await fetch('http://localhost:3001/api/movimientos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tipo: 'entrada',
    producto_id: 'uuid-del-producto',
    producto_nombre: 'Nuevo Producto',
    cantidad: 50,
    observacion: 'Stock inicial',
    usuario_id: user.id,
    usuario_nombre: user.nombre
  })
});
```
