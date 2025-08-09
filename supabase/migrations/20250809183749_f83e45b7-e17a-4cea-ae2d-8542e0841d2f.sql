-- Eliminar la política existente que puede estar causando conflictos
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.usuarios;

-- Recrear políticas RLS más específicas para la tabla usuarios
-- Política para usuarios autenticados que quieren crear su propio perfil
CREATE POLICY "Authenticated users can insert their own profile" 
ON public.usuarios 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = auth_id);

-- Política para permitir inserción anónima (para registros desde la web)
CREATE POLICY "Anonymous users can insert profiles" 
ON public.usuarios 
FOR INSERT 
TO anon
WITH CHECK (auth_id IS NULL);

-- Política más permisiva para usuarios autenticados que también pueden crear registros anónimos
CREATE POLICY "Authenticated users can insert anonymous profiles" 
ON public.usuarios 
FOR INSERT 
TO authenticated  
WITH CHECK (auth_id IS NULL OR auth.uid() = auth_id);