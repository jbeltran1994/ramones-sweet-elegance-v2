# Configuración de Base de Datos - Supabase

## Problema Identificado
La tabla `usuarios` no tiene la columna `rol` requerida por el sistema de autenticación.

## Solución Requerida en Supabase

### 1. Crear la tabla usuarios con las columnas necesarias

Ejecuta este SQL en el Editor SQL de Supabase:

```sql
-- Crear la tabla usuarios si no existe
CREATE TABLE IF NOT EXISTS public.usuarios (
    id BIGSERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    telefono TEXT,
    rol TEXT DEFAULT 'user' CHECK (rol IN ('admin', 'user')),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_usuarios_auth_id ON public.usuarios(auth_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON public.usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON public.usuarios(rol);

-- Habilitar RLS
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios puedan ver y editar su propio perfil
CREATE POLICY "Users can view their own profile" ON public.usuarios
    FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Users can update their own profile" ON public.usuarios
    FOR UPDATE USING (auth.uid() = auth_id);

-- Política para que cualquier usuario autenticado pueda insertar su perfil
CREATE POLICY "Users can insert their own profile" ON public.usuarios
    FOR INSERT WITH CHECK (auth.uid() = auth_id);

-- Política para que los admins puedan ver todos los usuarios
CREATE POLICY "Admins can view all users" ON public.usuarios
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE auth_id = auth.uid() AND rol = 'admin'
        )
    );

-- Política para que los admins puedan actualizar roles
CREATE POLICY "Admins can update user roles" ON public.usuarios
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE auth_id = auth.uid() AND rol = 'admin'
        )
    );
```

### 2. Verificar que las políticas RLS estén aplicadas

Revisa que todas las políticas estén correctamente aplicadas en la sección de Authentication > Policies en Supabase.

### 3. Reiniciar el cache de Supabase

En el dashboard de Supabase, ve a Settings > API y haz clic en "Restart" para actualizar el cache del schema.

## Estado Actual del Problema

- ✅ Usuarios se crean correctamente en auth.users
- ❌ Error al insertar en tabla usuarios por falta de columna `rol`
- ❌ Los usuarios no pueden hacer login porque no existe su perfil

## Después de aplicar la migración

1. Los nuevos registros funcionarán correctamente
2. Los usuarios existentes en auth necesitarán que se cree manualmente su perfil en la tabla usuarios
3. El sistema de roles admin/user funcionará completamente