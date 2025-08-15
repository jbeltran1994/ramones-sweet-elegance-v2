-- Script SQL para agregar políticas administrativas a Supabase
-- Ejecutar este script en el SQL Editor de Supabase

-- Eliminar políticas existentes que puedan estar en conflicto
DROP POLICY IF EXISTS "Authenticated users can view all orders for admin" ON public.pedidos;
DROP POLICY IF EXISTS "Authenticated users can update any order for admin" ON public.pedidos;
DROP POLICY IF EXISTS "Authenticated users can delete any order for admin" ON public.pedidos;
DROP POLICY IF EXISTS "Authenticated users can view all order items for admin" ON public.items_pedido;
DROP POLICY IF EXISTS "Authenticated users can update any order items for admin" ON public.items_pedido;
DROP POLICY IF EXISTS "Authenticated users can delete any order items for admin" ON public.items_pedido;

-- Crear políticas para que usuarios autenticados puedan gestionar todos los pedidos
CREATE POLICY "Admin can view all orders" 
ON public.pedidos 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Admin can update any order" 
ON public.pedidos 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "Admin can delete any order" 
ON public.pedidos 
FOR DELETE 
TO authenticated 
USING (true);

-- Crear políticas para items_pedido también
CREATE POLICY "Admin can view all order items" 
ON public.items_pedido 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Admin can update any order items" 
ON public.items_pedido 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "Admin can delete any order items" 
ON public.items_pedido 
FOR DELETE 
TO authenticated 
USING (true);

-- Verificar que las políticas se crearon correctamente
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('pedidos', 'items_pedido')
ORDER BY tablename, policyname;