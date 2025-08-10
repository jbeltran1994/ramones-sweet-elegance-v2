# Configuración RLS para Sistema de Administrador

## Políticas de Seguridad a Nivel de Fila (RLS) para Roles de Usuario

### 1. Tabla usuarios - Agregar columna rol

Primero, necesitas agregar la columna `rol` a la tabla usuarios si no existe:

```sql
-- Agregar columna rol a la tabla usuarios
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS rol VARCHAR(10) DEFAULT 'user';

-- Crear tipo enum para roles (opcional pero recomendado)
CREATE TYPE user_role AS ENUM ('admin', 'user');
ALTER TABLE usuarios ALTER COLUMN rol TYPE user_role USING rol::user_role;
```

### 2. Políticas RLS para tabla usuarios

```sql
-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "usuarios_select_policy" ON usuarios;
DROP POLICY IF EXISTS "usuarios_insert_policy" ON usuarios;
DROP POLICY IF EXISTS "usuarios_update_policy" ON usuarios;

-- Habilitar RLS en la tabla usuarios
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Política SELECT: Los admins pueden ver todo, los usuarios solo su propio perfil
CREATE POLICY "usuarios_select_policy" ON usuarios
FOR SELECT USING (
  rol = 'admin' OR auth_id = auth.uid()
);

-- Política INSERT: Permitir inserción para nuevos registros
CREATE POLICY "usuarios_insert_policy" ON usuarios
FOR INSERT WITH CHECK (
  auth_id = auth.uid() OR 
  (SELECT rol FROM usuarios WHERE auth_id = auth.uid()) = 'admin'
);

-- Política UPDATE: Los admins pueden actualizar todo, los usuarios solo su perfil
CREATE POLICY "usuarios_update_policy" ON usuarios
FOR UPDATE USING (
  rol = 'admin' OR auth_id = auth.uid()
);
```

### 3. Políticas RLS para tabla productos

```sql
-- Habilitar RLS y crear políticas para productos
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- Solo admins pueden gestionar productos
CREATE POLICY "productos_admin_all" ON productos
FOR ALL USING (
  (SELECT rol FROM usuarios WHERE auth_id = auth.uid()) = 'admin'
);

-- Usuarios pueden ver productos activos
CREATE POLICY "productos_public_select" ON productos
FOR SELECT USING (activo = true);
```

### 4. Políticas RLS para tabla pedidos

```sql
-- Habilitar RLS para pedidos
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Los admins pueden ver todos los pedidos
CREATE POLICY "pedidos_admin_all" ON pedidos
FOR ALL USING (
  (SELECT rol FROM usuarios WHERE auth_id = auth.uid()) = 'admin'
);

-- Los usuarios pueden ver y crear sus propios pedidos
CREATE POLICY "pedidos_user_own" ON pedidos
FOR ALL USING (
  auth_user_id = auth.uid()
);

-- Permitir inserción de pedidos anónimos
CREATE POLICY "pedidos_anonymous_insert" ON pedidos
FOR INSERT WITH CHECK (
  auth_user_id IS NULL OR auth_user_id = auth.uid()
);
```

### 5. Políticas RLS para tabla items_pedido

```sql
-- Habilitar RLS para items de pedido
ALTER TABLE items_pedido ENABLE ROW LEVEL SECURITY;

-- Los admins pueden ver todos los items
CREATE POLICY "items_pedido_admin_all" ON items_pedido
FOR ALL USING (
  (SELECT rol FROM usuarios WHERE auth_id = auth.uid()) = 'admin'
);

-- Los usuarios pueden gestionar items de sus propios pedidos
CREATE POLICY "items_pedido_user_own" ON items_pedido
FOR ALL USING (
  pedido_id IN (
    SELECT id FROM pedidos WHERE auth_user_id = auth.uid()
  )
);

-- Permitir inserción de items para pedidos anónimos
CREATE POLICY "items_pedido_anonymous_insert" ON items_pedido
FOR INSERT WITH CHECK (
  pedido_id IN (
    SELECT id FROM pedidos WHERE 
    auth_user_id IS NULL OR auth_user_id = auth.uid()
  )
);
```

### 6. Políticas RLS para tabla mensajes_contacto

```sql
-- Habilitar RLS para mensajes de contacto
ALTER TABLE mensajes_contacto ENABLE ROW LEVEL SECURITY;

-- Solo admins pueden ver y gestionar mensajes
CREATE POLICY "mensajes_contacto_admin_all" ON mensajes_contacto
FOR ALL USING (
  (SELECT rol FROM usuarios WHERE auth_id = auth.uid()) = 'admin'
);

-- Permitir inserción anónima de mensajes de contacto
CREATE POLICY "mensajes_contacto_anonymous_insert" ON mensajes_contacto
FOR INSERT WITH CHECK (true);
```

### 7. Crear usuario administrador inicial

```sql
-- Después de crear las políticas, crear un usuario admin inicial manualmente
-- (Este paso se debe hacer desde el panel de Supabase o usando la página /admin-setup)

-- Ejemplo de inserción manual de admin:
-- INSERT INTO usuarios (email, nombre, telefono, rol, auth_id) 
-- VALUES ('admin@ramones.uy', 'Administrador', '+598123456789', 'admin', 'AUTH_ID_FROM_SUPABASE_AUTH');
```

## Notas importantes:

1. **Aplicar en orden**: Ejecuta estas políticas en el orden mostrado
2. **Verificar tablas**: Asegúrate de que todas las tablas existan antes de aplicar las políticas
3. **Usuario inicial**: Usa la página `/admin-setup` para crear el primer administrador
4. **Seguridad**: Solo los administradores pueden acceder a las funciones de gestión operativa
5. **Público**: Los formularios de contacto y creación de pedidos siguen funcionando para usuarios anónimos

## Comandos de verificación:

```sql
-- Verificar que RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('usuarios', 'productos', 'pedidos', 'items_pedido', 'mensajes_contacto');

-- Ver políticas creadas
SELECT tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('usuarios', 'productos', 'pedidos', 'items_pedido', 'mensajes_contacto');
```