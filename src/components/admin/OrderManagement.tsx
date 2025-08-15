import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, User, Mail, Calendar, Eye, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const OrderManagement = () => {
  const { getOrders } = useOrders();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const fetchedOrders = await getOrders();
    setOrders(fetchedOrders);
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    setUpdating(orderId);
    try {
      console.log('🔄 Intentando actualizar pedido:', orderId, 'a estado:', newStatus);
      
      // Verificar autenticación
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('❌ Usuario no autenticado');
        toast.error('Debes estar autenticado para actualizar pedidos');
        setUpdating(null);
        return;
      }
      
      console.log('✅ Usuario autenticado:', user.email, 'ID:', user.id);
      
      // Intentar actualización directa
      const { data, error } = await supabase
        .from('pedidos')
        .update({ estado: newStatus })
        .eq('id', orderId)
        .select();

      console.log('📝 Respuesta de actualización:', { data, error });

      if (error) {
        console.error('❌ Error directo de Supabase:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.warn('⚠️ Actualización bloqueada por RLS - array vacío retornado');
        
        // Verificar el estado actual después del intento
        const { data: checkData, error: checkError } = await supabase
          .from('pedidos')
          .select('estado, id')
          .eq('id', orderId)
          .single();
          
        console.log('🔍 Verificación post-actualización:', { checkData, checkError });
        
        if (checkError) {
          throw new Error(`Error verificando actualización: ${checkError.message}`);
        }
        
        if (checkData.estado === newStatus) {
          console.log('✅ Actualización fue exitosa a pesar del array vacío');
          toast.success(`Pedido #${orderId} actualizado a ${newStatus}`);
          fetchOrders();
        } else {
          console.error('❌ La actualización fue bloqueada completamente');
          throw new Error('Error de permisos: Las políticas de seguridad de la base de datos no permiten esta actualización. Es necesario configurar los permisos administrativos en Supabase.');
        }
      } else {
        console.log('✅ Actualización exitosa con datos:', data);
        toast.success(`Pedido #${orderId} actualizado a ${newStatus}`);
        fetchOrders();
      }
    } catch (error: any) {
      console.error('💥 Error completo actualizando estado del pedido:', error);
      
      // Manejo específico de errores con logging detallado
      if (error.code === 'PGRST301') {
        console.error('🚫 Error PGRST301 - Sin permisos');
        toast.error('Sin permisos para actualizar este pedido');
      } else if (error.code === 'PGRST116') {
        console.error('🔍 Error PGRST116 - Pedido no encontrado');
        toast.error('Pedido no encontrado');
      } else if (error.message?.includes('RLS') || error.message?.includes('política') || error.message?.includes('permission')) {
        console.error('🔒 Error de políticas RLS');
        toast.error('Error de permisos: Contacta al administrador para habilitar la gestión de pedidos');
      } else {
        console.error('❓ Error desconocido:', error.message);
        toast.error(`Error: ${error.message || 'Error desconocido al actualizar'}`);
      }
    }
    setUpdating(null);
  };

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

  const getStatusOptions = () => [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'procesando', label: 'Procesando' },
    { value: 'completado', label: 'Completado' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center">
            <ShoppingBag className="h-6 w-6 mr-2 text-primary" />
            Gestión de Pedidos
          </h2>
          <Button onClick={fetchOrders} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay pedidos</h3>
            <p className="text-muted-foreground">Los pedidos aparecerán aquí cuando los clientes realicen compras.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-4 bg-background/50">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  {/* Información del pedido */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">Pedido #{order.id}</h3>
                      <Badge variant={getStatusColor(order.estado)}>
                        {order.estado.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{order.cliente_nombre}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>{order.cliente_email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(order.fecha_creacion)}</span>
                      </div>
                    </div>

                    {/* Total y productos */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-xl font-bold text-primary">
                        {formatPrice(order.total)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.items_pedido?.length || 0} producto(s)
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center space-x-3">
                    <Select 
                      value={order.estado} 
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                      disabled={updating === order.id}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getStatusOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Detalles expandibles */}
                {selectedOrder?.id === order.id && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold mb-3">Productos del Pedido:</h4>
                    <div className="space-y-2">
                      {order.items_pedido?.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div className="flex items-center space-x-3">
                            {item.productos?.imagen_url && (
                              <img 
                                src={item.productos.imagen_url} 
                                alt={item.productos.nombre}
                                className="w-8 h-8 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium">{item.productos?.nombre || `Producto #${item.producto_id}`}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatPrice(item.precio_unitario)} x {item.cantidad}
                              </p>
                            </div>
                          </div>
                          <div className="font-semibold">
                            {formatPrice(item.precio_unitario * item.cantidad)}
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
      </Card>
    </div>
  );
};

export default OrderManagement;