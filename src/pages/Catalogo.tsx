import Navigation from "@/components/Navigation";
import ProductList from "@/components/ProductList";

const Catalogo = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-luxury font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            Nuestros Postres
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-elegant">
            Descubre nuestra exquisita selección de postres artesanales, 
            creados con ingredientes premium y técnicas francesas tradicionales.
          </p>
        </div>

        {/* Lista de Productos */}
        <ProductList />
      </div>
    </div>
  );
};

export default Catalogo;