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
        <div className="container mx-auto px-4 py-20 lg:py-32 relative z-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center relative">
            <div className="space-y-8 animate-slide-up relative z-30">
              <div>
                <h1 className="text-5xl lg:text-6xl font-luxury font-bold leading-tight">
                  <span className="text-cta-primary">
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
              
              <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <Button asChild variant="cta" size="xl" className="group shadow-cta">
                  <Link to="/catalogo">
                    VER CATÁLOGO COMPLETO
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="xl" className="border-2 border-cta-primary text-cta-primary hover:bg-cta-primary hover:text-primary-foreground bg-background font-bold">
                  <Link to="/contacto">PEDIDO PERSONALIZADO</Link>
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

            <div className="relative animate-fade-in order-first lg:order-last">
              <div className="absolute inset-0 bg-cta-primary/20 rounded-3xl blur-3xl opacity-30 animate-float -z-10"></div>
              <img 
                src={heroImage}
                alt="Exquisitos postres artesanales de Ramones Boutique"
                className="relative z-10 w-full rounded-3xl shadow-premium border-2 border-cta-primary/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-luxury font-bold mb-4 text-cta-primary">
              Más Vendidos
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-elegant">
              Los favoritos de nuestros clientes. Sabores irresistibles que conquistan desde el primer bocado.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="overflow-hidden bg-background shadow-elegant hover:shadow-cta transition-smooth border-2 border-transparent hover:border-cta-primary/20">
              <div className="aspect-square bg-muted relative">
                <div className="absolute top-4 right-4 bg-cta-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                  ¡MÁS VENDIDO!
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-luxury font-bold mb-2">Tiramisú Premium</h3>
                <p className="text-muted-foreground text-sm mb-4">Clásico italiano con mascarpone artesanal y café premium</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-price-highlight">$45.00</span>
                  <Button variant="cta" size="sm" className="shadow-cta">
                    AGREGAR
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden bg-background shadow-elegant hover:shadow-cta transition-smooth border-2 border-transparent hover:border-cta-primary/20">
              <div className="aspect-square bg-muted relative">
                <div className="absolute top-4 right-4 bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-bold">
                  NUEVO
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-luxury font-bold mb-2">Cheesecake de Frutos Rojos</h3>
                <p className="text-muted-foreground text-sm mb-4">Base de galleta artesanal con frutos rojos frescos</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-price-highlight">$42.00</span>
                  <Button variant="cta" size="sm" className="shadow-cta">
                    AGREGAR
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden bg-background shadow-elegant hover:shadow-cta transition-smooth border-2 border-transparent hover:border-cta-primary/20">
              <div className="aspect-square bg-muted relative">
                <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold">
                  PREMIUM
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-luxury font-bold mb-2">Macarons Franceses</h3>
                <p className="text-muted-foreground text-sm mb-4">Caja de 12 unidades con sabores exclusivos</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-price-highlight">$38.00</span>
                  <Button variant="cta" size="sm" className="shadow-cta">
                    AGREGAR
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center">
            <Button asChild variant="outline" size="lg" className="border-cta-primary text-cta-primary hover:bg-cta-primary hover:text-primary-foreground">
              <Link to="/catalogo">VER TODOS LOS PRODUCTOS</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
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
            <Card className="p-8 text-center bg-background shadow-elegant hover:shadow-premium transition-smooth border border-muted">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cta-primary/10 rounded-full mb-6">
                <Award className="h-8 w-8 text-cta-primary" />
              </div>
              <h3 className="text-xl font-luxury font-semibold mb-4">Ingredientes Premium</h3>
              <p className="text-muted-foreground font-elegant">
                Seleccionamos cuidadosamente cada ingrediente, desde chocolates belgas 
                hasta frutas de temporada de productores locales.
              </p>
            </Card>

            <Card className="p-8 text-center bg-background shadow-elegant hover:shadow-premium transition-smooth border border-muted">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cta-primary/10 rounded-full mb-6">
                <Heart className="h-8 w-8 text-cta-primary" />
              </div>
              <h3 className="text-xl font-luxury font-semibold mb-4">Hecho con Amor</h3>
              <p className="text-muted-foreground font-elegant">
                Cada postre es elaborado artesanalmente por nuestros maestros pasteleros, 
                con técnicas perfeccionadas durante generaciones.
              </p>
            </Card>

            <Card className="p-8 text-center bg-background shadow-elegant hover:shadow-premium transition-smooth border border-muted">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cta-primary/10 rounded-full mb-6">
                <Star className="h-8 w-8 text-cta-primary" />
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
      <section className="py-20 bg-cta-primary/5">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-4xl mx-auto p-12 bg-cta-primary shadow-premium border-0">
            <h2 className="text-3xl lg:text-4xl font-luxury font-bold mb-6 text-primary-foreground">
              ¿Listo para Endulzar tu Día?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto font-elegant">
              Descubre nuestra colección de postres únicos o contactanos para crear 
              algo especial solo para ti.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary" size="xl" className="bg-background text-cta-primary hover:bg-background/90 font-bold border-2 border-background">
                <Link to="/catalogo">VER CATÁLOGO COMPLETO</Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="border-2 border-background text-background hover:bg-background hover:text-cta-primary font-bold bg-transparent">
                <Link to="/contacto">PEDIDO PERSONALIZADO</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
