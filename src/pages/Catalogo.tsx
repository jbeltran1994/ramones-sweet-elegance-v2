import Navigation from "@/components/Navigation";
import ProductList from "@/components/ProductList";

const Catalogo = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-luxury font-bold mb-4 text-cta-primary">
            Nuestros Postres
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-elegant">
            Descubre nuestra exquisita selección de postres artesanales, 
            creados con ingredientes premium y técnicas francesas tradicionales.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 bg-cta-primary/10 px-6 py-3 rounded-full">
            <span className="text-cta-primary font-bold text-lg">🍰</span>
            <span className="text-cta-primary font-semibold">Envío gratuito en pedidos mayores a $100</span>
          </div>
        </div>

        {/* Lista de Productos */}
        <ProductList />
      </div>
    </div>
  );
};

export default Catalogo;