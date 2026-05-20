# Mini ERP - Stock & Supplier Management

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![Prisma](https://img.shields.io/badge/Prisma-5.x-purple)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-blue)

Sistema de gestión de stock y proveedores desarrollado como proyecto de portfolio. Demuestra buenas prácticas de arquitectura, código limpio, manejo estricto de tipos y operaciones transaccionales ACID.

## Demo

- **Live Demo:** [https://mini-erp-demo.vercel.app](#)
- **API Docs:** [https://mini-erp-api.onrender.com/api-docs](#)
- **GitHub:** [https://github.com/tu-usuario/mini-erp](#)

## Features

- CRUD completo de Proveedores y Productos
- Registro de movimientos de stock con **transacciones ACID**
- Alertas de stock mínimo en tiempo real
- Frontend responsive con Shadcn UI
- Validación end-to-end con Zod

## Tech Stack

| Capa | Tecnología |
|------|-----------|
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Validation | Zod |
| Frontend | React, Vite, Tailwind, Shadcn |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Notifications | Sonner |

## Arquitectura

```
Routes → Controllers → Services → Prisma Models
```

## Instalación Local

### Backend

```bash
cd backend
npm install
cp .env.example .env  # Configurar DATABASE_URL con tu conexión de Supabase
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/suppliers` | Crear proveedor |
| GET | `/api/suppliers` | Listar proveedores |
| PUT | `/api/suppliers/:id` | Actualizar proveedor |
| DELETE | `/api/suppliers/:id` | Desactivar proveedor |
| POST | `/api/products` | Crear producto |
| GET | `/api/products` | Listar productos |
| GET | `/api/products/low-stock` | Alertas stock bajo |
| POST | `/api/stock-movements` | Registrar movimiento (transaccional) |
| GET | `/api/stock-movements` | Historial de movimientos |

## Transacciones ACID

El registro de movimientos de stock utiliza `prisma.$transaction()` para garantizar que la actualización del stock y el registro del movimiento sean atómicos. Si una operación falla, ambas se revierten automáticamente.

```typescript
prisma.$transaction(async (tx) => {
  const movement = await tx.stockMovement.create({ data });
  const updatedProduct = await tx.product.update({ where: { id }, data });
  return { movement, product: updatedProduct };
});
```

## Estructura del Proyecto

```
mini-erp/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection
│   │   ├── routes/          # Express routers
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── middlewares/     # Validation, error handling
│   │   ├── utils/           # Custom error classes
│   │   ├── types/           # TypeScript types
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Entry point
│   └── prisma/
│       └── schema.prisma    # Data models
├── frontend/
│   └── src/
│       ├── components/      # Reusable UI
│       ├── pages/           # Page components
│       ├── services/        # API client
│       ├── store/           # Zustand stores
│       ├── types/           # TypeScript types
│       └── lib/             # Utilities
└── README.md
```

## Autor

[Tu Nombre](https://github.com/tu-usuario)
