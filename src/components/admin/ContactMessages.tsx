import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Eye, Check, Clock, AlertCircle, Mail, Phone, User, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactMessage {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  mensaje: string;
  estado: 'pendiente' | 'en_proceso' | 'respondido';
  fecha_creacion: string;
  fecha_respuesta?: string;
  respuesta?: string;
}

// Mock data para demo
const mockMessages: ContactMessage[] = [
  {
    id: 1,
    nombre: "Ana García",
    telefono: "+598 99 123 456",
    email: "ana.garcia@email.com",
    mensaje: "Hola! Quisiera hacer un pedido especial para el cumpleaños de mi hija. Necesito una torta de unicornio para 20 personas. ¿Pueden ayudarme?",
    estado: "pendiente",
    fecha_creacion: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    nombre: "Carlos Rodríguez",
    telefono: "+598 98 765 432",
    email: "carlos.rodriguez@empresa.com",
    mensaje: "Buenos días, necesito cotizar postres para un evento corporativo de 50 personas. ¿Qué opciones tienen disponibles?",
    estado: "en_proceso",
    fecha_creacion: "2024-01-14T14:15:00Z"
  },
  {
    id: 3,
    nombre: "María López",
    telefono: "+598 97 555 333",
    email: "maria.lopez@email.com",
    mensaje: "¡Excelente servicio! Los postres estuvieron deliciosos en nuestra boda. Muchas gracias por todo.",
    estado: "respondido",
    fecha_creacion: "2024-01-13T16:45:00Z",
    fecha_respuesta: "2024-01-13T18:30:00Z",
    respuesta: "¡Muchas gracias María! Fue un placer ser parte de su día especial. Esperamos poder atenderlos nuevamente pronto."
  }
];

const ContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>(mockMessages);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>(mockMessages);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [responseText, setResponseText] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    let filtered = messages;

    if (searchTerm) {
      filtered = filtered.filter(message =>
        message.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.mensaje.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(message => message.estado === statusFilter);
    }

    setFilteredMessages(filtered);
  }, [searchTerm, statusFilter, messages]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendiente':
        return <Badge variant="destructive" className="gap-1"><Clock className="h-3 w-3" />Pendiente</Badge>;
      case 'en_proceso':
        return <Badge variant="secondary" className="gap-1"><AlertCircle className="h-3 w-3" />En Proceso</Badge>;
      case 'respondido':
        return <Badge variant="default" className="gap-1"><Check className="h-3 w-3" />Respondido</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleStatusChange = (messageId: number, newStatus: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, estado: newStatus as ContactMessage['estado'] }
          : msg
      )
    );
    toast({
      title: "Estado actualizado",
      description: "El estado del mensaje ha sido actualizado correctamente.",
    });
  };

  const handleResponse = (message: ContactMessage) => {
    if (!responseText.trim()) {
      toast({
        title: "Error",
        description: "Por favor, escribe una respuesta antes de enviar.",
        variant: "destructive"
      });
      return;
    }

    setMessages(prev =>
      prev.map(msg =>
        msg.id === message.id
          ? {
              ...msg,
              estado: 'respondido',
              fecha_respuesta: new Date().toISOString(),
              respuesta: responseText
            }
          : msg
      )
    );

    toast({
      title: "Respuesta enviada",
      description: `Se ha enviado la respuesta a ${message.email}`,
    });

    setResponseText("");
    setSelectedMessage(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-UY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-luxury font-bold bg-gradient-hero bg-clip-text text-transparent">
            Gestión de Mensajes
          </h2>
          <p className="text-muted-foreground font-elegant">
            Administra y responde los mensajes de contacto de los clientes
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o mensaje..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="en_proceso">En Proceso</SelectItem>
              <SelectItem value="respondido">Respondido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-destructive" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
              <p className="text-2xl font-bold text-destructive">
                {messages.filter(m => m.estado === 'pendiente').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-secondary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">En Proceso</p>
              <p className="text-2xl font-bold text-secondary">
                {messages.filter(m => m.estado === 'en_proceso').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Check className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Respondidos</p>
              <p className="text-2xl font-bold text-primary">
                {messages.filter(m => m.estado === 'respondido').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabla de mensajes */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Mensaje</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMessages.map((message) => (
              <TableRow key={message.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{message.nombre}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1 text-sm">
                      <Mail className="h-3 w-3" />
                      <span>{message.email}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{message.telefono}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="max-w-xs truncate text-sm">
                    {message.mensaje}
                  </p>
                </TableCell>
                <TableCell>
                  <Select
                    value={message.estado}
                    onValueChange={(value) => handleStatusChange(message.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="en_proceso">En Proceso</SelectItem>
                      <SelectItem value="respondido">Respondido</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(message.fecha_creacion)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedMessage(message)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Mensaje de {message.nombre}</DialogTitle>
                        <DialogDescription>
                          Recibido el {formatDate(message.fecha_creacion)}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Estado actual</Label>
                          <div className="mt-1">
                            {getStatusBadge(message.estado)}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Información de contacto</Label>
                          <div className="mt-1 space-y-1 text-sm">
                            <p><strong>Email:</strong> {message.email}</p>
                            <p><strong>Teléfono:</strong> {message.telefono}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Mensaje</Label>
                          <p className="mt-1 text-sm bg-muted p-3 rounded-md">
                            {message.mensaje}
                          </p>
                        </div>
                        {message.respuesta && (
                          <div>
                            <Label className="text-sm font-medium">Respuesta enviada</Label>
                            <p className="mt-1 text-sm bg-primary/10 p-3 rounded-md">
                              {message.respuesta}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Enviado el {message.fecha_respuesta && formatDate(message.fecha_respuesta)}
                            </p>
                          </div>
                        )}
                        {message.estado !== 'respondido' && (
                          <div>
                            <Label htmlFor="response" className="text-sm font-medium">
                              Escribir respuesta
                            </Label>
                            <Textarea
                              id="response"
                              placeholder="Escribe tu respuesta aquí..."
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              rows={4}
                              className="mt-1"
                            />
                            <Button
                              onClick={() => handleResponse(message)}
                              className="mt-2"
                              disabled={!responseText.trim()}
                            >
                              Enviar Respuesta
                            </Button>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default ContactMessages;