-- =====================================================
-- SISTEMA DE GESTIÓN DE INVENTARIO
-- Base de Datos: PostgreSQL / MySQL
-- Fecha: 2025-12-09
-- =====================================================

-- =====================================================
-- TABLA: users
-- Descripción: Almacena usuarios del sistema con diferentes roles
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'empleado', 'auditor', 'encargado_bodega') NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL,
    avatar VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    
    -- Índices para optimización de consultas
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_active (active)
);

-- =====================================================
-- TABLA: warehouses
-- Descripción: Almacena información de bodegas/almacenes
-- =====================================================
CREATE TABLE warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(500) NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    manager VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    
    -- Índices
    INDEX idx_warehouses_active (active),
    INDEX idx_warehouses_name (name)
);

-- =====================================================
-- TABLA: suppliers
-- Descripción: Almacena información de proveedores
-- =====================================================
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    nit VARCHAR(50) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    
    -- Índices
    INDEX idx_suppliers_nit (nit),
    INDEX idx_suppliers_active (active),
    INDEX idx_suppliers_name (name)
);

-- =====================================================
-- TABLA: products
-- Descripción: Almacena información de productos del inventario
-- =====================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    code VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    min_stock INTEGER NOT NULL CHECK (min_stock >= 0),
    max_stock INTEGER NOT NULL CHECK (max_stock >= min_stock),
    
    -- Relaciones con otras tablas
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    supplier_name VARCHAR(255), -- Desnormalizado para rendimiento
    warehouse_id UUID REFERENCES warehouses(id) ON DELETE SET NULL,
    warehouse_name VARCHAR(255), -- Desnormalizado para rendimiento
    
    -- Información adicional
    image VARCHAR(500),
    barcode VARCHAR(100),
    qr_code VARCHAR(500),
    lot_number VARCHAR(100),
    expiration_date DATE,
    location VARCHAR(255),
    active BOOLEAN DEFAULT true NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    
    -- Índices para optimización
    INDEX idx_products_code (code),
    INDEX idx_products_category (category),
    INDEX idx_products_supplier (supplier_id),
    INDEX idx_products_warehouse (warehouse_id),
    INDEX idx_products_stock (stock),
    INDEX idx_products_active (active),
    INDEX idx_products_barcode (barcode),
    INDEX idx_products_name (name),
    
    -- Índice compuesto para búsquedas de stock crítico
    INDEX idx_products_stock_alert (stock, min_stock, active)
);

-- =====================================================
-- TABLA: movements
-- Descripción: Registra todos los movimientos de inventario
-- =====================================================
CREATE TABLE movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type ENUM('entrada', 'salida', 'ajuste', 'devolucion') NOT NULL,
    
    -- Relación con producto
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL, -- Desnormalizado para histórico
    
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    date TIMESTAMP NOT NULL,
    observation TEXT,
    
    -- Usuario que realiza el movimiento
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    user_name VARCHAR(255) NOT NULL, -- Desnormalizado para histórico
    
    -- Información adicional
    lot_number VARCHAR(100),
    reason VARCHAR(500),
    warehouse_id UUID REFERENCES warehouses(id) ON DELETE SET NULL,
    warehouse_name VARCHAR(255), -- Desnormalizado
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Índices
    INDEX idx_movements_product (product_id),
    INDEX idx_movements_user (user_id),
    INDEX idx_movements_type (type),
    INDEX idx_movements_date (date DESC),
    INDEX idx_movements_warehouse (warehouse_id),
    
    -- Índice compuesto para reportes
    INDEX idx_movements_date_type (date DESC, type)
);

-- =====================================================
-- TABLA: audit_logs
-- Descripción: Registro de auditoría para trazabilidad completa
-- =====================================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    user_name VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    details TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Índices para búsquedas rápidas
    INDEX idx_audit_user (user_id),
    INDEX idx_audit_entity (entity, entity_id),
    INDEX idx_audit_timestamp (timestamp DESC),
    INDEX idx_audit_action (action)
);

-- =====================================================
-- TABLA: purchase_orders
-- Descripción: Órdenes de compra a proveedores
-- =====================================================
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relación con proveedor
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    supplier_name VARCHAR(255) NOT NULL, -- Desnormalizado
    
    total_amount DECIMAL(12,2) NOT NULL CHECK (total_amount >= 0),
    status ENUM('pendiente', 'aprobada', 'rechazada', 'completada') NOT NULL DEFAULT 'pendiente',
    
    -- Usuario que crea la orden
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    
    -- Índices
    INDEX idx_po_supplier (supplier_id),
    INDEX idx_po_status (status),
    INDEX idx_po_created_by (created_by),
    INDEX idx_po_created_at (created_at DESC)
);

-- =====================================================
-- TABLA: purchase_order_items
-- Descripción: Items/productos dentro de cada orden de compra
-- =====================================================
CREATE TABLE purchase_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    subtotal DECIMAL(12,2) GENERATED ALWAYS AS (quantity * price) STORED,
    
    -- Índices
    INDEX idx_poi_order (purchase_order_id),
    INDEX idx_poi_product (product_id)
);

-- =====================================================
-- TABLA: supplier_products
-- Descripción: Relación N:N entre proveedores y productos
-- =====================================================
CREATE TABLE supplier_products (
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    
    PRIMARY KEY (supplier_id, product_id),
    
    -- Índices
    INDEX idx_sp_supplier (supplier_id),
    INDEX idx_sp_product (product_id)
);

-- =====================================================
-- TRIGGERS PARA AUDITORÍA AUTOMÁTICA
-- =====================================================

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas con updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_warehouses_updated_at BEFORE UPDATE ON warehouses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VISTAS ÚTILES PARA REPORTES
-- =====================================================

-- Vista: Productos con stock bajo
CREATE VIEW v_low_stock_products AS
SELECT 
    p.id,
    p.name,
    p.code,
    p.category,
    p.stock,
    p.min_stock,
    p.max_stock,
    p.supplier_name,
    p.warehouse_name,
    ROUND((p.stock::DECIMAL / p.min_stock) * 100, 2) AS stock_percentage
FROM products p
WHERE p.active = true 
  AND p.stock <= p.min_stock
ORDER BY stock_percentage ASC;

-- Vista: Valor total de inventario por categoría
CREATE VIEW v_inventory_value_by_category AS
SELECT 
    category,
    COUNT(*) AS total_products,
    SUM(stock) AS total_units,
    SUM(stock * price) AS total_value
FROM products
WHERE active = true
GROUP BY category
ORDER BY total_value DESC;

-- Vista: Movimientos del mes actual
CREATE VIEW v_current_month_movements AS
SELECT 
    m.*,
    p.category,
    p.price,
    (m.quantity * p.price) AS movement_value
FROM movements m
JOIN products p ON m.product_id = p.id
WHERE DATE_TRUNC('month', m.date) = DATE_TRUNC('month', CURRENT_DATE)
ORDER BY m.date DESC;

-- =====================================================
-- DATOS INICIALES (SEEDS)
-- =====================================================

-- Usuario administrador por defecto
INSERT INTO users (name, email, password, role, active) VALUES
('Administrador', 'admin@inventory.com', '$2a$10$hash_aqui', 'admin', true);

-- Categorías comunes (se pueden agregar más según necesidad)
-- Las categorías se manejan como texto libre en products.category

-- =====================================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE users IS 'Almacena información de usuarios del sistema con diferentes niveles de acceso';
COMMENT ON TABLE products IS 'Catálogo de productos con control de stock y trazabilidad';
COMMENT ON TABLE movements IS 'Historial completo de entradas, salidas y ajustes de inventario';
COMMENT ON TABLE audit_logs IS 'Registro de auditoría inmutable para cumplimiento normativo';
COMMENT ON TABLE purchase_orders IS 'Órdenes de compra a proveedores';
COMMENT ON TABLE warehouses IS 'Bodegas o almacenes del sistema';
COMMENT ON TABLE suppliers IS 'Proveedores de productos';

-- =====================================================
-- NOTAS IMPORTANTES:
-- =====================================================
-- 1. Este schema es compatible con PostgreSQL 12+
-- 2. Para MySQL, reemplazar UUID con CHAR(36) o usar BINARY(16)
-- 3. Para MySQL, reemplazar ENUM con CHECK constraints o VARCHAR
-- 4. Ajustar gen_random_uuid() según el motor de BD
-- 5. Los índices están optimizados para las consultas más frecuentes
-- 6. Se recomienda implementar particionamiento en audit_logs y movements
--    cuando superen 1 millón de registros
-- 7. Considerar backup automático diario de audit_logs
-- 8. Implementar rotación de logs después de 90 días según política
-- =====================================================
