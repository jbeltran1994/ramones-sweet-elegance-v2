import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Loader2 } from 'lucide-react';
import ProductCardControls from '@/components/cart/ProductCardControls';
import { Link } from 'react-router-dom';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  categoria: string | null;
  imagen_url: string | null;
  activo: boolean;
}

const FeaturedProducts = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('productos')
          .select('*')
          .eq('activo', true)
          .order('precio', { ascending: false })
          .limit(3);

        if (error) {
          console.error('Error fetching featured products:', error);
        } else {
          setProductos(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const getBadgeForIndex = (index: number) => {
    switch (index) {
      case 0:
        return { text: '¡MÁS VENDIDO!', variant: 'cta-primary' };
      case 1:
        return { text: 'NUEVO', variant: 'success' };
      case 2:
        return { text: 'PREMIUM', variant: 'accent' };
      default:
        return { text: 'DESTACADO', variant: 'cta-primary' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cta-primary" />
        <span className="ml-2 text-muted-foreground">Cargando productos destacados...</span>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 mb-12">
      {productos.map((producto, index) => {
        const badge = getBadgeForIndex(index);
        return (
          <Card key={producto.id} className="overflow-hidden bg-background shadow-elegant hover:shadow-cta transition-smooth border-2 border-transparent hover:border-cta-primary/20">
            <div className="aspect-square bg-muted relative overflow-hidden">
              {producto.imagen_url ? (
                <img
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  onError={(e) => {
                    console.log('Error loading image:', producto.imagen_url);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Package className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <Badge 
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    badge.variant === 'cta-primary' ? 'bg-cta-primary text-primary-foreground' :
                    badge.variant === 'success' ? 'bg-success text-success-foreground' :
                    'bg-accent text-accent-foreground'
                  }`}
                >
                  {badge.text}
                </Badge>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-luxury font-bold mb-2 line-clamp-1">{producto.nombre}</h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {producto.descripcion || 'Delicioso postre artesanal'}
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-price-highlight">
                  {formatPrice(producto.precio)}
                </span>
              </div>
              <ProductCardControls producto={producto} />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default FeaturedProducts;