import type { Product, Movement, Supplier, Warehouse } from '../types/index';

const PRODUCTS_KEY = 'sgii_products';
const MOVEMENTS_KEY = 'sgii_movements';
const SUPPLIERS_KEY = 'sgii_suppliers';
const WAREHOUSES_KEY = 'sgii_warehouses';

// Products
export const getProducts = (): Product[] => {
  return JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

// Movements
export const getMovements = (): Movement[] => {
  return JSON.parse(localStorage.getItem(MOVEMENTS_KEY) || '[]');
};

export const saveMovements = (movements: Movement[]) => {
  localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(movements));
};

export const addMovement = (movement: Omit<Movement, 'id'>) => {
  const movements = getMovements();
  const newMovement: Movement = {
    ...movement,
    id: Date.now().toString(),
  };
  movements.unshift(newMovement);
  saveMovements(movements);
  return newMovement;
};

// Suppliers
export const getSuppliers = (): Supplier[] => {
  return JSON.parse(localStorage.getItem(SUPPLIERS_KEY) || '[]');
};

export const saveSuppliers = (suppliers: Supplier[]) => {
  localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(suppliers));
};

export const initializeSuppliers = () => {
  const existing = getSuppliers();
  if (existing.length === 0) {
    const defaultSuppliers: Supplier[] = [
      {
        id: '1',
        name: 'HP Direct',
        contact: 'Carlos Mendoza',
        email: 'ventas@hpdirect.com',
        phone: '+1-800-HP-DIRECT',
        nit: '890123456-7',
        address: 'Calle 100 #15-20, Bogotá',
        products: ['1'],
        active: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Sony Electronics',
        contact: 'María García',
        email: 'contacto@sony.com',
        phone: '+57-1-234-5678',
        nit: '800987654-3',
        address: 'Av. El Dorado #68-50, Bogotá',
        products: ['2'],
        active: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Nike Store',
        contact: 'Pedro Ramírez',
        email: 'ventas@nike.com',
        phone: '+57-1-345-6789',
        nit: '900456789-1',
        address: 'Centro Comercial Andino, Bogotá',
        products: ['3'],
        active: true,
        createdAt: new Date().toISOString(),
      },
    ];
    saveSuppliers(defaultSuppliers);
  }
};

// Warehouses
export const getWarehouses = (): Warehouse[] => {
  return JSON.parse(localStorage.getItem(WAREHOUSES_KEY) || '[]');
};

export const saveWarehouses = (warehouses: Warehouse[]) => {
  localStorage.setItem(WAREHOUSES_KEY, JSON.stringify(warehouses));
};

export const initializeWarehouses = () => {
  const existing = getWarehouses();
  if (existing.length === 0) {
    const defaultWarehouses: Warehouse[] = [
      {
        id: '1',
        name: 'Bodega Principal',
        location: 'Zona Industrial Norte, Bodega A-12',
        capacity: 10000,
        manager: 'Juan Pérez',
        active: true,
      },
      {
        id: '2',
        name: 'Almacén Centro',
        location: 'Centro Comercial Plaza Mayor, Nivel -2',
        capacity: 5000,
        manager: 'Ana Rodríguez',
        active: true,
      },
      {
        id: '3',
        name: 'Bodega Sur',
        location: 'Parque Industrial Sur, Nave 7',
        capacity: 8000,
        manager: 'Luis Martínez',
        active: true,
      },
    ];
    saveWarehouses(defaultWarehouses);
  }
};
