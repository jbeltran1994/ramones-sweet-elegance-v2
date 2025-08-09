import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, Users, Target, FileText } from "lucide-react";

const ProjectTracking = () => {
  const decisions = [
    {
      date: "2024-01-15",
      title: "Selección de paleta de colores premium",
      description: "Se adoptó una paleta pastel con rosa dorado, lavanda y champagne para transmitir elegancia y lujo.",
      status: "implemented"
    },
    {
      date: "2024-01-15", 
      title: "Arquitectura de componentes modulares",
      description: "Sistema de diseño centralizado en index.css y tailwind.config.ts para consistencia visual.",
      status: "implemented"
    },
    {
      date: "2024-01-15",
      title: "Navegación responsive con mobile-first",
      description: "Implementación de navegación adaptativa con menú hamburguesa para dispositivos móviles.",
      status: "implemented"
    }
  ];

  const issues = [
    {
      date: "2024-01-15",
      title: "Error en variante de botón 'premium'",
      description: "TypeScript error por variante no definida en buttonVariants",
      resolution: "Agregada variante 'premium' y 'hero' al sistema de botones",
      status: "resolved"
    }
  ];

  const stakeholderRequests = [
    {
      date: "2024-01-15",
      priority: "high",
      request: "Aplicación web para boutique de postres premium",
      details: "Catálogo de productos, carrito, checkout sin pagos, registro de pedidos en BD",
      status: "in-progress"
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

  const roadmap = [
    {
      phase: "Fase 1 - Fundación",
      status: "completed",
      items: [
        "✅ Sistema de diseño premium",
        "✅ Navegación responsive", 
        "✅ Páginas base (Home, Contacto)",
        "✅ Seguimiento del proyecto"
      ]
    },
    {
      phase: "Fase 2 - Core Features",
      status: "pending",
      items: [
        "🔄 Integración con Supabase",
        "🔄 Sistema de productos y catálogo",
        "🔄 Carrito de compras persistente",
        "🔄 Flujo de checkout"
      ]
    },
    {
      phase: "Fase 3 - Advanced",
      status: "pending", 
      items: [
        "⏳ Sistema de usuarios opcional",
        "⏳ Gestión de pedidos",
        "⏳ Panel administrativo",
        "⏳ Notificaciones y seguimiento"
      ]
    }
  ];

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
              <h2 className="text-2xl font-luxury font-semibold">Roadmap - Próximos Pasos</h2>
            </div>
            <div className="space-y-6">
              {roadmap.map((phase, index) => (
                <div key={index} className="border rounded-lg p-4 bg-background/50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-elegant font-semibold text-lg">{phase.phase}</h3>
                    {getStatusBadge(phase.status)}
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
        </div>
      </div>
    </div>
  );
};

export default ProjectTracking;