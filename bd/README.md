# Documentación de Base de Datos - Sistema de Inventario

## 📋 Índice
1. [Estructura de Tablas](#estructura-de-tablas)
2. [Relaciones](#relaciones)
3. [Índices y Optimizaciones](#índices-y-optimizaciones)
4. [Instalación](#instalación)
5. [Migraciones](#migraciones)

## 🗄️ Estructura de Tablas

### **users**
Almacena usuarios del sistema con diferentes roles.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| name | VARCHAR(255) | Nombre del usuario |
| email | VARCHAR(255) | Email único |
| password | VARCHAR(255) | Contraseña hasheada |
| role | ENUM | admin, empleado, auditor, encargado_bodega |
| active | BOOLEAN | Estado del usuario |
| avatar | VARCHAR(500) | URL del avatar |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

**Roles del sistema:**
- `admin`: Acceso total
- `empleado`: Gestión de productos y movimientos
- `auditor`: Solo lectura de auditoría
- `encargado_bodega`: Gestión de bodegas

---

### **products**
Catálogo completo de productos.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| name | VARCHAR(255) | Nombre del producto |
| description | TEXT | Descripción detallada |
| code | VARCHAR(100) | Código único (SKU) |
| category | VARCHAR(100) | Categoría principal |
| subcategory | VARCHAR(100) | Subcategoría |
| price | DECIMAL(10,2) | Precio unitario |
| stock | INTEGER | Stock actual |
| min_stock | INTEGER | Stock mínimo |
| max_stock | INTEGER | Stock máximo |
| supplier_id | UUID | FK a suppliers |
| supplier_name | VARCHAR(255) | Nombre del proveedor (desnormalizado) |
| warehouse_id | UUID | FK a warehouses |
| warehouse_name | VARCHAR(255) | Nombre de bodega (desnormalizado) |
| image | VARCHAR(500) | URL de imagen |
| barcode | VARCHAR(100) | Código de barras |
| qr_code | VARCHAR(500) | Código QR |
| lot_number | VARCHAR(100) | Número de lote |
| expiration_date | DATE | Fecha de vencimiento |
| location | VARCHAR(255) | Ubicación física |
| active | BOOLEAN | Estado del producto |

**Índices principales:**
- `idx_products_code`: Búsqueda por código
- `idx_products_category`: Filtrado por categoría
- `idx_products_stock_alert`: Alertas de stock bajo

---

### **movements**
Registro de todos los movimientos de inventario.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| type | ENUM | entrada, salida, ajuste, devolucion |
| product_id | UUID | FK a products |
| product_name | VARCHAR(255) | Nombre del producto (histórico) |
| quantity | INTEGER | Cantidad movida |
| date | TIMESTAMP | Fecha del movimiento |
| observation | TEXT | Observaciones |
| user_id | UUID | Usuario que realizó el movimiento |
| user_name | VARCHAR(255) | Nombre del usuario (histórico) |
| lot_number | VARCHAR(100) | Número de lote |
| reason | VARCHAR(500) | Razón del movimiento |
| warehouse_id | UUID | Bodega origen/destino |

**Tipos de movimiento:**
- `entrada`: Ingreso de productos
- `salida`: Salida de productos
- `ajuste`: Ajuste de inventario
- `devolucion`: Devolución de productos

---

### **suppliers**
Información de proveedores.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| name | VARCHAR(255) | Nombre del proveedor |
| contact | VARCHAR(255) | Persona de contacto |
| email | VARCHAR(255) | Email |
| phone | VARCHAR(50) | Teléfono |
| nit | VARCHAR(50) | NIT único |
| address | TEXT | Dirección |
| active | BOOLEAN | Estado |

---

### **warehouses**
Bodegas o almacenes.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| name | VARCHAR(255) | Nombre de la bodega |
| location | VARCHAR(500) | Ubicación |
| capacity | INTEGER | Capacidad total |
| manager | VARCHAR(255) | Encargado |
| active | BOOLEAN | Estado |

---

### **audit_logs**
Registro de auditoría inmutable.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| user_id | UUID | Usuario que realizó la acción |
| user_name | VARCHAR(255) | Nombre del usuario |
| action | VARCHAR(255) | Acción realizada |
| entity | VARCHAR(100) | Entidad afectada |
| entity_id | UUID | ID de la entidad |
| details | TEXT | Detalles de la acción |
| timestamp | TIMESTAMP | Fecha y hora |

---

### **purchase_orders**
Órdenes de compra a proveedores.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| supplier_id | UUID | FK a suppliers |
| supplier_name | VARCHAR(255) | Nombre del proveedor |
| total_amount | DECIMAL(12,2) | Monto total |
| status | ENUM | pendiente, aprobada, rechazada, completada |
| created_by | UUID | Usuario creador |
| notes | TEXT | Notas adicionales |

---

### **purchase_order_items**
Items de cada orden de compra.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| purchase_order_id | UUID | FK a purchase_orders |
| product_id | UUID | FK a products |
| product_name | VARCHAR(255) | Nombre del producto |
| quantity | INTEGER | Cantidad |
| price | DECIMAL(10,2) | Precio unitario |
| subtotal | DECIMAL(12,2) | Calculado automáticamente |

---

## 🔗 Relaciones

```
users (1) ----< (N) movements
users (1) ----< (N) audit_logs
users (1) ----< (N) purchase_orders

suppliers (1) ----< (N) products
suppliers (1) ----< (N) purchase_orders
suppliers (N) ----< (N) products [supplier_products]

warehouses (1) ----< (N) products
warehouses (1) ----< (N) movements

products (1) ----< (N) movements
products (1) ----< (N) purchase_order_items

purchase_orders (1) ----< (N) purchase_order_items
```

---

## ⚡ Índices y Optimizaciones

### Índices Principales
- **users**: email, role, active
- **products**: code (unique), category, stock, barcode
- **movements**: product_id, date, type, user_id
- **audit_logs**: timestamp, entity, user_id
- **suppliers**: nit (unique), active

### Índices Compuestos
- `idx_products_stock_alert (stock, min_stock, active)`: Para alertas de stock
- `idx_movements_date_type (date DESC, type)`: Para reportes

### Columnas Desnormalizadas
Para mejorar el rendimiento de consultas y mantener históricos:
- `product_name` en movements
- `user_name` en movements y audit_logs
- `supplier_name` en products y purchase_orders
- `warehouse_name` en products

---

## 🚀 Instalación

### PostgreSQL

```bash
# 1. Crear base de datos
createdb inventory_db

# 2. Ejecutar schema
psql inventory_db < bd/schema.sql

# 3. Verificar tablas
psql inventory_db -c "\dt"
```

### MySQL

```sql
-- 1. Crear base de datos
CREATE DATABASE inventory_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Usar la base de datos
USE inventory_db;

-- 3. Ejecutar schema (ajustar UUIDs y ENUMs según MySQL)
SOURCE bd/schema.sql;
```

---

## 📝 Migraciones

### Crear Usuario Admin Inicial

```sql
INSERT INTO users (name, email, password, role, active) VALUES
('Admin System', 'admin@inventory.com', '$2a$10$hash_password_aqui', 'admin', true);
```

### Migrar desde LocalStorage

Para migrar los datos actuales de localStorage a la base de datos:

```typescript
// Ejemplo de script de migración
import { User, Product, Movement } from './types';

async function migrateFromLocalStorage() {
  // Obtener datos de localStorage
  const users = JSON.parse(localStorage.getItem('sgii_users') || '[]');
  const products = JSON.parse(localStorage.getItem('sgii_products') || '[]');
  const movements = JSON.parse(localStorage.getItem('sgii_movements') || '[]');
  
  // Insertar en base de datos usando ORM o queries
  // ... código de migración
}
```

---

## 🔒 Seguridad

### Recomendaciones
1. **Passwords**: Usar bcrypt con salt rounds >= 10
2. **Auditoría**: Tabla `audit_logs` es append-only (no DELETE)
3. **Backups**: Backup diario automático, especialmente de audit_logs
4. **Retention**: Mantener audit_logs por mínimo 90 días
5. **Conexiones**: Usar SSL/TLS para conexiones a BD
6. **Usuarios BD**: Crear usuarios con permisos mínimos necesarios

---

## 📊 Vistas Útiles

### Productos con Stock Bajo
```sql
SELECT * FROM v_low_stock_products;
```

### Valor de Inventario por Categoría
```sql
SELECT * FROM v_inventory_value_by_category;
```

### Movimientos del Mes
```sql
SELECT * FROM v_current_month_movements;
```

---

## 🛠️ Mantenimiento

### Limpieza de Audit Logs (después de 90 días)
```sql
DELETE FROM audit_logs 
WHERE timestamp < CURRENT_DATE - INTERVAL '90 days';
```

### Recalcular Stock (en caso de inconsistencias)
```sql
UPDATE products p
SET stock = (
    SELECT COALESCE(
        SUM(CASE 
            WHEN m.type = 'entrada' THEN m.quantity
            WHEN m.type = 'salida' THEN -m.quantity
            WHEN m.type = 'ajuste' THEN m.quantity
            ELSE 0
        END), 0
    )
    FROM movements m
    WHERE m.product_id = p.id
)
WHERE p.active = true;
```

---

## 📈 Performance

### Monitoreo de Queries Lentas (PostgreSQL)
```sql
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### Tamaño de Tablas
```sql
SELECT 
    table_name,
    pg_size_pretty(pg_total_relation_size(table_name::regclass)) AS size
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY pg_total_relation_size(table_name::regclass) DESC;
```

---

## 🔄 Changelog

### v1.0.0 (2025-12-09)
- ✅ Schema inicial completo
- ✅ 8 tablas principales
- ✅ Relaciones e índices optimizados
- ✅ Triggers para auditoría
- ✅ Vistas para reportes
- ✅ Documentación completa
