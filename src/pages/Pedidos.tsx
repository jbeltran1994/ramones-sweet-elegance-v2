import Navigation from "@/components/Navigation";
import { useOrders } from "@/hooks/useOrders";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState, useMemo } from "react";
import { ShoppingBag, Calendar as CalendarIcon, User, Mail, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

const Pedidos = () => {
  const { getOrders } = useOrders();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de filtros
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  // Obtener lista única de productos de todos los pedidos
  const uniqueProducts = useMemo(() => {
    const products = new Set<string>();
    orders.forEach(order => {
      order.items_pedido?.forEach((item: any) => {
        if (item.productos?.nombre) {
          products.add(item.productos.nombre);
        }
      });
    });
    return Array.from(products).sort();
  }, [orders]);

  // Filtrar pedidos
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Filtro por producto
      if (selectedProduct && selectedProduct !== "all") {
        const hasProduct = order.items_pedido?.some((item: any) => 
          item.productos?.nombre === selectedProduct
        );
        if (!hasProduct) return false;
      }

      // Filtro por estado
      if (selectedStatus && selectedStatus !== "all" && order.estado !== selectedStatus) {
        return false;
      }

      // Filtro por búsqueda de texto (nombre del cliente o email)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesName = order.cliente_nombre?.toLowerCase().includes(searchLower);
        const matchesEmail = order.cliente_email?.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesEmail) return false;
      }

      // Filtro por fecha
      if (startDate || endDate) {
        const orderDate = new Date(order.fecha_creacion);
        if (startDate && orderDate < startDate) return false;
        if (endDate && orderDate > endDate) return false;
      }

      return true;
    });
  }, [orders, selectedProduct, selectedStatus, searchTerm, startDate, endDate]);

  const clearFilters = () => {
    setSelectedProduct("all");
    setSelectedStatus("all");
    setStartDate(undefined);
    setEndDate(undefined);
    setSearchTerm("");
  };

  const hasActiveFilters = selectedProduct !== "all" || selectedStatus !== "all" || startDate || endDate || searchTerm;

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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-luxury font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            Mis Pedidos
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-elegant">
            Historial completo de tus pedidos realizados
          </p>
        </div>

        {/* Filtros */}
        <Card className="p-6 mb-8 bg-gradient-card shadow-elegant">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Filtros de Pedidos</h2>
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2">
                  {filteredOrders.length} de {orders.length}
                </Badge>
              )}
            </div>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Limpiar Filtros
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Búsqueda por texto */}
            <div className="space-y-2">
              <Label htmlFor="search">Buscar Cliente</Label>
              <Input
                id="search"
                placeholder="Nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Filtro por producto */}
            <div className="space-y-2">
              <Label>Producto</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los productos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los productos</SelectItem>
                  {uniqueProducts.map((product) => (
                    <SelectItem key={product} value={product}>
                      {product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por estado */}
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="procesando">Procesando</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtros de fecha */}
            <div className="space-y-2">
              <Label>Rango de Fechas</Label>
              <div className="flex space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd/MM", { locale: es }) : "Desde"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd/MM", { locale: es }) : "Hasta"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </Card>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              {hasActiveFilters ? "No se encontraron pedidos" : "No hay pedidos aún"}
            </h2>
            <p className="text-muted-foreground">
              {hasActiveFilters 
                ? "Intenta ajustar los filtros para encontrar lo que buscas." 
                : "Cuando realices tu primer pedido, aparecerá aquí."
              }
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" className="mt-4">
                <X className="h-4 w-4 mr-2" />
                Limpiar Filtros
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="p-6 bg-gradient-card shadow-elegant">
                {/* Header del pedido */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="text-xl font-semibold">Pedido #{order.id}</h3>
                      <div className="flex items-center text-sm text-muted-foreground space-x-4">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-4 w-4" />
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
                            <div className="w-12 h-12 bg-cta-primary rounded-lg flex items-center justify-center">
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