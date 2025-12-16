-- ==========================================
-- SCRIPT COMPLETO PARA ACTUALIZAR SISTEMA
-- Ejecutar en PostgreSQL/Supabase
-- Fecha: 2025-12-16
-- ==========================================

-- 1. Agregar tabla product_warehouses (productos en múltiples almacenes)
CREATE TABLE IF NOT EXISTS product_warehouses (
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    stock_in_warehouse INTEGER NOT NULL DEFAULT 0 CHECK (stock_in_warehouse >= 0),
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    PRIMARY KEY (product_id, warehouse_id)
);

-- 2. Agregar columna warehouse_id a tabla users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS warehouse_id UUID REFERENCES warehouses(id) ON DELETE SET NULL;

-- 3. Crear índices para optimización
CREATE INDEX IF NOT EXISTS idx_pw_product ON product_warehouses(product_id);
CREATE INDEX IF NOT EXISTS idx_pw_warehouse ON product_warehouses(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_users_warehouse ON users(warehouse_id);

-- 4. Comentarios
COMMENT ON TABLE product_warehouses IS 'Relación muchos a muchos entre productos y almacenes';
COMMENT ON COLUMN product_warehouses.stock_in_warehouse IS 'Stock específico del producto en este almacén';
COMMENT ON COLUMN users.warehouse_id IS 'Almacén asignado al usuario';

-- ==========================================
-- VERIFICACIÓN
-- ==========================================
-- Verificar que las tablas se crearon correctamente:
SELECT 
    'product_warehouses' as tabla,
    COUNT(*) as registros
FROM product_warehouses
UNION ALL
SELECT 
    'users con warehouse',
    COUNT(*)
FROM users
WHERE warehouse_id IS NOT NULL;
