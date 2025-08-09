-- CRITICAL SECURITY FIX: Enable Row Level Security on all tables
-- This prevents unrestricted access to sensitive data

-- Enable RLS on all existing tables
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items_pedido ENABLE ROW LEVEL SECURITY;

-- Productos: Allow public read access, no write access for now (admin-only later)
CREATE POLICY "Anyone can view active products" 
ON public.productos 
FOR SELECT 
USING (activo = true);

-- Usuarios: Users can only see and edit their own profile data
CREATE POLICY "Users can view their own profile" 
ON public.usuarios 
FOR SELECT 
USING (auth.uid()::bigint = id);

CREATE POLICY "Users can update their own profile" 
ON public.usuarios 
FOR UPDATE 
USING (auth.uid()::bigint = id);

CREATE POLICY "Users can insert their own profile" 
ON public.usuarios 
FOR INSERT 
WITH CHECK (auth.uid()::bigint = id);

-- Pedidos: Users can only see their own orders
CREATE POLICY "Users can view their own orders" 
ON public.pedidos 
FOR SELECT 
USING (auth.uid()::bigint = user_id);

CREATE POLICY "Users can create their own orders" 
ON public.pedidos 
FOR INSERT 
WITH CHECK (auth.uid()::bigint = user_id);

CREATE POLICY "Users can update their own orders" 
ON public.pedidos 
FOR UPDATE 
USING (auth.uid()::bigint = user_id);

-- Items_pedido: Users can only access items from their own orders
CREATE POLICY "Users can view items from their own orders" 
ON public.items_pedido 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.pedidos 
    WHERE pedidos.id = items_pedido.pedido_id 
    AND pedidos.user_id = auth.uid()::bigint
  )
);

CREATE POLICY "Users can add items to their own orders" 
ON public.items_pedido 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pedidos 
    WHERE pedidos.id = items_pedido.pedido_id 
    AND pedidos.user_id = auth.uid()::bigint
  )
);

CREATE POLICY "Users can update items in their own orders" 
ON public.items_pedido 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.pedidos 
    WHERE pedidos.id = items_pedido.pedido_id 
    AND pedidos.user_id = auth.uid()::bigint
  )
);

-- Add foreign key constraints for data integrity
ALTER TABLE public.pedidos 
ADD CONSTRAINT fk_pedidos_usuario 
FOREIGN KEY (user_id) REFERENCES public.usuarios(id);

ALTER TABLE public.items_pedido 
ADD CONSTRAINT fk_items_pedido_pedido 
FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id) ON DELETE CASCADE;

ALTER TABLE public.items_pedido 
ADD CONSTRAINT fk_items_pedido_producto 
FOREIGN KEY (producto_id) REFERENCES public.productos(id);