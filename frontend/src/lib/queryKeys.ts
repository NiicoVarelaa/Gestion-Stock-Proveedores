export const queryKeys = {
  products: {
    all: ['products'] as const,
    list: (params: object) => ['products', 'list', params] as const,
    lowStock: ['products', 'low-stock'] as const,
  },
  suppliers: {
    all: ['suppliers'] as const,
    list: (params: object) => ['suppliers', 'list', params] as const,
  },
  movements: {
    all: ['stock-movements'] as const,
    list: (params: object) => ['stock-movements', 'list', params] as const,
  },
  dashboard: {
    metrics: ['dashboard', 'metrics'] as const,
  },
} as const;