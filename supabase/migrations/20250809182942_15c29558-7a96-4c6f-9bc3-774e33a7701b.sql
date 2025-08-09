-- Permitir inserción anónima en tabla usuarios
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.usuarios;

-- Nueva política para permitir insertar usuarios sin autenticación
CREATE POLICY "Allow anonymous user insertion" 
ON public.usuarios 
FOR INSERT 
WITH CHECK (true);

-- Mantener política existente para usuarios autenticados
CREATE POLICY "Users can insert their own profile" 
ON public.usuarios 
FOR INSERT 
WITH CHECK (auth.uid() = auth_id);