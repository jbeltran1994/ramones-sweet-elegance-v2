# Configuración de Base de Datos - Sistema de Mensajes de Contacto

## Tabla: mensajes_contacto

### 1. Creación de la Tabla

Ejecuta el siguiente SQL en tu panel de Supabase (SQL Editor):

```sql
-- Create the contact messages table
CREATE TABLE mensajes_contacto (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  telefono VARCHAR(15) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mensaje TEXT NOT NULL,
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_proceso', 'respondido')),
  respuesta TEXT,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_respuesta TIMESTAMP WITH TIME ZONE
);
```

### 2. Configuración de Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE mensajes_contacto ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to insert (for contact form)
CREATE POLICY "Anyone can insert contact messages" ON mensajes_contacto
  FOR INSERT TO public
  WITH CHECK (true);

-- Policy to allow authenticated users to read (for admin panel)
CREATE POLICY "Authenticated users can read contact messages" ON mensajes_contacto
  FOR SELECT TO authenticated
  USING (true);

-- Policy to allow authenticated users to update (for admin responses)
CREATE POLICY "Authenticated users can update contact messages" ON mensajes_contacto
  FOR UPDATE TO authenticated
  USING (true);
```

### 3. Índices para Performance

```sql
-- Create indexes for better performance
CREATE INDEX idx_mensajes_contacto_estado ON mensajes_contacto(estado);
CREATE INDEX idx_mensajes_contacto_fecha ON mensajes_contacto(fecha_creacion DESC);
CREATE INDEX idx_mensajes_contacto_email ON mensajes_contacto(email);
```

### 4. Estructura de la Tabla

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | BIGSERIAL | ID único auto-incrementable |
| `nombre` | VARCHAR(50) | Nombre del cliente |
| `telefono` | VARCHAR(15) | Teléfono de contacto |
| `email` | VARCHAR(255) | Email del cliente |
| `mensaje` | TEXT | Mensaje del cliente |
| `estado` | VARCHAR(20) | Estado: 'pendiente', 'en_proceso', 'respondido' |
| `respuesta` | TEXT | Respuesta del administrador (opcional) |
| `fecha_creacion` | TIMESTAMP | Fecha y hora de creación automática |
| `fecha_respuesta` | TIMESTAMP | Fecha y hora de respuesta (opcional) |

### 5. Flujo Operativo

#### Para Clientes (Público):
- **Acción permitida**: Insertar nuevos mensajes
- **Acceso**: Sin autenticación requerida
- **Formulario**: `/contacto` - sección "Envíanos un mensaje"

#### Para Administradores (Autenticados):
- **Acciones permitidas**: 
  - Leer todos los mensajes
  - Actualizar estado de mensajes
  - Responder a mensajes
- **Acceso**: Panel administrativo en `/admin/mensajes`
- **Funcionalidades**:
  - Filtros por estado, búsqueda por texto
  - Cambio de estados (pendiente → en proceso → respondido)
  - Sistema de respuestas con timestamp

### 6. Integración con la Aplicación

El hook `useContactMessages` maneja todas las operaciones:
- `createContactMessage()` - Crear nuevo mensaje desde el formulario
- `getContactMessages()` - Obtener lista de mensajes para admin
- `updateMessageStatus()` - Cambiar estado de mensaje
- `respondToMessage()` - Enviar respuesta y marcar como respondido

### 7. Verificación de Funcionamiento

Después de crear la tabla, verifica que:

1. **Formulario de contacto** (`/contacto`):
   - Permite enviar mensajes sin errores
   - Muestra toast de confirmación
   - Los datos se guardan en la tabla

2. **Panel administrativo** (`/admin/mensajes`):
   - Carga la lista de mensajes
   - Permite filtrar y buscar
   - Cambios de estado funcionan
   - Sistema de respuestas operativo

### 8. Troubleshooting

**Si hay errores de TypeScript**:
- El código usa `(supabase as any)` para evitar errores de tipos
- Una vez creada la tabla, Supabase regenerará los tipos automáticamente

**Si no aparecen los mensajes**:
- Verificar que las políticas RLS están configuradas correctamente
- Comprobar en la consola del navegador si hay errores de red
- Verificar que el usuario está autenticado para acceder al panel admin

### 9. Futuras Mejoras

- Notificaciones por email cuando llegan nuevos mensajes
- Plantillas de respuesta predefinidas
- Categorización de mensajes
- Sistema de prioridades
- Archivo de mensajes antiguos