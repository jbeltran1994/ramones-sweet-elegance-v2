import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, TrendingUp, DollarSign, Package } from "lucide-react";

const AdminReports = () => {
  const { getOrders } = useOrders();
  const [reportData, setReportData] = useState({
    monthlyRevenue: 0,
    topProducts: [] as any[],
    ordersByStatus: {} as Record<string, number>,
    dailyOrders: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Obtener pedidos
      const orders = await getOrders();
      
      // Obtener productos
      const { data: products } = await supabase
        .from('productos')
        .select('*');

      // Calcular ingresos del mes actual
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = orders
        .filter(order => {
          const orderDate = new Date(order.fecha_creacion);
          return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
        })
        .reduce((sum, order) => sum + order.total, 0);

      // Calcular productos más vendidos
      const productSales: Record<number, { name: string, quantity: number, revenue: number }> = {};
      
      orders.forEach(order => {
        order.items_pedido?.forEach((item: any) => {
          const productId = item.producto_id;
          if (!productSales[productId]) {
            productSales[productId] = {
              name: item.productos?.nombre || `Producto #${productId}`,
              quantity: 0,
              revenue: 0
            };
          }
          productSales[productId].quantity += item.cantidad;
          productSales[productId].revenue += item.precio_unitario * item.cantidad;
        });
      });

      const topProducts = Object.entries(productSales)
        .map(([id, data]) => ({ id: parseInt(id), ...data }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      // Contar pedidos por estado
      const ordersByStatus = orders.reduce((acc, order) => {
        acc[order.estado] = (acc[order.estado] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Pedidos por día (últimos 7 días)
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayOrders = orders.filter(order => 
          order.fecha_creacion.split('T')[0] === dateStr
        ).length;
        
        last7Days.push({
          date: date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
          orders: dayOrders
        });
      }

      setReportData({
        monthlyRevenue,
        topProducts,
        ordersByStatus,
        dailyOrders: last7Days
      });
      
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
    setLoading(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-card shadow-elegant">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <BarChart3 className="h-6 w-6 mr-2 text-primary" />
          Reportes y Analytics
        </h2>

        {/* Métricas del mes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-4 bg-background/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ingresos del Mes</p>
                <p className="text-2xl font-bold text-primary">{formatPrice(reportData.monthlyRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-4 bg-background/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Productos Activos</p>
                <p className="text-2xl font-bold text-primary">{reportData.topProducts.length}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </div>

        {/* Productos más vendidos */}
        <Card className="p-4 bg-background/50 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            Top 5 Productos Más Vendidos
          </h3>
          {reportData.topProducts.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No hay datos de ventas disponibles</p>
          ) : (
            <div className="space-y-3">
              {reportData.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.quantity} unidades vendidas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(product.revenue)}</p>
                    <p className="text-sm text-muted-foreground">ingresos</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Estados de pedidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4 bg-background/50">
            <h3 className="text-lg font-semibold mb-4">Pedidos por Estado</h3>
            {Object.keys(reportData.ordersByStatus).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No hay pedidos registrados</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(reportData.ordersByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="capitalize font-medium">{status}</span>
                    <span className="text-primary font-bold">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-4 bg-background/50">
            <h3 className="text-lg font-semibold mb-4">Pedidos Últimos 7 Días</h3>
            <div className="space-y-2">
              {reportData.dailyOrders.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="font-medium">{day.date}</span>
                  <span className="text-primary font-bold">{day.orders}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default AdminReports;