export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'empleado' | 'auditor' | 'encargado_bodega';
  active: boolean;
  createdAt: string;
  avatar?: string;
  warehouseId?: string;
  warehouse_id?: string;
  warehouse_name?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  code: string;
  category: string;
  subcategory?: string;
  price: number;
  stock: number;
  minStock: number;
  maxStock: number;
  supplier: string;
  supplierId?: string;
  warehouseId?: string;
  warehouseIds?: string[];
  warehouse_name?: string;
  image: string;
  active: boolean;
  createdAt: string;
  location?: string;
  warehouse?: string;
  barcode?: string;
  qrCode?: string;
  lotNumber?: string;
  expirationDate?: string;
}

export interface Movement {
  id: string;
  type: 'entrada' | 'salida' | 'ajuste' | 'devolucion';
  productId: string;
  productName: string;
  quantity: number;
  date: string;
  observation: string;
  userId: string;
  userName: string;
  lotNumber?: string;
  reason?: string;
  warehouse?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  nit: string;
  address: string;
  products: string[];
  active: boolean;
  createdAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  manager: string;
  active: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export interface StockStatus {
  level: 'critical' | 'low' | 'warning' | 'good' | 'excess';
  color: string;
  label: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  products: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pendiente' | 'aprobada' | 'rechazada' | 'completada';
  createdBy: string;
  createdAt: string;
  notes?: string;
}
