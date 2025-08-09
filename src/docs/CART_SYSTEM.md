# Sistema de Carrito de Compras - Ramones

## Descripción General

El sistema de carrito implementa una experiencia completa de compras con persistencia en localStorage, controles tipo stepper y gestión de estado reactiva.

## Arquitectura del Sistema

### Context y Estado Global
- **CartProvider**: Contexto React que gestiona el estado global del carrito
- **useCart**: Hook personalizado para acceder al contexto del carrito
- **Persistencia**: localStorage con clave `ramones_cart_v1`

### Modelo de Datos

```typescript
interface CartItem {
  producto_id: number;  // ID del producto en la base de datos
  nombre: string;       // Nombre del producto
  precio: number;       // Precio unitario del producto
  cantidad: number;     // Cantidad seleccionada (1-99)
}

interface CartState {
  items: CartItem[];    // Array de items en el carrito
  totalItems: number;   // Suma total de cantidades
  totalAmount: number;  // Precio total del carrito
}
```

## Funciones Utilitarias

### Funciones Principales del Hook

1. **`addItem(producto)`**
   - Agrega un nuevo producto al carrito o incrementa cantidad si ya existe
   - Parámetros: `{ producto_id, nombre, precio }`
   - Límite máximo: 99 unidades por producto

2. **`removeItem(producto_id)`**
   - Elimina completamente un producto del carrito
   - Parámetros: `producto_id: number`

3. **`incrementItem(producto_id)`**
   - Incrementa en 1 la cantidad de un producto
   - Respeta el límite máximo de 99 unidades

4. **`decrementItem(producto_id)`**
   - Decrementa en 1 la cantidad de un producto
   - Si llega a 0, elimina el producto del carrito

5. **`updateQuantity(producto_id, cantidad)`**
   - Actualiza directamente la cantidad de un producto
   - Si cantidad es 0, elimina el producto

6. **`clearCart()`**
   - Vacía completamente el carrito

7. **`getItemQuantity(producto_id)`**
   - Retorna la cantidad actual de un producto específico
   - Retorna 0 si el producto no está en el carrito

### Estado Calculado Automáticamente

- **`totalItems`**: Se recalcula automáticamente sumando todas las cantidades
- **`totalAmount`**: Se recalcula automáticamente sumando precio × cantidad de todos los items

## Componentes del Sistema

### 1. ProductCardControls
**Ubicación**: `src/components/cart/ProductCardControls.tsx`

**Propósito**: Controles de carrito para cada tarjeta de producto

**Comportamiento**:
- Muestra "Agregar al carrito" cuando cantidad = 0
- Muestra stepper [-] [cantidad] [+] cuando cantidad > 0
- Deshabilita controles si producto.activo = false o precio <= 0

### 2. CartIcon
**Ubicación**: `src/components/cart/CartIcon.tsx`

**Propósito**: Icono de carrito con badge de cantidad

**Características**:
- Badge muestra cantidad total de items
- Badge se oculta cuando totalItems = 0
- Badge muestra "99+" si totalItems > 99

### 3. MiniCart
**Ubicación**: `src/components/cart/MiniCart.tsx`

**Propósito**: Panel lateral del carrito completo

**Funcionalidades**:
- Lista todos los productos en el carrito
- Controles stepper para cada producto
- Botón de eliminar individual
- Total general
- Botón "Ir a Checkout"
- Botón "Vaciar Carrito"

## Ciclo de Vida del Carrito

### 1. Inicialización
```typescript
// Al montar la aplicación
useEffect(() => {
  const savedCart = loadCartFromStorage();
  if (savedCart.length > 0) {
    dispatch({ type: 'LOAD_CART', payload: savedCart });
  }
}, []);
```

### 2. Persistencia Automática
```typescript
// Al cambiar el estado del carrito
useEffect(() => {
  saveCartToStorage(state.items);
}, [state.items]);
```

### 3. Recálculo de Totales
Los totales se recalculan automáticamente en cada action del reducer:
- `totalItems = sum(item.cantidad)`
- `totalAmount = sum(item.precio * item.cantidad)`

## Validaciones Implementadas

### Cantidad
- Mínimo: 0 (elimina el producto)
- Máximo: 99 unidades por producto
- Solo números enteros positivos

### Disponibilidad
- Productos con `activo = false` no se pueden agregar
- Productos con `precio <= 0` no se pueden agregar

### Datos
- Validación de existencia de precio válido
- Manejo de errores en localStorage

## Accesibilidad

### Botones Stepper
- `aria-label` descriptivo: "Aumentar cantidad de {nombre}"
- Soporte completo de teclado (Enter/Espacio)
- Estados disabled visualmente distintos

### Focus Management
- Focus visible en todos los controles interactivos
- Orden de tabulación lógico

## Integración con la Aplicación

### 1. Configuración en App.tsx
```typescript
<CartProvider>
  <AuthProvider>
    {/* Resto de la aplicación */}
  </AuthProvider>
</CartProvider>
```

### 2. Uso en Componentes
```typescript
import { useCart } from '@/hooks/useCart';

const { addItem, getItemQuantity, totalItems } = useCart();
```

## Características de UX

### Transiciones
- Hover effects en botones stepper
- Transiciones suaves entre estados (botón ↔ stepper)
- Animaciones coherentes con la estética de lujo

### Feedback Visual
- Estados disabled claros
- Colores coherentes con el sistema de diseño
- Icons descriptivos (Plus, Minus, Trash)

## Limitaciones Actuales

1. **Sin validación de stock**: El sistema no verifica disponibilidad de inventario
2. **Solo localStorage**: No se sincroniza con base de datos hasta checkout
3. **Sin gestión de usuarios**: El carrito no se asocia a usuarios específicos en DB

## Próximos Pasos Sugeridos

1. **Página de Checkout dedicada** con formulario completo
2. **Sincronización con usuario autenticado** en base de datos
3. **Validación de stock** en tiempo real
4. **Carrito persistente entre dispositivos** para usuarios autenticados
5. **Notificaciones toast** para acciones del carrito