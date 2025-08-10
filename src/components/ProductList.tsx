import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, AlertCircle, Filter, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
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
  
  // Estados para filtros
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

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

  // Obtener categorías únicas y rango de precios
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(productos.map(p => p.categoria).filter(Boolean))];
    return uniqueCategories;
  }, [productos]);

  const priceRangeLimits = useMemo(() => {
    if (productos.length === 0) return { min: 0, max: 1000 };
    const prices = productos.map(p => p.precio);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }, [productos]);

  // Productos filtrados
  const filteredProducts = useMemo(() => {
    return productos.filter(producto => {
      // Filtro por categoría
      const categoryMatch = selectedCategory === 'all' || producto.categoria === selectedCategory;
      
      // Filtro por precio
      const priceMatch = producto.precio >= priceRange[0] && producto.precio <= priceRange[1];
      
      return categoryMatch && priceMatch;
    });
  }, [productos, selectedCategory, priceRange]);

  // Actualizar rango de precios cuando cambien los productos
  useEffect(() => {
    if (productos.length > 0) {
      setPriceRange([priceRangeLimits.min, priceRangeLimits.max]);
    }
  }, [priceRangeLimits, productos.length]);

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange([priceRangeLimits.min, priceRangeLimits.max]);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-luxury font-bold text-foreground mb-2">
          Productos Disponibles
        </h2>
        <p className="text-muted-foreground">
          {filteredProducts.length} de {productos.length} producto{productos.length !== 1 ? 's' : ''} {filteredProducts.length !== productos.length ? 'filtrado' : 'disponible'}{productos.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Controles de filtros */}
      <div className="bg-card border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold text-foreground">Filtros</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              {showFilters ? 'Ocultar' : 'Mostrar'}
            </Button>
          </div>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${!showFilters ? 'hidden md:grid' : 'grid'}`}>
          {/* Filtro por categoría */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Categoría</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por precio */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Rango de Precio: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </label>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              min={priceRangeLimits.min}
              max={priceRangeLimits.max}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatPrice(priceRangeLimits.min)}</span>
              <span>{formatPrice(priceRangeLimits.max)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Productos filtrados */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-muted/50 rounded-lg p-8 max-w-md mx-auto">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No se encontraron productos</h3>
            <p className="text-sm text-muted-foreground">
              Intenta ajustar los filtros para ver más productos.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((producto) => (
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
      )}
    </div>
  );
};

export default ProductList;