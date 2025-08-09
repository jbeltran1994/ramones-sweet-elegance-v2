import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, AlertCircle } from 'lucide-react';
import ProductCardControls from '@/components/cart/ProductCardControls';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  categoria: string | null;
  imagen_url: string | null;
  activo: boolean;
}

const ProductList = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('productos')
          .select('*')
          .eq('activo', true)
          .order('nombre');

        if (error) {
          setError(`Error al cargar productos: ${error.message}`);
          console.error('Error fetching productos:', error);
        } else {
          setProductos(data || []);
        }
      } catch (err) {
        setError('Error inesperado al cargar productos');
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Cargando productos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-destructive mb-2">Error al cargar productos</h3>
          <p className="text-sm text-destructive/80">{error}</p>
        </div>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-muted/50 rounded-lg p-8 max-w-md mx-auto">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No hay productos disponibles</h3>
          <p className="text-sm text-muted-foreground">
            Actualmente no hay productos activos en el catálogo.
          </p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-luxury font-bold text-foreground mb-2">
          Productos Disponibles
        </h2>
        <p className="text-muted-foreground">
          {productos.length} producto{productos.length !== 1 ? 's' : ''} disponible{productos.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((producto) => (
          <Card key={producto.id} className="overflow-hidden hover:shadow-elegant transition-smooth">
            <div className="aspect-square bg-gradient-card relative overflow-hidden">
              {producto.imagen_url ? (
                <img
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
              {producto.categoria && (
                <Badge className="absolute top-2 right-2 bg-primary/90 text-primary-foreground">
                  {producto.categoria}
                </Badge>
              )}
            </div>
            
            <CardContent className="p-4 space-y-2">
              <h3 className="font-luxury font-semibold text-lg text-foreground line-clamp-1">
                {producto.nombre}
              </h3>
              {producto.descripcion && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {producto.descripcion}
                </p>
              )}
            </CardContent>
            
            <CardFooter className="p-4 pt-0 space-y-3">
              <div className="w-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(producto.precio)}
                </span>
              </div>
              
              {/* Controles de carrito */}
              <ProductCardControls producto={producto} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductList;