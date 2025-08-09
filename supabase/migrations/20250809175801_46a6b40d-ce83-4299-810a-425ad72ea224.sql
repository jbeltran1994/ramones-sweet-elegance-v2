-- CRITICAL SECURITY FIX: Enable Row Level Security on all tables
-- This prevents unrestricted access to sensitive data

-- Enable RLS on all existing tables
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items_pedido ENABLE ROW LEVEL SECURITY;

-- First, let's add a uuid column to usuarios table for proper auth integration
ALTER TABLE public.usuarios ADD COLUMN auth_id UUID UNIQUE;

-- Update pedidos to reference auth_id instead of bigint user_id
ALTER TABLE public.pedidos ADD COLUMN auth_user_id UUID;

-- Productos: Allow public read access for active products
CREATE POLICY "Anyone can view active products" 
ON public.productos 
FOR SELECT 
USING (activo = true);

-- Usuarios: Users can only see and edit their own profile data
CREATE POLICY "Users can view their own profile" 
ON public.usuarios 
FOR SELECT 
USING (auth.uid() = auth_id);

CREATE POLICY "Users can update their own profile" 
ON public.usuarios 
FOR UPDATE 
USING (auth.uid() = auth_id);

CREATE POLICY "Users can insert their own profile" 
ON public.usuarios 
FOR INSERT 
WITH CHECK (auth.uid() = auth_id);

-- Pedidos: Users can only see their own orders
CREATE POLICY "Users can view their own orders" 
ON public.pedidos 
FOR SELECT 
USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can create their own orders" 
ON public.pedidos 
FOR INSERT 
WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own orders" 
ON public.pedidos 
FOR UPDATE 
USING (auth.uid() = auth_user_id);

-- Allow anonymous users to create orders (for non-registered customers)
CREATE POLICY "Anonymous users can create orders" 
ON public.pedidos 
FOR INSERT 
WITH CHECK (auth_user_id IS NULL);

CREATE POLICY "Anonymous users can view orders by email" 
ON public.pedidos 
FOR SELECT 
USING (auth_user_id IS NULL AND cliente_email IS NOT NULL);

-- Items_pedido: Users can only access items from their own orders
CREATE POLICY "Users can view items from their own orders" 
ON public.items_pedido 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.pedidos 
    WHERE pedidos.id = items_pedido.pedido_id 
    AND (pedidos.auth_user_id = auth.uid() OR pedidos.auth_user_id IS NULL)
  )
);

CREATE POLICY "Users can add items to orders" 
ON public.items_pedido 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pedidos 
    WHERE pedidos.id = items_pedido.pedido_id 
    AND (pedidos.auth_user_id = auth.uid() OR pedidos.auth_user_id IS NULL)
  )
);

CREATE POLICY "Users can update items in orders" 
ON public.items_pedido 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.pedidos 
    WHERE pedidos.id = items_pedido.pedido_id 
    AND (pedidos.auth_user_id = auth.uid() OR pedidos.auth_user_id IS NULL)
  )
);

-- Add foreign key constraints for data integrity
ALTER TABLE public.items_pedido 
ADD CONSTRAINT fk_items_pedido_pedido 
FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id) ON DELETE CASCADE;

ALTER TABLE public.items_pedido 
ADD CONSTRAINT fk_items_pedido_producto 
FOREIGN KEY (producto_id) REFERENCES public.productos(id);