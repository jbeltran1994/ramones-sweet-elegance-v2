import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contacto = () => {
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
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-elegant font-medium mb-2">Nombre</label>
                  <Input placeholder="Tu nombre" className="bg-background/50" />
                </div>
                <div>
                  <label className="block text-sm font-elegant font-medium mb-2">Teléfono</label>
                  <Input placeholder="Tu teléfono" className="bg-background/50" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-elegant font-medium mb-2">Email</label>
                <Input type="email" placeholder="tu@email.com" className="bg-background/50" />
              </div>
              <div>
                <label className="block text-sm font-elegant font-medium mb-2">Mensaje</label>
                <Textarea 
                  placeholder="Cuéntanos sobre tu pedido especial o consulta..." 
                  rows={4}
                  className="bg-background/50"
                />
              </div>
              <Button variant="premium" className="w-full">
                Enviar Mensaje
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
                    Av. Las Condes 123<br />
                    Las Condes, Santiago
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-soft">
              <div className="flex items-start space-x-4">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-elegant font-semibold mb-1">Teléfono</h3>
                  <p className="text-muted-foreground">+56 9 1234 5678</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-soft">
              <div className="flex items-start space-x-4">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-elegant font-semibold mb-1">Email</h3>
                  <p className="text-muted-foreground">hola@ramones.cl</p>
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