import Navigation from "@/components/Navigation";
import SupabaseDiagnostic from "@/components/SupabaseDiagnostic";

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

        {/* Panel de Diagnóstico Supabase */}
        <div className="mb-12">
          <SupabaseDiagnostic />
        </div>

        {/* Coming Soon */}
        <div className="text-center py-20">
          <div className="bg-gradient-card rounded-lg shadow-elegant p-12 max-w-md mx-auto">
            <h2 className="text-2xl font-luxury font-semibold mb-4 text-foreground">
              Próximamente
            </h2>
            <p className="text-muted-foreground font-elegant mb-6">
              Estamos preparando algo especial para ti. Nuestro catálogo completo estará disponible muy pronto.
            </p>
            <div className="animate-float">
              <span className="text-4xl">🧁</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalogo;