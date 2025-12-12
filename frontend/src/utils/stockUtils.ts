import type { Product, StockStatus } from '../types/index';

export const getStockStatus = (product: Product): StockStatus => {
  const percentage = (product.stock / product.minStock) * 100;
  const excessPercentage = (product.stock / product.maxStock) * 100;
  
  if (product.stock === 0) {
    return {
      level: 'critical',
      color: 'red',
      label: 'Sin Stock',
    };
  } else if (product.stock <= product.minStock) {
    return {
      level: 'critical',
      color: 'red',
      label: 'Stock Crítico',
    };
  } else if (percentage <= 150) {
    return {
      level: 'warning',
      color: 'amber',
      label: 'Stock Bajo',
    };
  } else if (excessPercentage > 90) {
    return {
      level: 'excess',
      color: 'purple',
      label: 'Stock Excesivo',
    };
  } else {
    return {
      level: 'good',
      color: 'emerald',
      label: 'Stock Óptimo',
    };
  }
};

export const getLowStockProducts = (products: Product[]): Product[] => {
  return products.filter(p => p.active && p.stock <= p.minStock);
};

export const getWarningStockProducts = (products: Product[]): Product[] => {
  return products.filter(p => {
    if (!p.active) return false;
    const percentage = (p.stock / p.minStock) * 100;
    return p.stock > p.minStock && percentage <= 150;
  });
};

export const getExcessStockProducts = (products: Product[]): Product[] => {
  return products.filter(p => {
    if (!p.active) return false;
    const percentage = (p.stock / p.maxStock) * 100;
    return percentage > 90;
  });
};

export const calculateTotalValue = (products: Product[]): number => {
  return products
    .filter(p => p.active)
    .reduce((sum, p) => sum + (p.stock * p.price), 0);
};

export const calculateRotationRate = (product: Product, movements: any[]): number => {
  const productMovements = movements.filter(m => m.productId === product.id && m.type === 'salida');
  const totalSold = productMovements.reduce((sum, m) => sum + m.quantity, 0);
  
  // Calcular días desde la creación del producto
  const daysSinceCreation = Math.max(1, Math.floor((Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24)));
  
  // Rotación por día
  return totalSold / daysSinceCreation;
};

export const predictRestockDate = (product: Product, movements: any[]): Date | null => {
  const rotationRate = calculateRotationRate(product, movements);
  
  if (rotationRate === 0) return null;
  
  const daysUntilEmpty = product.stock / rotationRate;
  const restockDate = new Date();
  restockDate.setDate(restockDate.getDate() + Math.floor(daysUntilEmpty));
  
  return restockDate;
};

export const suggestOptimalStock = (product: Product, movements: any[]): { min: number; max: number } => {
  const rotationRate = calculateRotationRate(product, movements);
  
  // Stock mínimo: suficiente para 7 días
  const suggestedMin = Math.ceil(rotationRate * 7);
  
  // Stock máximo: suficiente para 30 días
  const suggestedMax = Math.ceil(rotationRate * 30);
  
  return {
    min: Math.max(5, suggestedMin),
    max: Math.max(20, suggestedMax),
  };
};

export const isProductExpiringSoon = (product: Product, daysThreshold: number = 30): boolean => {
  if (!product.expirationDate) return false;
  
  const expirationDate = new Date(product.expirationDate);
  const today = new Date();
  const daysUntilExpiration = Math.floor((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return daysUntilExpiration <= daysThreshold && daysUntilExpiration >= 0;
};

export const isProductExpired = (product: Product): boolean => {
  if (!product.expirationDate) return false;
  
  const expirationDate = new Date(product.expirationDate);
  const today = new Date();
  
  return expirationDate < today;
};
