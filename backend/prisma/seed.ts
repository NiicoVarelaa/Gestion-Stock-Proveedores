import { PrismaClient, MovementType } from '@prisma/client';

const prisma = new PrismaClient();

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
  { name: 'iPhone 15 Pro Max 256GB', category: 'Smartphones', price: 1899.99, stock: 15, minStock: 5, supplierIndex: 7 },
  { name: 'Samsung Galaxy S24 Ultra 512GB', category: 'Smartphones', price: 1599.99, stock: 22, minStock: 8, supplierIndex: 4 },
  { name: 'Samsung Galaxy A54 128GB', category: 'Smartphones', price: 449.99, stock: 35, minStock: 10, supplierIndex: 4 },
  { name: 'Xiaomi Redmi Note 13 Pro', category: 'Smartphones', price: 329.99, stock: 40, minStock: 12, supplierIndex: 2 },
  // Laptops
  { name: 'MacBook Air M3 15" 256GB', category: 'Laptops', price: 1499.99, stock: 8, minStock: 3, supplierIndex: 7 },
  { name: 'MacBook Pro 14" M3 Pro 512GB', category: 'Laptops', price: 2399.99, stock: 5, minStock: 2, supplierIndex: 7 },
  { name: 'Samsung Galaxy Book3 Pro 16"', category: 'Laptops', price: 1299.99, stock: 12, minStock: 4, supplierIndex: 4 },
  { name: 'Lenovo ThinkPad X1 Carbon Gen 11', category: 'Laptops', price: 1799.99, stock: 7, minStock: 3, supplierIndex: 0 },
  // Tablets
  { name: 'iPad Pro 12.9" M2 256GB WiFi', category: 'Tablets', price: 1299.99, stock: 10, minStock: 4, supplierIndex: 7 },
  { name: 'iPad Air 11" M2 128GB', category: 'Tablets', price: 699.99, stock: 18, minStock: 6, supplierIndex: 7 },
  { name: 'Samsung Galaxy Tab S9 256GB', category: 'Tablets', price: 849.99, stock: 14, minStock: 5, supplierIndex: 4 },
  // Audio
  { name: 'AirPods Pro 2da Gen USB-C', category: 'Audio', price: 249.99, stock: 45, minStock: 15, supplierIndex: 7 },
  { name: 'Sony WH-1000XM5 Auriculares', category: 'Audio', price: 349.99, stock: 20, minStock: 8, supplierIndex: 0 },
  { name: 'JBL Charge 5 Parlante Bluetooth', category: 'Audio', price: 179.99, stock: 30, minStock: 10, supplierIndex: 2 },
  { name: 'Logitech G Pro X Auriculares Gaming', category: 'Audio', price: 129.99, stock: 25, minStock: 8, supplierIndex: 5 },
  // Monitores
  { name: 'Samsung Odyssey G7 32" 4K', category: 'Monitores', price: 699.99, stock: 6, minStock: 3, supplierIndex: 4 },
  { name: 'LG UltraWide 34" Curvo QHD', category: 'Monitores', price: 549.99, stock: 9, minStock: 3, supplierIndex: 0 },
  { name: 'Dell UltraSharp 27" 4K USB-C', category: 'Monitores', price: 629.99, stock: 4, minStock: 2, supplierIndex: 0 },
  // Periféricos
  { name: 'Logitech MX Master 3S Mouse', category: 'Periféricos', price: 99.99, stock: 50, minStock: 15, supplierIndex: 5 },
  { name: 'Logitech MX Keys S Teclado', category: 'Periféricos', price: 119.99, stock: 35, minStock: 10, supplierIndex: 5 },
  { name: 'Razer DeathAdder V3 Mouse Gaming', category: 'Periféricos', price: 89.99, stock: 28, minStock: 10, supplierIndex: 2 },
  { name: 'Corsair K70 RGB Teclado Mecánico', category: 'Periféricos', price: 159.99, stock: 15, minStock: 5, supplierIndex: 2 },
  // Smart Home
  { name: 'Philips Hue Starter Kit 4 Bombillas', category: 'Smart Home', price: 199.99, stock: 12, minStock: 5, supplierIndex: 6 },
  { name: 'Google Nest Hub 2da Gen', category: 'Smart Home', price: 99.99, stock: 20, minStock: 8, supplierIndex: 2 },
  { name: 'Ring Video Doorbell Pro 2', category: 'Smart Home', price: 249.99, stock: 8, minStock: 3, supplierIndex: 2 },
  // Cámaras
  { name: 'GoPro HERO12 Black', category: 'Cámaras', price: 399.99, stock: 10, minStock: 4, supplierIndex: 0 },
  { name: 'Sony Alpha A7 IV Mirrorless', category: 'Cámaras', price: 2499.99, stock: 3, minStock: 1, supplierIndex: 0 },
  // Accesorios
  { name: 'Anker PowerCore 26800mAh Power Bank', category: 'Accesorios', price: 65.99, stock: 40, minStock: 15, supplierIndex: 2 },
  { name: 'Belkin Cable USB-C a Lightning 2m', category: 'Accesorios', price: 29.99, stock: 100, minStock: 30, supplierIndex: 0 },
  { name: 'Samsung T7 Portable SSD 1TB', category: 'Accesorios', price: 109.99, stock: 25, minStock: 8, supplierIndex: 4 },
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
