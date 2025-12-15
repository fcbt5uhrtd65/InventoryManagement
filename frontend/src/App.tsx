import { useState, useEffect } from 'react';
import type { Product, User, Movement, Supplier, Warehouse } from './types/index';
import { initializeUsers, getAllUsers, saveUsers, isAdmin } from './utils/auth';
import authService from './services/authService';
import productService from './services/productService';
import movementService from './services/movementService';
import supplierService from './services/supplierService';
import warehouseService from './services/warehouseService';
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
    
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setShowLanding(false);
      // Cargar productos y movimientos del backend
      loadProducts();
      loadMovements();
      loadSuppliers();
      loadWarehouses();
    }

    setUsers(getAllUsers());
    setWarehouses(getWarehouses());
    setAuditLogs(getAuditLogs());
  }, []);

  // Función para cargar productos desde el backend
  const loadProducts = async () => {
    try {
      const response = await productService.getAll();
      console.log('Productos response:', response);
      // productService.getAll() retorna directamente el array o { success, data }
      const productsArray = Array.isArray(response) ? response : (response.data || []);
      
      if (productsArray && productsArray.length > 0) {
        // Mapear los datos del backend (snake_case) al frontend (camelCase)
        const mappedProducts = productsArray.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          code: p.code,
          category: p.category,
          subcategory: p.subcategory,
          price: p.price,
          stock: p.stock,
          minStock: p.min_stock,
          maxStock: p.max_stock,
          supplier: p.supplier_name || '',
          supplierId: p.supplier_id || '',
          warehouseId: p.warehouse_id || '',
          image: p.image || '',
          active: p.active,
          createdAt: p.created_at,
          location: p.location,
          warehouse: p.warehouse_name || '',
          barcode: p.barcode,
          qrCode: p.qr_code,
          lotNumber: p.lot_number,
          expirationDate: p.expiration_date,
        }));
        setProducts(mappedProducts);
        console.log('Productos cargados:', mappedProducts.length);
      } else {
        console.log('No hay productos en la respuesta');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
      // Si falla, usar localStorage como fallback
      setProducts(getProducts());
    }
  };

  // Función para cargar movimientos desde el backend
  const loadMovements = async () => {
    try {
      const response = await movementService.getAll();
      console.log('Movimientos response:', response);
      if (response.success && response.data) {
        // Mapear los datos del backend (snake_case) al frontend (camelCase)
        const mappedMovements = response.data.map((m: any) => ({
          id: m.id,
          type: m.type,
          productId: m.product_id,
          productName: m.product_name,
          quantity: m.quantity,
          date: m.date,
          observation: m.observation,
          userId: m.user_id,
          userName: m.user_name,
          lotNumber: m.lot_number,
          reason: m.reason,
          warehouse: m.warehouse_name
        }));
        setMovements(mappedMovements);
        console.log('Movimientos cargados:', mappedMovements.length);
      }
    } catch (error) {
      console.error('Error al cargar movimientos:', error);
      // Si falla, usar localStorage como fallback
      setMovements(getMovements());
    }
  };

  // Función para cargar proveedores desde el backend
  const loadSuppliers = async () => {
    try {
      const response = await supplierService.getAll();
      console.log('Proveedores response:', response);
      if (response.success && response.data) {
        // Mapear los datos del backend (snake_case) al frontend (camelCase)
        const mappedSuppliers = response.data.map((s: any) => ({
          id: s.id,
          name: s.name,
          contact: s.contact,
          email: s.email,
          phone: s.phone,
          nit: s.nit,
          address: s.address,
          products: [], // La BD no tiene este campo, pero el tipo lo requiere
          active: s.active,
          createdAt: s.created_at,
        }));
        setSuppliers(mappedSuppliers);
        console.log('Proveedores cargados:', mappedSuppliers.length);
      }
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
      // Si falla, usar localStorage como fallback
      setSuppliers(getSuppliers());
    }
  };
  // Función para cargar almacenes desde el backend
  const loadWarehouses = async () => {
    try {
      const response = await warehouseService.getAll();
      console.log('Almacenes response:', response);
      // Puede venir como array directo o como { success, data }
      const warehousesArray = Array.isArray(response) ? response : (response.data || []);
      if (warehousesArray && warehousesArray.length >= 0) {
        // Mapear los datos del backend (snake_case) al frontend (camelCase)
        const mappedWarehouses = warehousesArray.map((w: any) => ({
          id: w.id,
          name: w.name,
          location: w.location,
          capacity: w.capacity,
          currentStock: w.current_stock || 0,
          active: w.active,
          createdAt: w.created_at,
        }));
        setWarehouses(mappedWarehouses);
        console.log('Almacenes cargados:', mappedWarehouses.length);
      } else {
        setWarehouses([]);
      }
    } catch (error) {
      console.error('Error al cargar almacenes:', error);
      // Si falla, usar localStorage como fallback
      setWarehouses(getWarehouses());
    }
  };
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      if (response.success && response.user) {
        setCurrentUser(response.user);
        setLoginError(null);
        addAuditLog(response.user.id, response.user.name, 'Inició sesión', 'Sistema', response.user.id, `Usuario ${response.user.name} inició sesión en el sistema`);
        setAuditLogs(getAuditLogs());
        setShowLanding(false);
        setShowRegister(false);
        // Cargar datos del backend después del login
        loadProducts();
        loadMovements();
        loadSuppliers();
        loadWarehouses();
      } else {
        setLoginError(response.message || 'Credenciales incorrectas');
      }
    } catch (error: any) {
      setLoginError(error.response?.data?.message || 'Error al conectar con el servidor');
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      const response = await authService.register(name, email, password, 'empleado');
      if (response.success && response.user) {
        setCurrentUser(response.user);
        setRegisterError(null);
        setShowRegister(false);
        setShowLanding(false);
        addAuditLog(response.user.id, response.user.name, 'Se registró', 'Sistema', response.user.id, `Usuario ${response.user.name} creó una cuenta nueva`);
        setAuditLogs(getAuditLogs());
        // Cargar datos del backend después del registro
        loadProducts();
        loadMovements();
        loadSuppliers();
        loadWarehouses();
      } else {
        setRegisterError(response.message || 'Error al registrar usuario');
      }
    } catch (error: any) {
      setRegisterError(error.response?.data?.message || 'Error al conectar con el servidor');
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      addAuditLog(currentUser.id, currentUser.name, 'Cerró sesión', 'Sistema', currentUser.id, `Usuario ${currentUser.name} cerró sesión`);
    }
    authService.logout();
    setCurrentUser(null);
    setCurrentView('dashboard');
    setShowLanding(true);
    setShowRegister(false);
  };

  // Product handlers
  const handleSaveProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      // Validar longitud de imagen
      if (productData.image && productData.image.length > 500) {
        alert('La URL de la imagen es demasiado larga (máximo 500 caracteres). Por favor, usa una URL más corta.');
        return;
      }
      
      const response = await productService.create(productData);
      if (response.success && response.data) {
        // Mapear datos del servidor (snake_case a camelCase)
        const mappedProduct = {
          id: response.data.id,
          name: response.data.name,
          description: response.data.description,
          code: response.data.code,
          category: response.data.category,
          subcategory: response.data.subcategory,
          price: response.data.price,
          stock: response.data.stock,
          minStock: response.data.min_stock,
          maxStock: response.data.max_stock,
          supplier: response.data.supplier_name || '',
          supplierId: response.data.supplier_id || '',
          warehouseId: response.data.warehouse_id || '',
          image: response.data.image || '',
          active: response.data.active,
          createdAt: response.data.created_at,
          location: response.data.location,
          warehouse: response.data.warehouse_name || '',
          barcode: response.data.barcode,
          qrCode: response.data.qr_code,
          lotNumber: response.data.lot_number,
          expirationDate: response.data.expiration_date,
        };
        setProducts([...products, mappedProduct]);
        
        if (currentUser) {
          addAuditLog(currentUser.id, currentUser.name, 'Creó producto', 'Producto', mappedProduct.id, `Producto "${mappedProduct.name}" creado con código ${mappedProduct.code}`);
          setAuditLogs(getAuditLogs());
        }
      }
    } catch (error: any) {
      console.error('Error al crear producto:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al crear el producto';
      alert(errorMessage);
    }
  };

  const handleUpdateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      // Limpiar datos antes de enviar - remover campos calculados/relacionados
      const { supplier, warehouse, createdAt, ...cleanData } = productData;
      
      // Validar longitud de imagen
      if (cleanData.image && cleanData.image.length > 500) {
        alert('La URL de la imagen es demasiado larga (máximo 500 caracteres)');
        return;
      }
      
      const response = await productService.update(id, cleanData);
      if (response.success && response.data) {
        // Mapear datos del servidor (snake_case a camelCase)
        const mappedProduct = {
          id: response.data.id,
          name: response.data.name,
          description: response.data.description,
          code: response.data.code,
          category: response.data.category,
          subcategory: response.data.subcategory,
          price: response.data.price,
          stock: response.data.stock,
          minStock: response.data.min_stock,
          maxStock: response.data.max_stock,
          supplier: response.data.supplier_name || '',
          supplierId: response.data.supplier_id || '',
          warehouseId: response.data.warehouse_id || '',
          image: response.data.image || '',
          active: response.data.active,
          createdAt: response.data.created_at,
          location: response.data.location,
          warehouse: response.data.warehouse_name || '',
          barcode: response.data.barcode,
          qrCode: response.data.qr_code,
          lotNumber: response.data.lot_number,
          expirationDate: response.data.expiration_date,
        };
        setProducts(products.map(p => p.id === id ? mappedProduct : p));
        
        if (currentUser) {
          addAuditLog(currentUser.id, currentUser.name, 'Actualizó producto', 'Producto', id, `Producto "${mappedProduct.name}" fue actualizado`);
          setAuditLogs(getAuditLogs());
        }
      }
    } catch (error: any) {
      console.error('Error al actualizar producto:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al actualizar el producto';
      alert(errorMessage);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const product = products.find(p => p.id === id);
      const response = await productService.delete(id);
      if (response.success) {
        // Actualizar estado local - filtrar el producto eliminado
        setProducts(products.filter(p => p.id !== id));
        
        if (currentUser && product) {
          addAuditLog(currentUser.id, currentUser.name, 'Eliminó producto', 'Producto', id, `Producto "${product.name}" fue eliminado del sistema`);
          setAuditLogs(getAuditLogs());
        }
      }
    } catch (error: any) {
      console.error('Error al eliminar producto:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al eliminar el producto';
      alert(errorMessage);
    }
  };

  // Movement handlers
  const handleAddMovement = async (movementData: Omit<Movement, 'id'>) => {
    try {
      const response = await movementService.create(movementData);
      if (response.success && response.data) {
        // Mapear datos del servidor (snake_case a camelCase)
        const mappedMovement = {
          id: response.data.movimiento.id,
          type: response.data.movimiento.type,
          productId: response.data.movimiento.product_id,
          productName: response.data.movimiento.product_name,
          quantity: response.data.movimiento.quantity,
          date: response.data.movimiento.date,
          observation: response.data.movimiento.observation,
          userId: response.data.movimiento.user_id,
          userName: response.data.movimiento.user_name,
          lotNumber: response.data.movimiento.lot_number,
          reason: response.data.movimiento.reason,
          warehouse: response.data.movimiento.warehouse_name
        };
        
        // Actualizar lista de movimientos
        setMovements([mappedMovement, ...movements]);
        
        // Actualizar stock del producto en el estado local
        const nuevoStock = response.data.nuevoStock;
        setProducts(products.map(p => 
          p.id === movementData.productId ? { ...p, stock: nuevoStock } : p
        ));

        if (currentUser) {
          addAuditLog(
            currentUser.id, 
            currentUser.name, 
            `Movimiento de ${movementData.type}`, 
            'Movimiento', 
            mappedMovement.id, 
            `${movementData.type} de ${movementData.quantity} unidades de ${movementData.productName}. Nuevo stock: ${nuevoStock}`
          );
          setAuditLogs(getAuditLogs());
        }
      }
    } catch (error: any) {
      console.error('Error al crear movimiento:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al crear el movimiento';
      alert(errorMessage);
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
  const handleSaveSupplier = async (supplierData: Omit<Supplier, 'id' | 'createdAt'>) => {
    try {
      const response = await supplierService.create(supplierData);
      if (response.success && response.data) {
        // Mapear datos del servidor (snake_case a camelCase)
        const mappedSupplier = {
          id: response.data.id,
          name: response.data.name,
          contact: response.data.contact,
          email: response.data.email,
          phone: response.data.phone,
          nit: response.data.nit,
          address: response.data.address,
          products: [],
          active: response.data.active,
          createdAt: response.data.created_at,
        };
        setSuppliers([...suppliers, mappedSupplier]);
        
        if (currentUser) {
          addAuditLog(currentUser.id, currentUser.name, 'Creó proveedor', 'Proveedor', mappedSupplier.id, `Proveedor "${mappedSupplier.name}" registrado con NIT ${mappedSupplier.nit}`);
          setAuditLogs(getAuditLogs());
        }
      }
    } catch (error: any) {
      console.error('Error al crear proveedor:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al crear el proveedor';
      alert(errorMessage);
    }
  };

  const handleUpdateSupplier = async (id: string, supplierData: Partial<Supplier>) => {
    try {
      const response = await supplierService.update(id, supplierData);
      if (response.success && response.data) {
        // Mapear datos del servidor (snake_case a camelCase)
        const mappedSupplier = {
          id: response.data.id,
          name: response.data.name,
          contact: response.data.contact,
          email: response.data.email,
          phone: response.data.phone,
          nit: response.data.nit,
          address: response.data.address,
          products: [],
          active: response.data.active,
          createdAt: response.data.created_at,
        };
        setSuppliers(suppliers.map(s => s.id === id ? mappedSupplier : s));
        
        if (currentUser) {
          addAuditLog(currentUser.id, currentUser.name, 'Actualizó proveedor', 'Proveedor', id, `Proveedor "${mappedSupplier.name}" fue actualizado`);
          setAuditLogs(getAuditLogs());
        }
      }
    } catch (error: any) {
      console.error('Error al actualizar proveedor:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al actualizar el proveedor';
      alert(errorMessage);
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    try {
      const supplier = suppliers.find(s => s.id === id);
      const response = await supplierService.delete(id);
      if (response.success) {
        // Eliminar del estado local
        setSuppliers(suppliers.filter(s => s.id !== id));
        
        if (currentUser && supplier) {
          addAuditLog(currentUser.id, currentUser.name, 'Eliminó proveedor', 'Proveedor', id, `Proveedor "${supplier.name}" fue eliminado`);
          setAuditLogs(getAuditLogs());
        }
      }
    } catch (error: any) {
      console.error('Error al eliminar proveedor:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al eliminar el proveedor';
      alert(errorMessage);
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
              suppliers={suppliers}
              warehouses={warehouses}
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
            <WarehousesView />
          )}

          {currentView === 'users' && isAdmin(currentUser) && (
            <UsersView />
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
