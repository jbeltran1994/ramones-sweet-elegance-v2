import Navigation from "@/components/Navigation";
import { useOrders } from "@/hooks/useOrders";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { ShoppingBag, Calendar, User, Mail } from "lucide-react";

const Pedidos = () => {
  const { getOrders } = useOrders();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'secondary';
      case 'procesando':
        return 'default';
      case 'completado':
        return 'default';
      case 'cancelado':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-luxury font-bold mb-4">Cargando pedidos...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-luxury font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            Mis Pedidos
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-elegant">
            Historial completo de tus pedidos realizados
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No hay pedidos aún</h2>
            <p className="text-muted-foreground">Cuando realices tu primer pedido, aparecerá aquí.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="p-6 bg-gradient-card shadow-elegant">
                {/* Header del pedido */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="text-xl font-semibold">Pedido #{order.id}</h3>
                      <div className="flex items-center text-sm text-muted-foreground space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(order.fecha_creacion)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{order.cliente_nombre}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{order.cliente_email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant={getStatusColor(order.estado)}>
                      {order.estado.toUpperCase()}
                    </Badge>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {formatPrice(order.total)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items del pedido */}
                {order.items_pedido && order.items_pedido.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Productos ({order.items_pedido.length})
                    </h4>
                    <div className="space-y-2">
                      {order.items_pedido.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold">
                                {item.productos?.nombre?.charAt(0) || 'P'}
                              </span>
                            </div>
                            <div>
                              <h5 className="font-medium">
                                {item.productos?.nombre || `Producto #${item.producto_id}`}
                              </h5>
                              <p className="text-sm text-muted-foreground">
                                {item.productos?.categoria && (
                                  <span className="mr-2">📦 {item.productos.categoria}</span>
                                )}
                                {formatPrice(item.precio_unitario)} c/u
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              {formatPrice(item.precio_unitario * item.cantidad)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Cantidad: {item.cantidad}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pedidos;