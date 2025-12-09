import { useState, useEffect } from 'react';
import type { Product, User, Movement, Supplier, Warehouse } from './types/index';
import { initializeUsers, login, logout, getCurrentUser, getAllUsers, saveUsers, isAdmin } from './utils/auth';
import { getProducts, saveProducts, getMovements, addMovement, getSuppliers, saveSuppliers, initializeSuppliers, getWarehouses, saveWarehouses, initializeWarehouses } from './utils/storage';
import { getAuditLogs, addAuditLog } from './utils/auditLog';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ProductsView } from './components/ProductsView';
import { MovementsView } from './components/MovementsView';
import { AlertsView } from './components/AlertsView';
import { ReportsView } from './components/ReportsView';
import { UsersView } from './components/UsersView';
import { SuppliersView } from './components/SuppliersView';
import { WarehousesView } from './components/WarehousesView';
import { AuditView } from './components/AuditView';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // Inicializar datos
  useEffect(() => {
    initializeUsers();
    initializeSuppliers();
    initializeWarehouses();
    
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setShowLanding(false);
    }

    // Cargar productos iniciales si no existen
    const storedProducts = getProducts();
    if (storedProducts.length === 0) {
      const initialProducts: Product[] = [
        {
          id: '1',
          name: 'Laptop HP Pavilion 15',
          description: 'Laptop de alto rendimiento con procesador Intel Core i7, 16GB RAM, 512GB SSD',
          code: 'PRD-LP001',
          category: 'Electrónica',
          stock: 15,
          price: 899.99,
          minStock: 5,
          maxStock: 50,
          supplier: 'HP Direct',
          supplierId: '1',
          image: 'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
          active: true,
          createdAt: new Date().toISOString(),
          warehouse: '1',
        },
        {
          id: '2',
          name: 'Auriculares Sony WH-1000XM4',
          description: 'Auriculares inalámbricos con cancelación de ruido premium',
          code: 'PRD-AU002',
          category: 'Electrónica',
          stock: 3,
          price: 349.99,
          minStock: 10,
          maxStock: 40,
          supplier: 'Sony Electronics',
          supplierId: '2',
          image: 'https://images.unsplash.com/photo-1572119244337-bcb4aae995af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
          active: true,
          createdAt: new Date().toISOString(),
          warehouse: '1',
        },
        {
          id: '3',
          name: 'Zapatillas Nike Air Max',
          description: 'Zapatillas deportivas con tecnología Air Max para máximo confort',
          code: 'PRD-ZP003',
          category: 'Deportes',
          stock: 25,
          price: 129.99,
          minStock: 8,
          maxStock: 60,
          supplier: 'Nike Store',
          supplierId: '3',
          image: 'https://images.unsplash.com/photo-1597892657493-6847b9640bac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
          active: true,
          createdAt: new Date().toISOString(),
          warehouse: '2',
        },
        {
          id: '4',
          name: 'Café Premium Orgánico',
          description: 'Café de origen colombiano, tostado artesanal, 500g',
          code: 'PRD-CF004',
          category: 'Alimentos',
          stock: 2,
          price: 24.99,
          minStock: 15,
          maxStock: 100,
          supplier: 'Café Especial S.A.',
          image: 'https://images.unsplash.com/photo-1675306408031-a9aad9f23308?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
          active: true,
          createdAt: new Date().toISOString(),
          warehouse: '2',
        },
        {
          id: '5',
          name: 'Silla Ergonómica Ejecutiva',
          description: 'Silla de oficina con soporte lumbar ajustable y reposabrazos',
          code: 'PRD-SI005',
          category: 'Hogar',
          stock: 12,
          price: 299.99,
          minStock: 5,
          maxStock: 30,
          supplier: 'Muebles Office',
          image: 'https://images.unsplash.com/photo-1587258459922-4521d3704511?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
          active: true,
          createdAt: new Date().toISOString(),
          warehouse: '3',
        },
        {
          id: '6',
          name: 'Colección de Libros Clásicos',
          description: 'Set de 5 libros clásicos de literatura universal en tapa dura',
          code: 'PRD-LB006',
          category: 'Libros',
          stock: 45,
          price: 89.99,
          minStock: 10,
          maxStock: 80,
          supplier: 'Editorial Clásicos',
          image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
          active: true,
          createdAt: new Date().toISOString(),
          warehouse: '3',
        },
      ];
      saveProducts(initialProducts);
      setProducts(initialProducts);
    } else {
      setProducts(storedProducts);
    }

    setMovements(getMovements());
    setUsers(getAllUsers());
    setSuppliers(getSuppliers());
    setWarehouses(getWarehouses());
    setAuditLogs(getAuditLogs());
  }, []);

  const handleLogin = (email: string, password: string) => {
    const user = login(email, password);
    if (user) {
      setCurrentUser(user);
      setLoginError(null);
      addAuditLog(user.id, user.name, 'Inició sesión', 'Sistema', user.id, `Usuario ${user.name} inició sesión en el sistema`);
      setAuditLogs(getAuditLogs());
      setShowLanding(false);
      setShowRegister(false);
    } else {
      setLoginError('Credenciales incorrectas o usuario inactivo');
    }
  };

  const handleRegister = (name: string, email: string, password: string) => {
    // Verificar si el email ya existe
    const existingUsers = getAllUsers();
    if (existingUsers.some(u => u.email === email)) {
      setRegisterError('Este correo electrónico ya está registrado');
      return;
    }

    // Crear nuevo usuario como empleado por defecto
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role: 'empleado', // Por defecto todos son empleados
      active: true,
      createdAt: new Date().toISOString(),
    };

    const updated = [...users, newUser];
    setUsers(updated);
    saveUsers(updated);

    // Auto login después del registro
    setCurrentUser(newUser);
    setRegisterError(null);
    setShowRegister(false);
    setShowLanding(false);

    addAuditLog(newUser.id, newUser.name, 'Se registró', 'Sistema', newUser.id, `Usuario ${newUser.name} creó una cuenta nueva`);
    setAuditLogs(getAuditLogs());
  };

  const handleLogout = () => {
    if (currentUser) {
      addAuditLog(currentUser.id, currentUser.name, 'Cerró sesión', 'Sistema', currentUser.id, `Usuario ${currentUser.name} cerró sesión`);
    }
    logout();
    setCurrentUser(null);
    setCurrentView('dashboard');
    setShowLanding(true);
    setShowRegister(false);
  };

  // Product handlers
  const handleSaveProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...products, newProduct];
    setProducts(updated);
    saveProducts(updated);
    
    if (currentUser) {
      addAuditLog(currentUser.id, currentUser.name, 'Creó producto', 'Producto', newProduct.id, `Producto "${newProduct.name}" creado con código ${newProduct.code}`);
      setAuditLogs(getAuditLogs());
    }
  };

  const handleUpdateProduct = (id: string, productData: Partial<Product>) => {
    const product = products.find(p => p.id === id);
    const updated = products.map(p => p.id === id ? { ...p, ...productData } : p);
    setProducts(updated);
    saveProducts(updated);
    
    if (currentUser && product) {
      addAuditLog(currentUser.id, currentUser.name, 'Actualizó producto', 'Producto', id, `Producto "${product.name}" fue actualizado`);
      setAuditLogs(getAuditLogs());
    }
  };

  const handleDeleteProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    saveProducts(updated);
    
    if (currentUser && product) {
      addAuditLog(currentUser.id, currentUser.name, 'Eliminó producto', 'Producto', id, `Producto "${product.name}" fue eliminado del sistema`);
      setAuditLogs(getAuditLogs());
    }
  };

  // Movement handlers
  const handleAddMovement = (movementData: Omit<Movement, 'id'>) => {
    const newMovement = addMovement(movementData);
    setMovements([newMovement, ...movements]);

    // Actualizar stock del producto
    const product = products.find(p => p.id === movementData.productId);
    if (product) {
      const newStock = movementData.type === 'entrada'
        ? product.stock + movementData.quantity
        : product.stock - movementData.quantity;
      
      handleUpdateProduct(product.id, { stock: newStock });
      
      if (currentUser) {
        addAuditLog(currentUser.id, currentUser.name, `Registró ${movementData.type}`, 'Movimiento', newMovement.id, `${movementData.type.charAt(0).toUpperCase() + movementData.type.slice(1)} de ${movementData.quantity} unidades del producto "${product.name}"`);
        setAuditLogs(getAuditLogs());
      }
    }
  };

  // User handlers
  const handleSaveUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...users, newUser];
    setUsers(updated);
    saveUsers(updated);
    
    if (currentUser) {
      addAuditLog(currentUser.id, currentUser.name, 'Creó usuario', 'Usuario', newUser.id, `Usuario "${newUser.name}" creado con rol ${newUser.role}`);
      setAuditLogs(getAuditLogs());
    }
  };

  const handleUpdateUser = (id: string, userData: Partial<User>) => {
    const user = users.find(u => u.id === id);
    const updated = users.map(u => u.id === id ? { ...u, ...userData } : u);
    setUsers(updated);
    saveUsers(updated);
    
    if (currentUser && user) {
      addAuditLog(currentUser.id, currentUser.name, 'Actualizó usuario', 'Usuario', id, `Usuario "${user.name}" fue actualizado`);
      setAuditLogs(getAuditLogs());
    }
  };

  const handleDeleteUser = (id: string) => {
    handleUpdateUser(id, { active: false });
  };

  // Supplier handlers
  const handleSaveSupplier = (supplierData: Omit<Supplier, 'id' | 'createdAt'>) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...suppliers, newSupplier];
    setSuppliers(updated);
    saveSuppliers(updated);
    
    if (currentUser) {
      addAuditLog(currentUser.id, currentUser.name, 'Creó proveedor', 'Proveedor', newSupplier.id, `Proveedor "${newSupplier.name}" registrado con NIT ${newSupplier.nit}`);
      setAuditLogs(getAuditLogs());
    }
  };

  const handleUpdateSupplier = (id: string, supplierData: Partial<Supplier>) => {
    const supplier = suppliers.find(s => s.id === id);
    const updated = suppliers.map(s => s.id === id ? { ...s, ...supplierData } : s);
    setSuppliers(updated);
    saveSuppliers(updated);
    
    if (currentUser && supplier) {
      addAuditLog(currentUser.id, currentUser.name, 'Actualizó proveedor', 'Proveedor', id, `Proveedor "${supplier.name}" fue actualizado`);
      setAuditLogs(getAuditLogs());
    }
  };

  const handleDeleteSupplier = (id: string) => {
    const supplier = suppliers.find(s => s.id === id);
    const updated = suppliers.filter(s => s.id !== id);
    setSuppliers(updated);
    saveSuppliers(updated);
    
    if (currentUser && supplier) {
      addAuditLog(currentUser.id, currentUser.name, 'Eliminó proveedor', 'Proveedor', id, `Proveedor "${supplier.name}" fue eliminado`);
      setAuditLogs(getAuditLogs());
    }
  };

  // Warehouse handlers
  const handleSaveWarehouse = (warehouseData: Omit<Warehouse, 'id'>) => {
    const newWarehouse: Warehouse = {
      ...warehouseData,
      id: Date.now().toString(),
    };
    const updated = [...warehouses, newWarehouse];
    setWarehouses(updated);
    saveWarehouses(updated);
    
    if (currentUser) {
      addAuditLog(currentUser.id, currentUser.name, 'Creó almacén', 'Almacén', newWarehouse.id, `Almacén "${newWarehouse.name}" creado en ${newWarehouse.location}`);
      setAuditLogs(getAuditLogs());
    }
  };

  const handleUpdateWarehouse = (id: string, warehouseData: Partial<Warehouse>) => {
    const warehouse = warehouses.find(w => w.id === id);
    const updated = warehouses.map(w => w.id === id ? { ...w, ...warehouseData } : w);
    setWarehouses(updated);
    saveWarehouses(updated);
    
    if (currentUser && warehouse) {
      addAuditLog(currentUser.id, currentUser.name, 'Actualizó almacén', 'Almacén', id, `Almacén "${warehouse.name}" fue actualizado`);
      setAuditLogs(getAuditLogs());
    }
  };

  const handleDeleteWarehouse = (id: string) => {
    const warehouse = warehouses.find(w => w.id === id);
    const updated = warehouses.filter(w => w.id !== id);
    setWarehouses(updated);
    saveWarehouses(updated);
    
    if (currentUser && warehouse) {
      addAuditLog(currentUser.id, currentUser.name, 'Eliminó almacén', 'Almacén', id, `Almacén "${warehouse.name}" fue eliminado`);
      setAuditLogs(getAuditLogs());
    }
  };

  if (showLanding) {
    return <LandingPage onShowLogin={() => setShowLanding(false)} onShowRegister={() => setShowRegister(true)} />;
  }

  if (showRegister) {
    return <Register onRegister={handleRegister} onBackToLogin={() => { setShowRegister(false); setShowLanding(false); }} error={registerError} />;
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} onShowRegister={() => setShowRegister(true)} error={loginError} />;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        user={currentUser}
        onLogout={handleLogout}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {currentView === 'dashboard' && (
            <Dashboard products={products} movements={movements} />
          )}

          {currentView === 'products' && (
            <ProductsView
              products={products}
              onSave={handleSaveProduct}
              onUpdate={handleUpdateProduct}
              onDelete={handleDeleteProduct}
              user={currentUser}
            />
          )}

          {currentView === 'movements' && (
            <MovementsView
              products={products}
              movements={movements}
              onAddMovement={handleAddMovement}
              user={currentUser}
            />
          )}

          {currentView === 'alerts' && (
            <AlertsView products={products} />
          )}

          {currentView === 'reports' && (
            <ReportsView products={products} movements={movements} />
          )}

          {currentView === 'suppliers' && isAdmin(currentUser) && (
            <SuppliersView
              suppliers={suppliers}
              products={products}
              onSave={handleSaveSupplier}
              onUpdate={handleUpdateSupplier}
              onDelete={handleDeleteSupplier}
            />
          )}

          {currentView === 'warehouses' && isAdmin(currentUser) && (
            <WarehousesView
              warehouses={warehouses}
              products={products}
              onSave={handleSaveWarehouse}
              onUpdate={handleUpdateWarehouse}
              onDelete={handleDeleteWarehouse}
            />
          )}

          {currentView === 'users' && isAdmin(currentUser) && (
            <UsersView
              users={users}
              onSave={handleSaveUser}
              onUpdate={handleUpdateUser}
              onDelete={handleDeleteUser}
              currentUser={currentUser}
            />
          )}

          {currentView === 'audit' && isAdmin(currentUser) && (
            <AuditView logs={auditLogs} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;