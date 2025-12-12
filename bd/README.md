# Configuración de Base de Datos

## 🚀 Instrucciones para ejecutar el schema SQL en Supabase

### Paso 1: Acceder al Editor SQL de Supabase

1. Abre tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. En el menú lateral izquierdo, haz clic en **"SQL Editor"**
3. Haz clic en **"New Query"** para crear una nueva consulta

### Paso 2: Ejecutar el Schema

1. Abre el archivo `bd/schema.sql`
2. **Copia todo el contenido** del archivo
3. **Pega** el contenido en el editor SQL de Supabase
4. Haz clic en **"RUN"** (botón verde en la esquina inferior derecha)

### Paso 3: Verificar la Instalación

Ejecuta esta consulta para verificar que todas las tablas fueron creadas:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

Deberías ver las siguientes tablas:
- ✅ auditoria
- ✅ bodegas
- ✅ movimientos
- ✅ productos
- ✅ proveedores
- ✅ usuarios

### Paso 4: Verificar Datos de Ejemplo

El schema incluye datos de ejemplo. Para verificar:

```sql
-- Ver usuarios
SELECT * FROM usuarios;

-- Ver productos
SELECT * FROM productos;

-- Ver proveedores
SELECT * FROM proveedores;

-- Ver bodegas
SELECT * FROM bodegas;
```

## 📋 Estructura de la Base de Datos

### Tabla: usuarios
- Almacena información de usuarios del sistema
- Roles: admin, empleado, auditor, encargado_bodega
- Password hasheado con bcrypt

### Tabla: productos
- Información completa de productos
- Campos obligatorios: nombre, descripcion, codigo (único), categoria, precio, stock, proveedor, imagen
- Relaciones con: proveedores, bodegas

### Tabla: movimientos
- Registro de movimientos de inventario
- Tipos: entrada, salida, ajuste, devolucion
- Actualiza automáticamente el stock de productos

### Tabla: proveedores (suppliers)
- Información de proveedores
- Campos: nombre, contacto, email, telefono, nit, direccion

### Tabla: bodegas (warehouses)
- Información de bodegas/almacenes
- Relación con usuarios (encargado)
- Campo capacidad para control de espacio

### Tabla: auditoria
- Log de todas las acciones importantes
- Registra: usuario, acción, entidad, timestamp, IP, user agent
- Solo lectura (no se puede modificar)

## 🔐 Usuario Administrador por Defecto

**Email:** admin@inventory.com  
**Password:** admin123

⚠️ **IMPORTANTE:** Cambia esta contraseña inmediatamente en producción.

## 🔧 Relaciones entre Tablas

```
usuarios
  └── bodegas (encargado_id)
  └── movimientos (usuario_id)
  └── auditoria (usuario_id)

proveedores
  └── productos (proveedor_id)

bodegas
  └── productos (bodega_id)

productos
  └── movimientos (producto_id)
```

## 📊 Vistas Útiles

### Vista de Stock Crítico
```sql
SELECT * FROM vista_stock_critico;
```
Muestra productos con stock bajo o crítico.

### Vista de Movimientos Recientes
```sql
SELECT * FROM vista_movimientos_recientes;
```
Muestra los últimos 100 movimientos de inventario.

## 🛠️ Índices Creados

El schema incluye índices optimizados para:
- Búsquedas por email (usuarios, proveedores)
- Filtrado por rol y activo (usuarios)
- Búsquedas por código y categoría (productos)
- Consultas de movimientos por fecha, tipo, producto y usuario
- Consultas de auditoría por timestamp y entidad

## 🔄 Triggers Automáticos

Se crearon triggers para actualizar automáticamente el campo `updated_at` en:
- usuarios
- productos
- proveedores
- bodegas

## ⚡ Próximos Pasos

1. ✅ Ejecutar el schema SQL
2. ✅ Verificar que todas las tablas existen
3. ✅ Probar el login con el usuario admin
4. 🔄 Configurar Row Level Security (RLS) si es necesario
5. 🔄 Ajustar permisos según roles

## 📝 Notas Importantes

- Todos los UUIDs se generan automáticamente
- Los campos `created_at` y `updated_at` se manejan automáticamente
- Los eliminados son "soft deletes" (activo = false)
- Las contraseñas deben hashearse con bcrypt en el backend (ya implementado)
