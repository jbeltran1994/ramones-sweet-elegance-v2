import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { CartItem } from './useCart';
import { toast } from 'sonner';

export interface OrderData {
  customer_email: string;
  customer_name: string;
  items: CartItem[];
  total_amount: number;
  total_items: number;
}

export interface Order {
  id: number;
  auth_user_id: string | null;
  cliente_email: string | null;
  cliente_nombre: string;
  cliente_telefono: string | null;
  estado: string;
  fecha_creacion: string;
  total: number;
  user_id: number | null;
  items_pedido?: OrderItem[];
}

export interface OrderItem {
  id: number;
  pedido_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  // Información adicional del producto (será obtenida via join)
  productos?: {
    nombre: string;
    categoria: string | null;
    imagen_url: string | null;
  };
}

export const useOrders = () => {
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const { user } = useAuth();

  const createOrder = async (orderData: OrderData): Promise<Order | null> => {
    setIsCreatingOrder(true);
    
    try {
      // 1. Crear el pedido principal en la tabla 'pedidos'
      const { data: orderResult, error: orderError } = await supabase
        .from('pedidos')
        .insert({
          auth_user_id: user?.id || null,
          cliente_email: orderData.customer_email,
          cliente_nombre: orderData.customer_name,
          cliente_telefono: null, // Se puede agregar más adelante
          total: orderData.total_amount,
          estado: 'pendiente'
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        toast.error('Error al crear el pedido');
        return null;
      }

      console.log('Pedido creado:', orderResult);

      // 2. Crear los items del pedido en la tabla 'items_pedido'
      const orderItems = orderData.items.map(item => ({
        pedido_id: orderResult.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio
      }));

      const { data: itemsResult, error: itemsError } = await supabase
        .from('items_pedido')
        .insert(orderItems)
        .select();

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        // Rollback: eliminar el pedido si falló la creación de items
        await supabase.from('pedidos').delete().eq('id', orderResult.id);
        toast.error('Error al crear los items del pedido');
        return null;
      }

      console.log('Items del pedido creados:', itemsResult);

      // 3. Obtener el pedido completo con sus items para retornarlo
      const completeOrder = await getOrderById(orderResult.id);

      toast.success(`¡Pedido #${orderResult.id} creado exitosamente!`);
      return completeOrder;

    } catch (error) {
      console.error('Unexpected error creating order:', error);
      toast.error('Error inesperado al crear el pedido');
      return null;
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const getOrders = async (): Promise<Order[]> => {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          items_pedido (
            id,
            pedido_id,
            producto_id,
            cantidad,
            precio_unitario,
            productos!items_pedido_producto_id_fkey (
              nombre,
              categoria,
              imagen_url
            )
          )
        `)
        .order('fecha_creacion', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast.error('Error al obtener los pedidos');
        return [];
      }

      console.log('Pedidos obtenidos:', data);
      return data as any[];
    } catch (error) {
      console.error('Unexpected error fetching orders:', error);
      toast.error('Error inesperado al obtener los pedidos');
      return [];
    }
  };

  const getOrderById = async (orderId: number): Promise<Order | null> => {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          items_pedido (
            id,
            pedido_id,
            producto_id,
            cantidad,
            precio_unitario,
            productos!items_pedido_producto_id_fkey (
              nombre,
              categoria,
              imagen_url
            )
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) {
        console.error('Error fetching order:', error);
        return null;
      }

      console.log('Pedido individual obtenido:', data);
      return data as any;
    } catch (error) {
      console.error('Unexpected error fetching order:', error);
      return null;
    }
  };

  return {
    createOrder,
    getOrders,
    getOrderById,
    isCreatingOrder
  };
};