import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface ProductCardControlsProps {
  producto: {
    id: number;
    nombre: string;
    precio: number;
    activo: boolean;
  };
}

const ProductCardControls = ({ producto }: ProductCardControlsProps) => {
  const { addItem, incrementItem, decrementItem, getItemQuantity } = useCart();
  
  const quantity = getItemQuantity(producto.id);
  const isDisabled = !producto.activo || producto.precio <= 0;

  const handleAdd = () => {
    addItem({
      producto_id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio
    });
  };

  const handleIncrement = () => {
    incrementItem(producto.id);
  };

  const handleDecrement = () => {
    decrementItem(producto.id);
  };

  if (isDisabled) {
    return (
      <Button variant="outline" disabled className="w-full">
        No disponible
      </Button>
    );
  }

  if (quantity === 0) {
    return (
      <Button 
        onClick={handleAdd}
        className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
      >
        Agregar al carrito
      </Button>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleDecrement}
        className="h-9 w-9 p-0 hover:bg-destructive/10 hover:border-destructive transition-smooth"
        aria-label={`Disminuir cantidad de ${producto.nombre}`}
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      <div className="flex-1 text-center">
        <span className="text-sm font-medium text-foreground">
          {quantity}
        </span>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleIncrement}
        className="h-9 w-9 p-0 hover:bg-primary/10 hover:border-primary transition-smooth"
        aria-label={`Aumentar cantidad de ${producto.nombre}`}
        disabled={quantity >= 99}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ProductCardControls;