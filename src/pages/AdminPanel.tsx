import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import AdminDashboard from "@/components/admin/AdminDashboard";
import ProductManagement from "@/components/admin/ProductManagement";
import OrderManagement from "@/components/admin/OrderManagement";
import UserManagement from "@/components/admin/UserManagement";
import AdminReports from "@/components/admin/AdminReports";
import ChatbaseSettings from "@/components/admin/ChatbaseSettings";
import { Settings, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const AdminPanel = () => {
  const { user } = useAuth();

  // Permitir acceso a cualquier usuario autenticado
  const isAdmin = !!user;

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <ShieldCheck className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
            <p className="text-muted-foreground">Debes iniciar sesión para acceder al panel administrativo.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <ShieldCheck className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
            <p className="text-muted-foreground">No tienes permisos para acceder al panel administrativo.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-luxury font-bold mb-2 bg-gradient-hero bg-clip-text text-transparent">
                Panel Administrativo
              </h1>
              <p className="text-lg text-muted-foreground font-elegant">
                Gestión completa de Ramones - Boutique de Postres Premium
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-primary" />
              <Badge variant="default">Administrador</Badge>
            </div>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gradient-card">
            <TabsTrigger value="dashboard" className="font-medium">Dashboard</TabsTrigger>
            <TabsTrigger value="products" className="font-medium">Productos</TabsTrigger>
            <TabsTrigger value="orders" className="font-medium">Pedidos</TabsTrigger>
            <TabsTrigger value="users" className="font-medium">Usuarios</TabsTrigger>
            <TabsTrigger value="reports" className="font-medium">Reportes</TabsTrigger>
            <TabsTrigger value="chatbase" className="font-medium">Chatbase</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <AdminReports />
          </TabsContent>

          <TabsContent value="chatbase" className="space-y-6">
            <ChatbaseSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;