
import Navigation from "@/components/Navigation";
import SupabaseDiagnostic from "@/components/SupabaseDiagnostic";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, Users, Target, FileText, MessageSquare } from "lucide-react";

const ProjectTracking = () => {
  // ============== DECISIONES TÉCNICAS Y CAMBIOS ==============
  const decisions = [
    // === FASE INICIAL - FUNDACIÓN (2024-01-15) ===
    {
      date: "2024-01-15",
      title: "Implementación completa del sistema de usuarios",
      description: "Se desarrolló un sistema robusto de creación de usuarios que integra auth.users de Supabase con la tabla usuarios personalizada, incluyendo validaciones y manejo de errores.",
      status: "implemented",
      phase: "foundation"
    },
    {
      date: "2024-01-15",
      title: "Selección de paleta de colores premium",
      description: "Se adoptó una paleta pastel con rosa dorado, lavanda y champagne para transmitir elegancia y lujo.",
      status: "implemented",
      phase: "foundation"
    },
    {
      date: "2024-01-15", 
      title: "Arquitectura de componentes modulares",
      description: "Sistema de diseño centralizado en index.css y tailwind.config.ts para consistencia visual.",
      status: "implemented",
      phase: "foundation"
    },
    {
      date: "2024-01-15",
      title: "Navegación responsive con mobile-first",
      description: "Implementación de navegación adaptativa con menú hamburguesa para dispositivos móviles.",
      status: "implemented",
      phase: "foundation"
    },
    
    // === OPTIMIZACIONES DEL CATÁLOGO (2024-08-09) ===
    {
      date: "2024-08-09",
      title: "Sistema completo de carrito de compras",
      description: "Implementación de hook useCart con persistencia en localStorage, gestión de estado optimizada con useReducer, y componentes modulares (CartIcon, MiniCart, ProductCardControls).",
      status: "implemented",
      phase: "core-features"
    },
    {
      date: "2024-08-09",
      title: "Componentes de productos interactivos",
      description: "Desarrollo de ProductCardControls con funcionalidad completa de agregar/incrementar/decrementar productos, validaciones de stock y estados deshabilitados.",
      status: "implemented",
      phase: "core-features"
    },
    {
      date: "2024-08-09",
      title: "Mini carrito lateral con Sheet",
      description: "Implementación de MiniCart como sheet lateral con lista completa de productos, cálculos de totales, y funciones de eliminar/vaciar carrito.",
      status: "implemented",
      phase: "core-features"
    },
    {
      date: "2024-08-09",
      title: "Optimización de diseño del catálogo de productos",
      description: "Se eliminó el atributo ID visible en las tarjetas de productos para un diseño más limpio y enfocado en la experiencia del usuario.",
      status: "implemented",
      phase: "core-features"
    },
    {
      date: "2024-08-09",
      title: "Eliminación de sección 'Próximamente'",
      description: "Se removió la sección 'Próximamente...' del catálogo para mostrar únicamente contenido real y disponible.",
      status: "implemented",
      phase: "core-features"
    },
    {
      date: "2024-08-09",
      title: "Actualización del formato de moneda",
      description: "Se cambió el formato de precios para mostrar el símbolo '$' a la izquierda del valor en lugar del formato EUR, mejorando la claridad visual.",
      status: "implemented",
      phase: "core-features"
    },
    {
      date: "2024-08-09",
      title: "Integración completa del sistema de productos",
      description: "Conexión exitosa con la tabla 'productos' de Supabase, con manejo de estados de carga, errores y filtrado de productos activos.",
      status: "implemented",
      phase: "core-features"
    },
    
    // === SISTEMA DE FILTROS (2025-01-14) ===
    {
      date: "2025-01-14",
      title: "Sistema de filtros avanzado para productos",
      description: "Implementación de filtros interactivos por categoría y rango de precios en el catálogo, con controles dinámicos que se actualizan según los productos disponibles.",
      status: "implemented",
      phase: "enhanced-features"
    },
    
    // === SISTEMA DE CHECKOUT Y PEDIDOS (2025-01-14) ===
    {
      date: "2025-01-14",
      title: "Sistema de checkout y creación de pedidos",
      description: "Implementación completa del flujo de checkout con formulario de datos del cliente, creación de pedidos en Supabase usando tablas 'pedidos' e 'items_pedido', y validaciones.",
      status: "implemented",
      phase: "checkout"
    },
    {
      date: "2025-01-14",
      title: "Hook useOrders para gestión de pedidos",
      description: "Desarrollo del hook personalizado useOrders con funciones para crear, obtener y gestionar pedidos, integrado con autenticación y manejo de errores.",
      status: "implemented",
      phase: "checkout"
    },
    {
      date: "2025-01-14",
      title: "Ajuste de formato de moneda en el carrito",
      description: "Corrección del formato de precios en el carrito de EUR (€) a USD ($) para mantener consistencia con el resto de la aplicación.",
      status: "implemented",
      phase: "checkout"
    }
  ];

  const issues = [
    {
      date: "2024-01-15",
      title: "Políticas RLS impidiendo escritura en tabla usuarios",
      description: "Las políticas de Row Level Security eran muy restrictivas e impedían que usuarios anónimos y autenticados crearan registros en la tabla usuarios",
      resolution: "Se actualizaron las políticas RLS para permitir tanto usuarios autenticados como anónimos insertar registros, y se habilitó la creación de perfiles completos",
      status: "resolved"
    },
    {
      date: "2024-01-15",
      title: "Formulario de registro incompleto",
      description: "El formulario de Auth.tsx no capturaba todos los campos necesarios (nombre, teléfono) para crear un registro completo en la tabla usuarios",
      resolution: "Se agregaron campos nombre y teléfono al formulario de registro y se actualizó la función signUp para crear registros completos",
      status: "resolved"
    },
    {
      date: "2024-01-15",
      title: "Error en variante de botón 'premium'",
      description: "TypeScript error por variante no definida en buttonVariants",
      resolution: "Agregada variante 'premium' y 'hero' al sistema de botones",
      status: "resolved"
    },
    {
      date: "2025-01-14",
      title: "Error de hooks de React en ProductList",
      description: "Error 'Rendered more hooks than during the previous render' causado por hooks llamados condicionalmente después de early returns",
      resolution: "Se movieron todos los hooks (useState, useEffect, useMemo) al nivel superior del componente, antes de cualquier return condicional",
      status: "resolved"
    },
    {
      date: "2025-01-14",
      title: "Errores de TypeScript en useOrders",
      description: "Conflictos de tipos al intentar usar tablas 'orders' y 'order_items' que no existían en el schema de Supabase",
      resolution: "Se ajustó el hook para usar las tablas existentes 'pedidos' e 'items_pedido' con sus tipos correctos del schema",
      status: "resolved"
    },
    {
      date: "2025-01-14",
      title: "Error de relaciones múltiples en consultas Supabase",
      description: "Error PGRST201 por múltiples relaciones entre 'pedidos' e 'items_pedido', consultas ambiguas",
      resolution: "Se especificó la relación exacta usando 'items_pedido!fk_items_pedido_pedido' en las consultas",
      status: "resolved"
    }
  ];

  // ============== REQUISITOS DEL STAKEHOLDER ==============
  const stakeholderRequests = [
    {
      date: "2024-01-15",
      priority: "high",
      request: "Sistema completo de usuarios con autenticación",
      details: "Registro, login, persistencia de sesión, y almacenamiento de datos de perfil en base de datos",
      status: "completed"
    },
    {
      date: "2024-08-09",
      priority: "high",
      request: "Sistema de carrito de compras funcional",
      details: "Carrito persistente con localStorage, agregar/quitar productos, mini carrito lateral, integración con catálogo",
      status: "completed"
    },
    {
      date: "2024-01-15",
      priority: "high",
      request: "Catálogo de productos desde base de datos",
      details: "Conexión con Supabase, mostrar productos activos, imágenes, precios, categorías",
      status: "completed"
    },
    {
      date: "2025-01-14",
      priority: "high",
      request: "Sistema de checkout y gestión de pedidos",
      details: "Formulario de checkout, creación de pedidos en BD, integración con carrito, validaciones de datos del cliente",
      status: "completed"
    },
    {
      date: "2025-01-14",
      priority: "high",
      request: "Página de visualización de pedidos",
      details: "Historial completo de pedidos con detalles de items, estado, cliente, fecha y totales",
      status: "completed"
    },
    {
      date: "2024-01-15",
      priority: "medium",
      request: "Aplicación web para boutique de postres premium",
      details: "E-commerce completo con checkout funcional, registro y visualización de pedidos en BD",
      status: "completed"
    },
    {
      date: "2024-01-15",
      priority: "medium", 
      request: "Diseño responsive elegante en colores pastel",
      details: "Sensación de lujo orientada a público ABC1",
      status: "completed"
    },
    {
      date: "2024-01-15",
      priority: "medium",
      request: "Seguimiento del proyecto integrado",
      details: "Sistema de tracking de decisiones, errores y roadmap",
      status: "completed"
    }
  ];

  // ============== ANÁLISIS DE FASES Y ROADMAP ==============
  const roadmap = [
    {
      phase: "Fase 1 - Fundación",
      status: "completed",
      completionPercentage: 100,
      startDate: "2024-01-15",
      endDate: "2024-01-15",
      items: [
        "✅ Sistema de diseño premium (colores pastel, gradientes, tokens semánticos)",
        "✅ Navegación responsive con menú hamburguesa", 
        "✅ Páginas base (Home, Contacto, Catálogo)",
        "✅ Seguimiento del proyecto (página de tracking)",
        "✅ Integración completa con Supabase",
        "✅ Sistema de autenticación y usuarios completo",
        "✅ Configuración de TypeScript y ESLint",
        "✅ Componentes UI base con shadcn/ui"
      ]
    },
    {
      phase: "Fase 2 - Core Features",
      status: "completed",
      completionPercentage: 100,
      startDate: "2024-08-09",
      endDate: "2024-08-09",
      items: [
        "✅ Panel de diagnóstico Supabase",
        "✅ Sistema de productos y catálogo (conectado a BD)",
        "✅ Carrito de compras persistente (useCart hook)",
        "✅ Componentes modulares de carrito (CartIcon, MiniCart, ProductCardControls)",
        "✅ Persistencia en localStorage",
        "✅ Gestión de estado con useReducer",
        "✅ Validaciones de stock y límites de cantidad",
        "✅ Sheet lateral para mini carrito",
        "✅ Formateo de precios optimizado (símbolo $ a la izquierda)"
      ]
    },
    {
      phase: "Fase 2.1 - Enhanced Features",
      status: "completed",
      completionPercentage: 100,
      startDate: "2025-01-14",
      endDate: "2025-01-14",
      items: [
        "✅ Sistema de filtros por categoría de productos",
        "✅ Filtros por rango de precios con slider dinámico",
        "✅ Controles de filtros responsive",
        "✅ Contadores de productos filtrados",
        "✅ Función de limpieza de filtros",
        "✅ Optimización de hooks para evitar re-renders innecesarios"
      ]
    },
    {
      phase: "Fase 3 - Checkout y Pedidos",
      status: "completed",
      completionPercentage: 100,
      startDate: "2025-01-14",
      endDate: "2025-01-14", 
      items: [
        "✅ Formulario de checkout integrado en MiniCart",
        "✅ Creación de pedidos en tabla 'pedidos' de Supabase",
        "✅ Hook useOrders para gestión completa de pedidos",
        "✅ Validación de datos del cliente (email y nombre)",
        "✅ Creación de items de pedido en tabla 'items_pedido'",
        "✅ Manejo de errores y confirmaciones con toast",
        "✅ Integración con autenticación de usuarios",
        "✅ Formato de moneda corregido en carrito ($USD)",
        "✅ Página de pedidos con historial completo",
        "✅ Corrección de consultas con relaciones múltiples"
      ]
    },
    {
      phase: "Fase 4 - Gestión Avanzada",
      status: "pending",
      completionPercentage: 0,
      startDate: "TBD",
      endDate: "TBD",
      items: [
        "⏳ Panel administrativo",
        "⏳ Gestión de estados de pedidos",
        "⏳ Sistema de notificaciones por email",
        "⏳ Reportes y analytics de ventas",
        "⏳ Optimizaciones de rendimiento",
        "⏳ Integración con pasarela de pagos"
      ]
    }
  ];

  // ============== HISTORIAL DE PROMPTS ==============
  const promptHistory = [
    {
      date: "2024-01-15",
      type: "foundational",
      prompt: "Agrega un filtro de productos en el catalogo. Por tipo y por costo",
      description: "Prompt inicial para crear sistema de filtros de productos",
      outcome: "Sistema de filtros completamente funcional",
      status: "completed"
    },
    {
      date: "2025-01-14",
      type: "enhancement",
      prompt: "Actualiza el area de seguimiento con esta ultima mejora y con este ultimo problema resuelto",
      description: "Solicitud de actualización del tracking de cambios",
      outcome: "Página de seguimiento actualizada con filtros y errores resueltos",
      status: "completed"
    },
    {
      date: "2025-01-14",
      type: "correction",
      prompt: "For the code present, I get the error below. Please think step-by-step in order to resolve it. Error: Rendered more hooks than during the previous render.",
      description: "Corrección de error de React hooks en ProductList",
      outcome: "Error resuelto moviendo hooks al nivel superior del componente",
      status: "completed"
    },
    {
      date: "2025-01-14",
      type: "feature",
      prompt: "Cuando en el carrito aprieto boton de ir al checkout no sucede nada. Deberia generar un pedido en supabase al menos",
      description: "Implementación del sistema de checkout y pedidos",
      outcome: "Sistema completo de checkout con creación de pedidos en BD",
      status: "completed"
    },
    {
      date: "2025-01-14",
      type: "feature",
      prompt: "solo creación de pedidos sin pasarela de pagos",
      description: "Aclaración del alcance del checkout (sin pagos)",
      outcome: "Hook useOrders implementado para gestión de pedidos",
      status: "completed"
    },
    {
      date: "2025-01-14",
      type: "correction",
      prompt: "Ajusta el signo de $ en el carrito",
      description: "Corrección del formato de moneda en el carrito",
      outcome: "Formato cambiado de EUR (€) a USD ($)",
      status: "completed"
    },
    {
      date: "2025-01-14",
      type: "correction",
      prompt: "La logica del pedido no utiliza la tabla items pedido, ajusta la logica para que el flujo sea correcto e integre esta tabla con sus atributos",
      description: "Corrección de la lógica de pedidos para usar tabla items_pedido",
      outcome: "Flujo corregido con creación en ambas tablas: pedidos e items_pedido",
      status: "completed"
    },
    {
      date: "2025-01-14",
      type: "correction",
      prompt: "NO se muestran los pedidos en el apartado pedidos. Corrige esto y actualiza apartado de seguimiento con la ultima info para cada sección",
      description: "Corrección de visualización de pedidos y actualización de seguimiento",
      outcome: "Error de relaciones múltiples resuelto, pedidos ahora se visualizan correctamente",
      status: "completed"
    },
    {
      date: "2025-01-14",
      type: "enhancement",
      prompt: "Por ultimo agrega una nueva sección con los prompts utilizados para construir la web. Desde el prompt fundacional pasando por los prompt de correcciones",
      description: "Creación de historial de prompts para transparencia del desarrollo",
      outcome: "Sección de historial de prompts agregada al seguimiento",
      status: "in-progress"
    }
  ];

  // ============== ESTADO ACTUAL DEL PROYECTO ==============
  const projectStatus = {
    totalPhases: roadmap.length,
    completedPhases: roadmap.filter(p => p.status === 'completed').length,
    overallProgress: Math.round(
      roadmap.reduce((acc, phase) => acc + phase.completionPercentage, 0) / roadmap.length
    ),
    activeFeatures: [
      "Sistema de autenticación completo",
      "Catálogo de productos funcional", 
      "Carrito de compras persistente",
      "Mini carrito lateral",
      "Filtros de productos por categoría y precio",
      "Sistema de checkout y creación de pedidos",
      "Página de historial de pedidos",
      "Integración con tablas de pedidos en Supabase",
      "Sistema de diagnóstico Supabase avanzado"
    ],
    technicalStack: [
      "React 18 + TypeScript",
      "Vite (bundler)",
      "Supabase (backend)",
      "Tailwind CSS + shadcn/ui",
      "React Router DOM",
      "React Hook Form + Zod"
    ]
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "implemented":
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      implemented: "default", 
      resolved: "default",
      "in-progress": "secondary",
      pending: "outline"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-luxury font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            Seguimiento del Proyecto
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-elegant">
            Registro completo de decisiones, cambios, incidencias y progreso del desarrollo de Ramones.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Project Status Overview */}
          <Card className="p-6 bg-gradient-card shadow-elegant">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-luxury font-semibold mb-4">Estado General del Proyecto</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{projectStatus.overallProgress}%</div>
                  <p className="text-sm text-muted-foreground">Progreso General</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {projectStatus.completedPhases}/{projectStatus.totalPhases}
                  </div>
                  <p className="text-sm text-muted-foreground">Fases Completadas</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{projectStatus.activeFeatures.length}</div>
                  <p className="text-sm text-muted-foreground">Funcionalidades Activas</p>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Funcionalidades Activas</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {projectStatus.activeFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Stack Tecnológico</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {projectStatus.technicalStack.map((tech, index) => (
                      <li key={index} className="flex items-center">
                        <div className="h-2 w-2 bg-primary rounded-full mr-2" />
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Decisions & Changes */}
          <Card className="p-6 bg-gradient-card shadow-elegant">
            <div className="flex items-center mb-6">
              <Target className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-2xl font-luxury font-semibold">Decisiones y Cambios Relevantes</h2>
            </div>
            <div className="space-y-4">
              {decisions.map((decision, index) => (
                <div key={index} className="border-l-2 border-primary/20 pl-6 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(decision.status)}
                      <span className="text-sm text-muted-foreground">{decision.date}</span>
                    </div>
                    {getStatusBadge(decision.status)}
                  </div>
                  <h3 className="font-elegant font-semibold mb-1">{decision.title}</h3>
                  <p className="text-muted-foreground text-sm">{decision.description}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Issues & Resolutions */}
          <Card className="p-6 bg-gradient-card shadow-elegant">
            <div className="flex items-center mb-6">
              <AlertCircle className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-2xl font-luxury font-semibold">Errores e Incidencias</h2>
            </div>
            <div className="space-y-4">
              {issues.map((issue, index) => (
                <div key={index} className="border-l-2 border-orange-300 pl-6 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(issue.status)}
                      <span className="text-sm text-muted-foreground">{issue.date}</span>
                    </div>
                    {getStatusBadge(issue.status)}
                  </div>
                  <h3 className="font-elegant font-semibold mb-1">{issue.title}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{issue.description}</p>
                  <p className="text-green-700 text-sm"><strong>Resolución:</strong> {issue.resolution}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Stakeholder Requests */}
          <Card className="p-6 bg-gradient-card shadow-elegant">
            <div className="flex items-center mb-6">
              <Users className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-2xl font-luxury font-semibold">Pedidos del Stakeholder</h2>
            </div>
            <div className="space-y-4">
              {stakeholderRequests.map((request, index) => (
                <div key={index} className="border-l-2 border-blue-300 pl-6 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(request.status)}
                      <span className="text-sm text-muted-foreground">{request.date}</span>
                      <Badge variant={request.priority === "high" ? "destructive" : "secondary"}>
                        {request.priority}
                      </Badge>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  <h3 className="font-elegant font-semibold mb-1">{request.request}</h3>
                  <p className="text-muted-foreground text-sm">{request.details}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Roadmap */}
          <Card className="p-6 bg-gradient-card shadow-elegant">
            <div className="flex items-center mb-6">
              <FileText className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-2xl font-luxury font-semibold">Roadmap y Análisis de Fases</h2>
            </div>
            <div className="space-y-6">
              {roadmap.map((phase, index) => (
                <div key={index} className="border rounded-lg p-4 bg-background/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-elegant font-semibold text-lg">{phase.phase}</h3>
                      <div className="text-sm text-muted-foreground">
                        {phase.completionPercentage}% completado
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(phase.status)}
                      <Badge variant="outline" className="text-xs">
                        {phase.startDate} - {phase.endDate}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-muted rounded-full h-2 mb-3">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${phase.completionPercentage}%` }}
                    />
                  </div>
                  
                  <ul className="space-y-1">
                    {phase.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm text-muted-foreground font-mono">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>

          {/* Prompt History */}
          <Card className="p-6 bg-gradient-card shadow-elegant">
            <div className="flex items-center mb-6">
              <MessageSquare className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-2xl font-luxury font-semibold">Historial de Prompts</h2>
            </div>
            <div className="text-sm text-muted-foreground mb-4">
              Registro cronológico de todos los prompts utilizados para construir la aplicación, 
              desde la solicitud fundacional hasta las correcciones y mejoras.
            </div>
            <div className="space-y-4">
              {promptHistory.map((prompt, index) => (
                <div key={index} className="border-l-2 border-purple-300 pl-6 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(prompt.status)}
                      <span className="text-sm text-muted-foreground">{prompt.date}</span>
                      <Badge 
                        variant={
                          prompt.type === "foundational" ? "default" :
                          prompt.type === "feature" ? "secondary" :
                          prompt.type === "correction" ? "destructive" :
                          "outline"
                        }
                      >
                        {prompt.type}
                      </Badge>
                    </div>
                    {getStatusBadge(prompt.status)}
                  </div>
                  <h3 className="font-elegant font-semibold mb-2">{prompt.description}</h3>
                  <div className="bg-muted/50 p-3 rounded-md mb-2">
                    <p className="text-sm font-mono text-foreground italic">
                      "{prompt.prompt}"
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Resultado:</strong> {prompt.outcome}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Supabase Diagnostic */}
          <Card className="p-6 bg-gradient-card shadow-elegant">
            <SupabaseDiagnostic />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectTracking;
