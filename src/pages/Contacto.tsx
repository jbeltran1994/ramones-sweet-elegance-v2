import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { contactFormSchema, type ContactFormData } from "@/lib/validations";
import { useContactMessages } from "@/hooks/useContactMessages";

const Contacto = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    nombre: '',
    telefono: '',
    email: '',
    mensaje: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { createContactMessage } = useContactMessages();

  const handleInputChange = (field: keyof ContactFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('🔵 Starting form submission with data:', formData);
      // Validate form data
      const validatedData = contactFormSchema.parse(formData);
      console.log('✅ Form data validated:', validatedData);
      
      // Save message to database
      console.log('🔄 Calling createContactMessage...');
      const result = await createContactMessage(validatedData);
      console.log('📋 createContactMessage result:', result);
      
      if (result) {
        // Reset form only if message was saved successfully
        setFormData({
          nombre: '',
          telefono: '',
          email: '',
          mensaje: ''
        });
      }
    } catch (error: any) {
      console.error('🔴 Error in handleSubmit:', error);
      if (error.errors) {
        // Show validation errors
        const firstError = error.errors[0];
        console.error('📝 Validation error:', firstError);
        toast({
          title: "Error en el formulario",
          description: firstError.message,
          variant: "destructive"
        });
      } else {
        console.error('💀 Unknown error:', error);
        toast({
          title: "Error",
          description: `Hubo un problema al enviar el mensaje: ${error.message || 'Error desconocido'}`,
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-luxury font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            Contáctanos
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-elegant">
            Estamos aquí para hacer realidad tus momentos más dulces. 
            Contáctanos para pedidos especiales o cualquier consulta.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="p-8 bg-gradient-card shadow-elegant">
            <h2 className="text-2xl font-luxury font-semibold mb-6">Envíanos un mensaje</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre" className="text-sm font-elegant font-medium">Nombre</Label>
                  <Input 
                    id="nombre"
                    placeholder="Tu nombre" 
                    className="bg-background/50"
                    value={formData.nombre}
                    onChange={handleInputChange('nombre')}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telefono" className="text-sm font-elegant font-medium">Teléfono</Label>
                  <Input 
                    id="telefono"
                    placeholder="Tu teléfono" 
                    className="bg-background/50"
                    value={formData.telefono}
                    onChange={handleInputChange('telefono')}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-elegant font-medium">Email</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="tu@email.com" 
                  className="bg-background/50"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  required
                />
              </div>
              <div>
                <Label htmlFor="mensaje" className="text-sm font-elegant font-medium">Mensaje</Label>
                <Textarea 
                  id="mensaje"
                  placeholder="Cuéntanos sobre tu pedido especial o consulta..." 
                  rows={4}
                  className="bg-background/50"
                  value={formData.mensaje}
                  onChange={handleInputChange('mensaje')}
                  required
                />
              </div>
              <Button 
                type="submit"
                variant="premium" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
              </Button>
            </form>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-card shadow-soft">
              <div className="flex items-start space-x-4">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-elegant font-semibold mb-1">Ubicación</h3>
                  <p className="text-muted-foreground">
                    Avenida Siempreviva 742<br />
                    Montevideo, Uruguay
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-soft">
              <div className="flex items-start space-x-4">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-elegant font-semibold mb-1">Teléfono</h3>
                  <p className="text-muted-foreground">+1976 87 91 08</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-soft">
              <div className="flex items-start space-x-4">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-elegant font-semibold mb-1">Email</h3>
                  <p className="text-muted-foreground">hola@ramones.uy</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-soft">
              <div className="flex items-start space-x-4">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-elegant font-semibold mb-1">Horarios</h3>
                  <div className="text-muted-foreground space-y-1">
                    <p>Lunes - Viernes: 9:00 - 19:00</p>
                    <p>Sábados: 10:00 - 18:00</p>
                    <p>Domingos: 11:00 - 16:00</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Special Orders Section */}
        <Card className="mt-12 p-8 bg-gradient-accent text-center shadow-premium">
          <h2 className="text-2xl font-luxury font-semibold mb-4">Pedidos Especiales</h2>
          <p className="text-accent-foreground mb-6 max-w-2xl mx-auto font-elegant">
            ¿Tienes un evento especial? Creamos tortas y postres personalizados para bodas, 
            cumpleaños, celebraciones corporativas y más. Contáctanos con al menos 48 horas de anticipación.
          </p>
          <Button variant="hero" size="lg">
            Solicitar Cotización
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Contacto;