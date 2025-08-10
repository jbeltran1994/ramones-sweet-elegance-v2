import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Catalogo from "./pages/Catalogo";
import Pedidos from "./pages/Pedidos";
import AdminPanel from "./pages/AdminPanel";
import AdminSetup from "./pages/AdminSetup";
import ContactMessages from "./components/admin/ContactMessages";
import Navigation from "./components/Navigation";
import Contacto from "./pages/Contacto";
import Auth from "./pages/Auth";
import ProjectTracking from "./pages/ProjectTracking";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin-setup" element={<AdminSetup />} />
              
              {/* Protected admin routes */}
              <Route path="/pedidos" element={
                <ProtectedRoute requireAdmin={true}>
                  <Pedidos />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPanel />
                </ProtectedRoute>
              } />
              <Route path="/admin/mensajes" element={
                <ProtectedRoute requireAdmin={true}>
                  <div className="min-h-screen bg-background">
                    <Navigation />
                    <div className="container mx-auto px-4 py-8">
                      <ContactMessages />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/seguimiento" element={
                <ProtectedRoute requireAdmin={true}>
                  <ProjectTracking />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
