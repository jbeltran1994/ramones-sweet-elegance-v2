import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import CartIcon from './CartIcon';

const MiniCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, totalAmount, incrementItem, decrementItem, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const handleGoToCheckout = () => {
    setIsOpen(false);
    // Aquí podrías navegar a una página de checkout dedicada
    // navigate('/checkout');
    console.log('Ir a checkout con items:', items);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div>
          <CartIcon onClick={() => setIsOpen(true)} />
        </div>
      </SheetTrigger>
      
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrito de Compras
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              {/* Lista de items */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.producto_id} className="flex items-center gap-3 p-3 bg-gradient-card rounded-lg">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate text-foreground">
                        {item.nombre}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.precio)} c/u
                      </p>
                    </div>

                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => decrementItem(item.producto_id)}
                        className="h-7 w-7 p-0"
                        aria-label={`Disminuir cantidad de ${item.nombre}`}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="text-sm font-medium min-w-[2rem] text-center">
                        {item.cantidad}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => incrementItem(item.producto_id)}
                        className="h-7 w-7 p-0"
                        disabled={item.cantidad >= 99}
                        aria-label={`Aumentar cantidad de ${item.nombre}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Subtotal y eliminar */}
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">
                        {formatPrice(item.precio * item.cantidad)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.producto_id)}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        aria-label={`Eliminar ${item.nombre} del carrito`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Total */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">{formatPrice(totalAmount)}</span>
                </div>

                {/* Botones de acción */}
                <div className="space-y-2">
                  <Button 
                    onClick={handleGoToCheckout}
                    className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
                  >
                    Ir a Checkout
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={clearCart}
                    className="w-full hover:bg-destructive/10 hover:border-destructive transition-smooth"
                  >
                    Vaciar Carrito
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MiniCart;