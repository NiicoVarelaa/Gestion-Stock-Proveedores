import { PrismaClient, MovementType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const defaultUser = {
  email: 'admin@stockflow.app',
  password: 'admin123',
  name: 'Administrador',
};

const suppliers = [
  { name: 'TechDistribuciones S.A.', email: 'ventas@techdist.com', phone: '+54 11 4567-8901', address: 'Av. Corrientes 1234, CABA' },
  { name: 'ElectroMayorista', email: 'contacto@electromayor.com', phone: '+54 11 5678-9012', address: 'Calle Florida 567, CABA' },
  { name: 'Importaciones Global Tech', email: 'info@globaltech.com', phone: '+54 11 6789-0123', address: 'Av. Belgrano 890, CABA' },
  { name: 'Distrilab Argentina', email: 'pedidos@distrilab.com', phone: '+54 11 7890-1234', address: 'Av. Rivadavia 2345, CABA' },
  { name: 'Samsung Distribution', email: 'b2b@samsung-dist.com', phone: '+54 11 8901-2345', address: 'Av. del Libertador 1500, CABA' },
  { name: 'Logitech Partner AR', email: 'ventas@logitech-ar.com', phone: '+54 11 9012-3456', address: 'Av. Santa Fe 3456, CABA' },
  { name: 'Philips Electronics AR', email: 'distribucion@philips.com', phone: '+54 11 0123-4567', address: 'Av. 9 de Julio 789, CABA' },
  { name: 'Apple Reseller Premium', email: 'reseller@apple-premium.com', phone: '+54 11 1234-5678', address: 'Palermo Soho, CABA' },
];

const products = [
  // Smartphones
  { name: 'iPhone 15 Pro Max 256GB', category: 'Smartphones', price: 1899.99, stock: 15, minStock: 5, supplierIndex: 7, imageUrl: 'https://placehold.co/400x400/1a1a2e/ffffff?text=iPhone+15+Pro' },
  { name: 'Samsung Galaxy S24 Ultra 512GB', category: 'Smartphones', price: 1599.99, stock: 22, minStock: 8, supplierIndex: 4, imageUrl: 'https://placehold.co/400x400/16213e/ffffff?text=Galaxy+S24' },
  { name: 'Samsung Galaxy A54 128GB', category: 'Smartphones', price: 449.99, stock: 35, minStock: 10, supplierIndex: 4, imageUrl: 'https://placehold.co/400x400/0f3460/ffffff?text=Galaxy+A54' },
  { name: 'Xiaomi Redmi Note 13 Pro', category: 'Smartphones', price: 329.99, stock: 40, minStock: 12, supplierIndex: 2, imageUrl: 'https://placehold.co/400x400/533483/ffffff?text=Redmi+Note+13' },
  // Laptops
  { name: 'MacBook Air M3 15" 256GB', category: 'Laptops', price: 1499.99, stock: 8, minStock: 3, supplierIndex: 7, imageUrl: 'https://placehold.co/400x400/2c3e50/ffffff?text=MacBook+Air' },
  { name: 'MacBook Pro 14" M3 Pro 512GB', category: 'Laptops', price: 2399.99, stock: 5, minStock: 2, supplierIndex: 7, imageUrl: 'https://placehold.co/400x400/34495e/ffffff?text=MacBook+Pro' },
  { name: 'Samsung Galaxy Book3 Pro 16"', category: 'Laptops', price: 1299.99, stock: 12, minStock: 4, supplierIndex: 4, imageUrl: 'https://placehold.co/400x400/1a252f/ffffff?text=Galaxy+Book3' },
  { name: 'Lenovo ThinkPad X1 Carbon Gen 11', category: 'Laptops', price: 1799.99, stock: 7, minStock: 3, supplierIndex: 0, imageUrl: 'https://placehold.co/400x400/e74c3c/ffffff?text=ThinkPad+X1' },
  // Tablets
  { name: 'iPad Pro 12.9" M2 256GB WiFi', category: 'Tablets', price: 1299.99, stock: 10, minStock: 4, supplierIndex: 7, imageUrl: 'https://placehold.co/400x400/2980b9/ffffff?text=iPad+Pro' },
  { name: 'iPad Air 11" M2 128GB', category: 'Tablets', price: 699.99, stock: 18, minStock: 6, supplierIndex: 7, imageUrl: 'https://placehold.co/400x400/3498db/ffffff?text=iPad+Air' },
  { name: 'Samsung Galaxy Tab S9 256GB', category: 'Tablets', price: 849.99, stock: 14, minStock: 5, supplierIndex: 4, imageUrl: 'https://placehold.co/400x400/1abc9c/ffffff?text=Galaxy+Tab+S9' },
  // Audio
  { name: 'AirPods Pro 2da Gen USB-C', category: 'Audio', price: 249.99, stock: 45, minStock: 15, supplierIndex: 7, imageUrl: 'https://placehold.co/400x400/9b59b6/ffffff?text=AirPods+Pro' },
  { name: 'Sony WH-1000XM5 Auriculares', category: 'Audio', price: 349.99, stock: 20, minStock: 8, supplierIndex: 0, imageUrl: 'https://placehold.co/400x400/8e44ad/ffffff?text=Sony+XM5' },
  { name: 'JBL Charge 5 Parlante Bluetooth', category: 'Audio', price: 179.99, stock: 30, minStock: 10, supplierIndex: 2, imageUrl: 'https://placehold.co/400x400/f39c12/ffffff?text=JBL+Charge+5' },
  { name: 'Logitech G Pro X Auriculares Gaming', category: 'Audio', price: 129.99, stock: 25, minStock: 8, supplierIndex: 5, imageUrl: 'https://placehold.co/400x400/e67e22/ffffff?text=G+Pro+X' },
  // Monitores
  { name: 'Samsung Odyssey G7 32" 4K', category: 'Monitores', price: 699.99, stock: 6, minStock: 3, supplierIndex: 4, imageUrl: 'https://placehold.co/400x400/27ae60/ffffff?text=Odyssey+G7' },
  { name: 'LG UltraWide 34" Curvo QHD', category: 'Monitores', price: 549.99, stock: 9, minStock: 3, supplierIndex: 0, imageUrl: 'https://placehold.co/400x400/2ecc71/ffffff?text=LG+UltraWide' },
  { name: 'Dell UltraSharp 27" 4K USB-C', category: 'Monitores', price: 629.99, stock: 4, minStock: 2, supplierIndex: 0, imageUrl: 'https://placehold.co/400x400/1abc9c/ffffff?text=Dell+4K' },
  // Periféricos
  { name: 'Logitech MX Master 3S Mouse', category: 'Periféricos', price: 99.99, stock: 50, minStock: 15, supplierIndex: 5, imageUrl: 'https://placehold.co/400x400/34495e/ffffff?text=MX+Master+3S' },
  { name: 'Logitech MX Keys S Teclado', category: 'Periféricos', price: 119.99, stock: 35, minStock: 10, supplierIndex: 5, imageUrl: 'https://placehold.co/400x400/2c3e50/ffffff?text=MX+Keys+S' },
  { name: 'Razer DeathAdder V3 Mouse Gaming', category: 'Periféricos', price: 89.99, stock: 28, minStock: 10, supplierIndex: 2, imageUrl: 'https://placehold.co/400x400/c0392b/ffffff?text=DeathAdder+V3' },
  { name: 'Corsair K70 RGB Teclado Mecánico', category: 'Periféricos', price: 159.99, stock: 15, minStock: 5, supplierIndex: 2, imageUrl: 'https://placehold.co/400x400/d35400/ffffff?text=Corsair+K70' },
  // Smart Home
  { name: 'Philips Hue Starter Kit 4 Bombillas', category: 'Smart Home', price: 199.99, stock: 12, minStock: 5, supplierIndex: 6, imageUrl: 'https://placehold.co/400x400/f1c40f/333333?text=Philips+Hue' },
  { name: 'Google Nest Hub 2da Gen', category: 'Smart Home', price: 99.99, stock: 20, minStock: 8, supplierIndex: 2, imageUrl: 'https://placehold.co/400x400/e74c3c/ffffff?text=Nest+Hub' },
  { name: 'Ring Video Doorbell Pro 2', category: 'Smart Home', price: 249.99, stock: 8, minStock: 3, supplierIndex: 2, imageUrl: 'https://placehold.co/400x400/1abc9c/ffffff?text=Ring+Doorbell' },
  // Cámaras
  { name: 'GoPro HERO12 Black', category: 'Cámaras', price: 399.99, stock: 10, minStock: 4, supplierIndex: 0, imageUrl: 'https://placehold.co/400x400/2c3e50/ffffff?text=GoPro+HERO12' },
  { name: 'Sony Alpha A7 IV Mirrorless', category: 'Cámaras', price: 2499.99, stock: 3, minStock: 1, supplierIndex: 0, imageUrl: 'https://placehold.co/400x400/34495e/ffffff?text=Sony+A7+IV' },
  // Accesorios
  { name: 'Anker PowerCore 26800mAh Power Bank', category: 'Accesorios', price: 65.99, stock: 40, minStock: 15, supplierIndex: 2, imageUrl: 'https://placehold.co/400x400/95a5a6/ffffff?text=Anker+PowerCore' },
  { name: 'Belkin Cable USB-C a Lightning 2m', category: 'Accesorios', price: 29.99, stock: 100, minStock: 30, supplierIndex: 0, imageUrl: 'https://placehold.co/400x400/7f8c8d/ffffff?text=Belkin+Cable' },
  { name: 'Samsung T7 Portable SSD 1TB', category: 'Accesorios', price: 109.99, stock: 25, minStock: 8, supplierIndex: 4, imageUrl: 'https://placehold.co/400x400/2980b9/ffffff?text=Samsung+T7' },
];

const movementReasons = {
  IN: [
    'Compra a proveedor',
    'Devolución de cliente',
    'Reposición de stock',
    'Pedido mayorista recibido',
    'Mercadería en tránsito llegada',
    'Ajuste de inventario positivo',
  ],
  OUT: [
    'Venta online',
    'Venta en tienda física',
    'Devolución a proveedor',
    'Producto dañado',
    'Pedido corporativo',
    'Muestra para demostración',
  ],
};

async function main() {
  console.log('🗑️  Limpiando datos existentes...');
  await prisma.stockMovement.deleteMany();
  await prisma.product.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();

  console.log('👤 Creando usuario admin...');
  const hashedPassword = await bcrypt.hash(defaultUser.password, 10);
  const adminUser = await prisma.user.create({
    data: {
      email: defaultUser.email,
      password: hashedPassword,
      name: defaultUser.name,
    },
  });
  console.log(`  ✓ ${adminUser.email} (contraseña: ${defaultUser.password})`);

  console.log('📦 Creando proveedores...');
  const createdSuppliers = [];
  for (const s of suppliers) {
    const supplier = await prisma.supplier.create({ data: s });
    createdSuppliers.push(supplier);
    console.log(`  ✓ ${supplier.name}`);
  }

  console.log('📱 Creando productos...');
  const createdProducts = [];
  for (const p of products) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        category: p.category,
        price: p.price,
        stock: p.stock,
        minStock: p.minStock,
        imageUrl: p.imageUrl,
        supplierId: createdSuppliers[p.supplierIndex].id,
      },
    });
    createdProducts.push(product);
    console.log(`  ✓ ${product.name} (Stock: ${product.stock})`);
  }

  console.log('📊 Generando movimientos de stock...');
  const movements = [];
  const now = new Date();

  for (const product of createdProducts) {
    const numMovements = Math.floor(Math.random() * 4) + 2;

    for (let i = 0; i < numMovements; i++) {
      const type = Math.random() > 0.4 ? MovementType.IN : MovementType.OUT;
      const quantity = type === MovementType.IN
        ? Math.floor(Math.random() * 30) + 10
        : Math.floor(Math.random() * 8) + 1;

      const daysAgo = Math.floor(Math.random() * 60);
      const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      const reasonList = type === MovementType.IN ? movementReasons.IN : movementReasons.OUT;
      const reason = reasonList[Math.floor(Math.random() * reasonList.length)];

      const movement = await prisma.stockMovement.create({
        data: {
          type,
          quantity,
          reason,
          productId: product.id,
          createdAt,
        },
      });
      movements.push(movement);
    }
  }

  console.log(`  ✓ ${movements.length} movimientos creados`);

  console.log('\n✅ Seed completado exitosamente!');
  console.log(`   - ${createdSuppliers.length} proveedores`);
  console.log(`   - ${createdProducts.length} productos`);
  console.log(`   - ${movements.length} movimientos de stock`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
