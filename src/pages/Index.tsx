import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Star, Heart, Award } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-ramones.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-up">
              <div>
                <h1 className="text-5xl lg:text-6xl font-luxury font-bold leading-tight">
                  <span className="bg-gradient-hero bg-clip-text text-transparent">
                    Ramones
                  </span>
                  <br />
                  <span className="text-foreground">Boutique</span>
                </h1>
                <p className="text-xl text-muted-foreground mt-6 font-elegant">
                  Postres artesanales premium creados con técnicas francesas 
                  tradicionales y los ingredientes más selectos.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="hero" size="lg" className="group">
                  <Link to="/catalogo">
                    Explorar Catálogo
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/contacto">Pedidos Especiales</Link>
                </Button>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground font-elegant">
                    5.0 • 200+ reseñas
                  </span>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in">
              <div className="absolute inset-0 bg-gradient-hero rounded-3xl blur-3xl opacity-20 animate-float"></div>
              <img 
                src={heroImage}
                alt="Exquisitos postres artesanales de Ramones Boutique"
                className="relative z-10 w-full rounded-3xl shadow-premium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-luxury font-bold mb-4">
              La Excelencia en Cada Bocado
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-elegant">
              Nos especializamos en crear momentos inolvidables a través 
              de sabores únicos y presentaciones excepcionales.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center bg-background shadow-elegant hover:shadow-premium transition-elegant">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-accent rounded-full mb-6">
                <Award className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-luxury font-semibold mb-4">Ingredientes Premium</h3>
              <p className="text-muted-foreground font-elegant">
                Seleccionamos cuidadosamente cada ingrediente, desde chocolates belgas 
                hasta frutas de temporada de productores locales.
              </p>
            </Card>

            <Card className="p-8 text-center bg-background shadow-elegant hover:shadow-premium transition-elegant">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-accent rounded-full mb-6">
                <Heart className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-luxury font-semibold mb-4">Hecho con Amor</h3>
              <p className="text-muted-foreground font-elegant">
                Cada postre es elaborado artesanalmente por nuestros maestros pasteleros, 
                con técnicas perfeccionadas durante generaciones.
              </p>
            </Card>

            <Card className="p-8 text-center bg-background shadow-elegant hover:shadow-premium transition-elegant">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-accent rounded-full mb-6">
                <Star className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-luxury font-semibold mb-4">Experiencia Única</h3>
              <p className="text-muted-foreground font-elegant">
                Creamos momentos especiales para cada ocasión, desde celebraciones 
                íntimas hasta grandes eventos corporativos.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-4xl mx-auto p-12 bg-gradient-accent shadow-premium">
            <h2 className="text-3xl lg:text-4xl font-luxury font-bold mb-6 text-accent-foreground">
              ¿Listo para Endulzar tu Día?
            </h2>
            <p className="text-lg text-accent-foreground/80 mb-8 max-w-2xl mx-auto font-elegant">
              Descubre nuestra colección de postres únicos o contactanos para crear 
              algo especial solo para ti.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="hero" size="lg">
                <Link to="/catalogo">Ver Catálogo</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contacto">Hacer Pedido</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
