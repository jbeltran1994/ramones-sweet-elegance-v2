import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface CartItem {
  producto_id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'cantidad'> }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'INCREMENT'; payload: number }
  | { type: 'DECREMENT'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { producto_id: number; cantidad: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

interface CartContextType extends CartState {
  addItem: (producto: Omit<CartItem, 'cantidad'>) => void;
  removeItem: (producto_id: number) => void;
  incrementItem: (producto_id: number) => void;
  decrementItem: (producto_id: number) => void;
  updateQuantity: (producto_id: number, cantidad: number) => void;
  clearCart: () => void;
  getItemQuantity: (producto_id: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'ramones_cart_v1';
const MAX_QUANTITY = 99;

function cartReducer(state: CartState, action: CartAction): CartState {
  let newItems: CartItem[];
  
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.producto_id === action.payload.producto_id);
      
      if (existingItem) {
        newItems = state.items.map(item =>
          item.producto_id === action.payload.producto_id
            ? { ...item, cantidad: Math.min(item.cantidad + 1, MAX_QUANTITY) }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, cantidad: 1 }];
      }
      break;

    case 'REMOVE_ITEM':
      newItems = state.items.filter(item => item.producto_id !== action.payload);
      break;

    case 'INCREMENT':
      newItems = state.items.map(item =>
        item.producto_id === action.payload
          ? { ...item, cantidad: Math.min(item.cantidad + 1, MAX_QUANTITY) }
          : item
      );
      break;

    case 'DECREMENT':
      newItems = state.items.reduce((acc, item) => {
        if (item.producto_id === action.payload) {
          if (item.cantidad > 1) {
            acc.push({ ...item, cantidad: item.cantidad - 1 });
          }
          // Si cantidad es 1, no lo incluimos (equivale a removeItem)
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as CartItem[]);
      break;

    case 'UPDATE_QUANTITY':
      if (action.payload.cantidad <= 0) {
        newItems = state.items.filter(item => item.producto_id !== action.payload.producto_id);
      } else {
        newItems = state.items.map(item =>
          item.producto_id === action.payload.producto_id
            ? { ...item, cantidad: Math.min(action.payload.cantidad, MAX_QUANTITY) }
            : item
        );
      }
      break;

    case 'CLEAR_CART':
      newItems = [];
      break;

    case 'LOAD_CART':
      newItems = action.payload;
      break;

    default:
      return state;
  }

  const totalItems = newItems.reduce((sum, item) => sum + item.cantidad, 0);
  const totalAmount = newItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  return {
    items: newItems,
    totalItems,
    totalAmount
  };
}

function loadCartFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalAmount: 0
  });

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    if (savedCart.length > 0) {
      dispatch({ type: 'LOAD_CART', payload: savedCart });
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    saveCartToStorage(state.items);
  }, [state.items]);

  const addItem = (producto: Omit<CartItem, 'cantidad'>) => {
    dispatch({ type: 'ADD_ITEM', payload: producto });
  };

  const removeItem = (producto_id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: producto_id });
  };

  const incrementItem = (producto_id: number) => {
    dispatch({ type: 'INCREMENT', payload: producto_id });
  };

  const decrementItem = (producto_id: number) => {
    dispatch({ type: 'DECREMENT', payload: producto_id });
  };

  const updateQuantity = (producto_id: number, cantidad: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { producto_id, cantidad } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemQuantity = (producto_id: number): number => {
    const item = state.items.find(item => item.producto_id === producto_id);
    return item?.cantidad || 0;
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        incrementItem,
        decrementItem,
        updateQuantity,
        clearCart,
        getItemQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}