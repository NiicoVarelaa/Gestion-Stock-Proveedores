import { useEffect, useMemo } from 'react';
import { useProductStore } from '@/store/product.store';
import { useMovementStore } from '@/store/movement.store';
import { useSupplierStore } from '@/store/supplier.store';
import { useDashboardStore } from '@/store/dashboard.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Truck, ArrowUpRight, ArrowDownRight, Package, DollarSign, TrendingUp } from 'lucide-react';
import { ProductImageWithFallback } from '@/components/ProductImage';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function SkeletonCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { lowStock, loading: loadingProducts, fetchLowStock } = useProductStore();
  const { movements, loading: loadingMovements, fetchMovements } = useMovementStore();
  const { suppliers, loading: loadingSuppliers, fetchSuppliers } = useSupplierStore();
  const { metrics, loading: loadingMetrics, fetchMetrics } = useDashboardStore();

  useEffect(() => {
    fetchLowStock();
    fetchMovements({ limit: 5 });
    fetchSuppliers({ limit: 100 });
    fetchMetrics();
  }, []);

  const isLoading = loadingProducts || loadingMovements || loadingSuppliers || loadingMetrics;

  const totalIn = useMemo(
    () => metrics?.typeDistribution?.find((t) => t.type === 'IN')?.totalQuantity || 0,
    [metrics]
  );
  const totalOut = useMemo(
    () => metrics?.typeDistribution?.find((t) => t.type === 'OUT')?.totalQuantity || 0,
    [metrics]
  );

  const categoryChartData = useMemo(() => {
    if (!metrics?.categoryDistribution) return null;
    return {
      labels: metrics.categoryDistribution.map((c) => c.category),
      datasets: [
        {
          label: 'Productos por categoría',
          data: metrics.categoryDistribution.map((c) => c.count),
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(139, 92, 246, 0.7)',
            'rgba(236, 72, 153, 0.7)',
            'rgba(6, 182, 212, 0.7)',
            'rgba(107, 114, 128, 0.7)',
          ],
          borderColor: [
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)',
            'rgb(245, 158, 11)',
            'rgb(239, 68, 68)',
            'rgb(139, 92, 246)',
            'rgb(236, 72, 153)',
            'rgb(6, 182, 212)',
            'rgb(107, 114, 128)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [metrics]);

  const trendChartData = useMemo(() => {
    if (!metrics?.movementsTrend) return null;
    return {
      labels: metrics.movementsTrend.map((m) => {
        const date = new Date(m.date);
        return date.toLocaleDateString('es-AR', { weekday: 'short' });
      }),
      datasets: [
        {
          label: 'Entradas',
          data: metrics.movementsTrend.map((m) => m.IN),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Salidas',
          data: metrics.movementsTrend.map((m) => m.OUT),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [metrics]);

  const stockByCategoryData = useMemo(() => {
    if (!metrics?.categoryDistribution) return null;
    return {
      labels: metrics.categoryDistribution.map((c) => c.category),
      datasets: [
        {
          label: 'Stock total',
          data: metrics.categoryDistribution.map((c) => c.stock),
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1,
        },
      ],
    };
  }, [metrics]);

  const typeDistributionData = useMemo(() => {
    if (!metrics?.typeDistribution) return null;
    return {
      labels: metrics.typeDistribution.map((t) => (t.type === 'IN' ? 'Entradas' : 'Salidas')),
      datasets: [
        {
          data: metrics.typeDistribution.map((t) => t.totalQuantity),
          backgroundColor: ['rgba(16, 185, 129, 0.7)', 'rgba(239, 68, 68, 0.7)'],
          borderColor: ['rgb(16, 185, 129)', 'rgb(239, 68, 68)'],
          borderWidth: 2,
        },
      ],
    };
  }, [metrics]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Proveedores Activos</CardTitle>
                <Truck className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.totalSuppliers || suppliers.filter((s) => s.active).length}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {metrics?.totalProducts || 0} productos registrados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{metrics?.lowStockCount || lowStock.length}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {metrics?.totalStockUnits || 0} unidades en inventario
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Entradas</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{totalIn}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {metrics?.typeDistribution?.find((t) => t.type === 'IN')?.count || 0} movimientos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Salidas</CardTitle>
                <ArrowDownRight className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{totalOut}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {metrics?.typeDistribution?.find((t) => t.type === 'OUT')?.count || 0} movimientos
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {lowStock.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStock.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-lg bg-red-50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <ProductImageWithFallback
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-10 w-10"
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.supplier.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{product.stock} uds</p>
                    <p className="text-xs text-gray-500">Mínimo: {product.minStock}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tendencia de Movimientos (7 días)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {trendChartData ? (
              <div className="h-64">
                <Line data={trendChartData} options={chartOptions} />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">Cargando...</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Productos por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categoryChartData ? (
              <div className="h-64">
                <Doughnut data={categoryChartData} options={chartOptions} />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">Cargando...</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            {stockByCategoryData ? (
              <div className="h-64">
                <Bar data={stockByCategoryData} options={chartOptions} />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">Cargando...</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución Entradas/Salidas</CardTitle>
          </CardHeader>
          <CardContent>
            {typeDistributionData ? (
              <div className="h-64 flex items-center justify-center max-w-xs mx-auto">
                <Doughnut data={typeDistributionData} options={chartOptions} />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">Cargando...</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimos Movimientos</CardTitle>
        </CardHeader>
        <CardContent>
          {movements.length === 0 && !loadingMovements ? (
            <p className="text-gray-500 text-sm">No hay movimientos registrados</p>
          ) : (
            <div className="space-y-2">
              {movements.map((movement) => (
                <div
                  key={movement.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{movement.product.name}</p>
                    <p className="text-sm text-gray-500">
                      {movement.reason || 'Sin motivo'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        movement.type === 'IN' ? 'text-green-600' : 'text-orange-600'
                      }`}
                    >
                      {movement.type === 'IN' ? '+' : '-'}{movement.quantity}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(movement.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {metrics?.topProducts && metrics.topProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Productos con Mayor Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metrics.topProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="w-6 h-6 flex items-center justify-center p-0">
                      {index + 1}
                    </Badge>
                    <ProductImageWithFallback
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-10 w-10"
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{product.stock} uds</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
