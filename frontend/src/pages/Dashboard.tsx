import { useEffect, useMemo } from 'react';
import { useProductStore } from '@/store/product.store';
import { useMovementStore } from '@/store/movement.store';
import { useSupplierStore } from '@/store/supplier.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Truck, ArrowUpRight, ArrowDownRight } from 'lucide-react';

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

  useEffect(() => {
    fetchLowStock();
    fetchMovements({ limit: 5 });
    fetchSuppliers({ limit: 100 });
  }, []);

  const isLoading = loadingProducts || loadingMovements || loadingSuppliers;

  const totalIn = useMemo(
    () => movements.filter((m) => m.type === 'IN').reduce((sum, m) => sum + m.quantity, 0),
    [movements]
  );
  const totalOut = useMemo(
    () => movements.filter((m) => m.type === 'OUT').reduce((sum, m) => sum + m.quantity, 0),
    [movements]
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-4">
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
                <CardTitle className="text-sm font-medium">Proveedores</CardTitle>
                <Truck className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{suppliers.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{lowStock.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Entradas</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{totalIn}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Salidas</CardTitle>
                <ArrowDownRight className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{totalOut}</div>
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
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.supplier.name}</p>
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
    </div>
  );
}
