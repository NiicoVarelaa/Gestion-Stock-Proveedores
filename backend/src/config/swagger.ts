const apiUrl = process.env.API_URL || 'http://localhost:3000';

export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Flow Stock API',
    version: '1.0.0',
    description:
      'Sistema de gestión de inventario para tiendas electrónicas. Dashboard con métricas, gestión de proveedores, productos y movimientos de stock.\n\n- **Autenticación:** cookies httpOnly (`auth_token`) via JWT.\n- **Roles:** los endpoints de escritura (POST/PUT/DELETE/PATCH) requieren `admin`. Las lecturas están abiertas a cualquier usuario autenticado.\n- **Export CSV:** los endpoints `/export/csv` descargan un archivo `.csv`.',
  },
  servers: [{ url: apiUrl }],
  tags: [
    { name: 'Auth', description: 'Autenticación y gestión de sesión' },
    { name: 'Password Reset', description: 'Recuperación de contraseña por email' },
    { name: 'Suppliers', description: 'Gestión de proveedores' },
    { name: 'Products', description: 'Gestión de productos' },
    { name: 'Stock Movements', description: 'Movimientos de inventario' },
    { name: 'Dashboard', description: 'Métricas e indicadores' },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'auth_token',
        description: 'Cookie httpOnly con el JWT emitida en /api/auth/login',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          role: { type: 'string', enum: ['admin', 'user'] },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Supplier: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string', nullable: true },
          address: { type: 'string', nullable: true },
          active: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          category: { type: 'string' },
          price: { type: 'number', format: 'double' },
          stock: { type: 'integer' },
          minStock: { type: 'integer' },
          imageUrl: { type: 'string', nullable: true },
          supplierId: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      StockMovement: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          type: { type: 'string', enum: ['IN', 'OUT'] },
          quantity: { type: 'integer' },
          reason: { type: 'string', nullable: true },
          productId: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          requestId: { type: 'string' },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          total: { type: 'integer' },
          page: { type: 'integer' },
          limit: { type: 'integer' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { $ref: '#/components/schemas/User' },
        },
      },
    },
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar usuario',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'name'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                  name: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Usuario creado (cookie auth_token establecida)',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
          },
          400: { description: 'Validación fallida o email en uso' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Iniciar sesión',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login exitoso (cookie auth_token establecida)',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
          },
          401: { description: 'Credenciales inválidas' },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Cerrar sesión (borra la cookie)',
        responses: {
          200: {
            description: 'Sesión cerrada',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { success: { type: 'boolean' } } },
              },
            },
          },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Obtener usuario actual',
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: 'Usuario autenticado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
          },
          401: { description: 'No autenticado' },
        },
      },
    },
    '/api/auth/forgot-password': {
      post: {
        tags: ['Password Reset'],
        summary: 'Solicitar código de recuperación por email',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: { email: { type: 'string', format: 'email' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Código enviado si el email existe' },
        },
      },
    },
    '/api/auth/verify-code': {
      post: {
        tags: ['Password Reset'],
        summary: 'Verificar código de recuperación',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'code'],
                properties: { email: { type: 'string', format: 'email' }, code: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Código verificado' },
          400: { description: 'Código inválido o expirado' },
        },
      },
    },
    '/api/auth/reset-password': {
      post: {
        tags: ['Password Reset'],
        summary: 'Restablecer contraseña con código verificado',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'code', 'newPassword'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  code: { type: 'string' },
                  newPassword: { type: 'string', minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Contraseña restablecida' },
          400: { description: 'Código inválido o expirado' },
        },
      },
    },
    '/api/suppliers': {
      get: {
        tags: ['Suppliers'],
        summary: 'Listar proveedores (paginado)',
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'active', in: 'query', schema: { type: 'boolean' } },
        ],
        responses: {
          200: {
            description: 'Lista de proveedores',
            content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/Supplier' } }, $ref: '#/components/schemas/Pagination' } } } },
          },
        },
      },
      post: {
        tags: ['Suppliers'],
        summary: 'Crear proveedor (admin)',
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  phone: { type: 'string' },
                  address: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Proveedor creado' },
          403: { description: 'Rol insuficiente (requiere admin)' },
        },
      },
    },
    '/api/suppliers/csv': {
      get: {
        tags: ['Suppliers'],
        summary: 'Exportar proveedores a CSV',
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: 'Archivo CSV (application/csv)',
            content: { 'text/csv; charset=utf-8': { schema: { type: 'string' } } },
          },
        },
      },
    },
    '/api/suppliers/{id}': {
      get: {
        tags: ['Suppliers'],
        summary: 'Obtener proveedor por id',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Proveedor', content: { 'application/json': { schema: { $ref: '#/components/schemas/Supplier' } } } },
          404: { description: 'No encontrado' },
        },
      },
      put: {
        tags: ['Suppliers'],
        summary: 'Actualizar proveedor (admin)',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  phone: { type: 'string' },
                  address: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Proveedor actualizado' },
          403: { description: 'Rol insuficiente (requiere admin)' },
        },
      },
    },
    '/api/suppliers/{id}/deactivate': {
      patch: {
        tags: ['Suppliers'],
        summary: 'Desactivar proveedor (admin)',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Proveedor desactivado' },
          403: { description: 'Rol insuficiente (requiere admin)' },
        },
      },
    },
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'Listar productos (paginado y filtrable)',
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'supplierId', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Lista de productos', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/Product' } }, $ref: '#/components/schemas/Pagination' } } } } },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Crear producto (admin, multipart/form-data)',
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['name', 'category', 'price', 'supplierId'],
                properties: {
                  name: { type: 'string' },
                  category: { type: 'string' },
                  price: { type: 'number' },
                  minStock: { type: 'integer', default: 5 },
                  supplierId: { type: 'string' },
                  imageUrl: { type: 'string', description: 'URL externa (alternativa al archivo)' },
                  image: { type: 'string', format: 'binary', description: 'Archivo de imagen (JPG/PNG/WebP, máx 5MB)' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Producto creado' },
          403: { description: 'Rol insuficiente (requiere admin)' },
        },
      },
    },
    '/api/products/csv': {
      get: {
        tags: ['Products'],
        summary: 'Exportar productos a CSV',
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: 'Archivo CSV (application/csv)',
            content: { 'text/csv; charset=utf-8': { schema: { type: 'string' } } },
          },
        },
      },
    },
    '/api/products/low-stock': {
      get: {
        tags: ['Products'],
        summary: 'Productos con stock menor o igual al mínimo',
        security: [{ cookieAuth: [] }],
        responses: {
          200: { description: 'Lista de productos con stock bajo', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/Product' } } } } } } },
        },
      },
    },
    '/api/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Obtener producto por id',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Producto', content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } },
          404: { description: 'No encontrado' },
        },
      },
      put: {
        tags: ['Products'],
        summary: 'Actualizar producto (admin, multipart/form-data)',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  category: { type: 'string' },
                  price: { type: 'number' },
                  minStock: { type: 'integer' },
                  supplierId: { type: 'string' },
                  image: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Producto actualizado' },
          403: { description: 'Rol insuficiente (requiere admin)' },
        },
      },
      delete: {
        tags: ['Products'],
        summary: 'Eliminar producto (admin)',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Producto eliminado' },
          403: { description: 'Rol insuficiente (requiere admin)' },
        },
      },
    },
    '/api/products/{id}/image': {
      patch: {
        tags: ['Products'],
        summary: 'Actualizar imagen de producto (admin)',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'multipart/form-data': { schema: { type: 'object', properties: { image: { type: 'string', format: 'binary' } } } } },
        },
        responses: {
          200: { description: 'Imagen actualizada' },
          403: { description: 'Rol insuficiente (requiere admin)' },
        },
      },
    },
    '/api/stock-movements': {
      get: {
        tags: ['Stock Movements'],
        summary: 'Listar movimientos (paginado y filtrable)',
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'productId', in: 'query', schema: { type: 'string' } },
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['IN', 'OUT'] } },
          { name: 'from', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'to', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'supplierId', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Lista de movimientos', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/StockMovement' } }, $ref: '#/components/schemas/Pagination' } } } } },
        },
      },
      post: {
        tags: ['Stock Movements'],
        summary: 'Registrar movimiento de stock (admin, transaccional)',
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['productId', 'type', 'quantity'],
                properties: {
                  productId: { type: 'string' },
                  type: { type: 'string', enum: ['IN', 'OUT'] },
                  quantity: { type: 'integer', minimum: 1 },
                  reason: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Movimiento creado y stock actualizado' },
          403: { description: 'Rol insuficiente (requiere admin)' },
          409: { description: 'Stock insuficiente' },
        },
      },
    },
    '/api/stock-movements/csv': {
      get: {
        tags: ['Stock Movements'],
        summary: 'Exportar movimientos a CSV',
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: 'Archivo CSV (application/csv)',
            content: { 'text/csv; charset=utf-8': { schema: { type: 'string' } } },
          },
        },
      },
    },
    '/api/stock-movements/{id}': {
      get: {
        tags: ['Stock Movements'],
        summary: 'Obtener movimiento por id',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Movimiento', content: { 'application/json': { schema: { $ref: '#/components/schemas/StockMovement' } } } },
          404: { description: 'No encontrado' },
        },
      },
    },
    '/api/dashboard/metrics': {
      get: {
        tags: ['Dashboard'],
        summary: 'Métricas del dashboard',
        security: [{ cookieAuth: [] }],
        responses: {
          200: { description: 'Métricas en tiempo real' },
        },
      },
    },
    '/api/health': {
      get: {
        tags: ['System'],
        summary: 'Health check',
        responses: {
          200: { description: 'Servicio saludable' },
        },
      },
    },
  },
} as const;

export const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Flow Stock API Docs',
};