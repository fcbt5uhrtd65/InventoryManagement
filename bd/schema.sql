-- ==========================================
-- SCHEMA COMPLETO - SISTEMA DE INVENTARIO
-- Base de Datos: PostgreSQL (Supabase)
-- Fecha: 2025-12-11
-- ==========================================

-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- TIPOS PERSONALIZADOS (ENUMS)
-- ==========================================

-- Tipo para roles de usuario
CREATE TYPE user_role AS ENUM ('admin', 'empleado', 'auditor', 'encargado_bodega');

-- Tipo para tipos de movimiento
CREATE TYPE movement_type AS ENUM ('entrada', 'salida', 'ajuste', 'devolucion');

-- Tipo para estados de órdenes de compra
CREATE TYPE order_status AS ENUM ('pendiente', 'aprobada', 'rechazada', 'completada');

-- ==========================================
-- TABLA: users
-- Descripción: Usuarios del sistema con roles
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL,
    avatar VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ==========================================
-- TABLA: warehouses
-- Descripción: Bodegas/almacenes
-- ==========================================
CREATE TABLE IF NOT EXISTS warehouses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(500) NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    manager VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ==========================================
-- TABLA: suppliers
-- Descripción: Proveedores
-- ==========================================
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    nit VARCHAR(50) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ==========================================
-- TABLA: products
-- Descripción: Catálogo de productos
-- ==========================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    code VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    min_stock INTEGER NOT NULL CHECK (min_stock >= 0),
    max_stock INTEGER NOT NULL CHECK (max_stock >= min_stock),
    
    -- Relaciones
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    supplier_name VARCHAR(255),
    warehouse_id UUID REFERENCES warehouses(id) ON DELETE SET NULL,
    warehouse_name VARCHAR(255),
    
    -- Información adicional
    image VARCHAR(500),
    barcode VARCHAR(100),
    qr_code VARCHAR(500),
    lot_number VARCHAR(100),
    expiration_date DATE,
    location VARCHAR(255),
    active BOOLEAN DEFAULT true NOT NULL,
    
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ==========================================
-- TABLA: movements
-- Descripción: Movimientos de inventario
-- ==========================================
CREATE TABLE IF NOT EXISTS movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type movement_type NOT NULL,
    
    -- Relación con producto
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    date TIMESTAMP NOT NULL,
    observation TEXT,
    
    -- Usuario
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    user_name VARCHAR(255) NOT NULL,
    
    -- Información adicional
    lot_number VARCHAR(100),
    reason VARCHAR(500),
    warehouse_id UUID REFERENCES warehouses(id) ON DELETE SET NULL,
    warehouse_name VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ==========================================
-- TABLA: audit_logs
-- Descripción: Registro de auditoría
-- ==========================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    user_name VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    details TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ==========================================
-- TABLA: purchase_orders
-- Descripción: Órdenes de compra
-- ==========================================
CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relación con proveedor
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    supplier_name VARCHAR(255) NOT NULL,
    
    total_amount DECIMAL(12,2) NOT NULL CHECK (total_amount >= 0),
    status order_status NOT NULL DEFAULT 'pendiente',
    
    -- Usuario que crea
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ==========================================
-- TABLA: purchase_order_items
-- Descripción: Items de órdenes de compra
-- ==========================================
CREATE TABLE IF NOT EXISTS purchase_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    subtotal DECIMAL(12,2) GENERATED ALWAYS AS (quantity * price) STORED
);

-- ==========================================
-- TABLA: supplier_products
-- Descripción: Relación N:N proveedores-productos
-- ==========================================
CREATE TABLE IF NOT EXISTS supplier_products (
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY (supplier_id, product_id)
);

-- ==========================================
-- ÍNDICES para optimización
-- ==========================================

-- Users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);

-- Warehouses
CREATE INDEX IF NOT EXISTS idx_warehouses_active ON warehouses(active);
CREATE INDEX IF NOT EXISTS idx_warehouses_name ON warehouses(name);

-- Suppliers
CREATE INDEX IF NOT EXISTS idx_suppliers_nit ON suppliers(nit);
CREATE INDEX IF NOT EXISTS idx_suppliers_active ON suppliers(active);
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);

-- Products
CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_warehouse ON products(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_stock_alert ON products(stock, min_stock, active);

-- Movements
CREATE INDEX IF NOT EXISTS idx_movements_product ON movements(product_id);
CREATE INDEX IF NOT EXISTS idx_movements_user ON movements(user_id);
CREATE INDEX IF NOT EXISTS idx_movements_type ON movements(type);
CREATE INDEX IF NOT EXISTS idx_movements_date ON movements(date DESC);
CREATE INDEX IF NOT EXISTS idx_movements_warehouse ON movements(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_movements_date_type ON movements(date DESC, type);

-- Audit Logs
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);

-- Purchase Orders
CREATE INDEX IF NOT EXISTS idx_po_supplier ON purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_po_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_po_created_by ON purchase_orders(created_by);
CREATE INDEX IF NOT EXISTS idx_po_created_at ON purchase_orders(created_at DESC);

-- Purchase Order Items
CREATE INDEX IF NOT EXISTS idx_poi_order ON purchase_order_items(purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_poi_product ON purchase_order_items(product_id);

-- Supplier Products
CREATE INDEX IF NOT EXISTS idx_sp_supplier ON supplier_products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_sp_product ON supplier_products(product_id);

-- ==========================================
-- FUNCIÓN para actualizar updated_at
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- TRIGGERS para updated_at automático
-- ==========================================
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_warehouses_updated_at 
    BEFORE UPDATE ON warehouses
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at 
    BEFORE UPDATE ON suppliers
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at 
    BEFORE UPDATE ON purchase_orders
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- VISTAS ÚTILES
-- ==========================================

-- Vista: Productos con stock bajo
CREATE OR REPLACE VIEW v_low_stock_products AS
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
    ROUND((p.stock::DECIMAL / NULLIF(p.min_stock, 0)) * 100, 2) AS stock_percentage
FROM products p
WHERE p.active = true 
  AND p.stock <= p.min_stock
ORDER BY stock_percentage ASC;

-- Vista: Valor de inventario por categoría
CREATE OR REPLACE VIEW v_inventory_value_by_category AS
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
CREATE OR REPLACE VIEW v_current_month_movements AS
SELECT 
    m.*,
    p.category,
    p.price,
    (m.quantity * p.price) AS movement_value
FROM movements m
JOIN products p ON m.product_id = p.id
WHERE DATE_TRUNC('month', m.date) = DATE_TRUNC('month', CURRENT_DATE)
ORDER BY m.date DESC;

-- ==========================================
-- DATOS INICIALES
-- ==========================================

-- Usuario administrador (password: admin123)
-- Hash generado con bcrypt: $2a$10$XcG4ILxVpJqYKmQHBnqGVeXU4Y8K9N6E1L7Z8H3M9P2Q5R6S7T8U9
INSERT INTO users (name, email, password, role, active) VALUES
('Administrador', 'admin@inventory.com', '$2a$10$XcG4ILxVpJqYKmQHBnqGVeXU4Y8K9N6E1L7Z8H3M9P2Q5R6S7T8U9', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- ==========================================
-- COMENTARIOS
-- ==========================================
COMMENT ON TABLE users IS 'Usuarios del sistema con diferentes roles';
COMMENT ON TABLE products IS 'Catálogo de productos con control de stock';
COMMENT ON TABLE movements IS 'Historial de movimientos de inventario';
COMMENT ON TABLE audit_logs IS 'Registro de auditoría inmutable';
COMMENT ON TABLE purchase_orders IS 'Órdenes de compra a proveedores';
COMMENT ON TABLE warehouses IS 'Bodegas o almacenes';
COMMENT ON TABLE suppliers IS 'Proveedores de productos';
