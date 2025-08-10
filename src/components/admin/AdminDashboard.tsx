import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { supabase } from "@/integrations/supabase/client";
import { 
  ShoppingBag, 
  DollarSign, 
  Users, 
  Package, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

const AdminDashboard = () => {
  const { getOrders } = useOrders();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      try {
        // Obtener pedidos
        const orders = await getOrders();
        
        // Obtener productos
        const { data: products } = await supabase
          .from('productos')
          .select('*');
        
        // Obtener usuarios
        const { data: users } = await supabase
          .from('usuarios')
          .select('*');

        // Calcular estadísticas
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const pendingOrders = orders.filter(order => order.estado === 'pendiente').length;
        const completedOrders = orders.filter(order => order.estado === 'completado').length;

        setStats({
          totalOrders: orders.length,
          totalRevenue,
          totalProducts: products?.length || 0,
          totalUsers: users?.length || 0,
          pendingOrders,
          completedOrders
        });

        // Últimos 5 pedidos
        setRecentOrders(orders.slice(0, 5));
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
      
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-muted rounded w-3/4"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-card shadow-elegant">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Pedidos</p>
              <p className="text-2xl font-bold text-primary">{stats.totalOrders}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-elegant">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ingresos Totales</p>
              <p className="text-2xl font-bold text-primary">{formatPrice(stats.totalRevenue)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-elegant">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Productos</p>
              <p className="text-2xl font-bold text-primary">{stats.totalProducts}</p>
            </div>
            <Package className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-elegant">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Usuarios</p>
              <p className="text-2xl font-bold text-primary">{stats.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Métricas de pedidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-card shadow-elegant">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pedidos Pendientes</p>
              <p className="text-2xl font-bold text-orange-500">{stats.pendingOrders}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-elegant">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pedidos Completados</p>
              <p className="text-2xl font-bold text-green-500">{stats.completedOrders}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-elegant">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ticket Promedio</p>
              <p className="text-2xl font-bold text-primary">
                {stats.totalOrders > 0 ? formatPrice(stats.totalRevenue / stats.totalOrders) : '$0.00'}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Pedidos recientes */}
      <Card className="p-6 bg-gradient-card shadow-elegant">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
          Pedidos Recientes
        </h3>
        {recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay pedidos recientes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div>
                  <p className="font-medium">Pedido #{order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.cliente_nombre} • {formatDate(order.fecha_creacion)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(order.total)}</p>
                  <p className="text-sm text-muted-foreground capitalize">{order.estado}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;