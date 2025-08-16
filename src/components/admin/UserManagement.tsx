
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Mail, Calendar, UserCheck, AlertCircle } from "lucide-react";

interface User {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  fecha_registro: string;
  auth_id: string | null;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching users from Supabase...');
      
      const { data, error, count } = await supabase
        .from('usuarios')
        .select('*', { count: 'exact' })
        .order('fecha_registro', { ascending: false });

      console.log('Supabase response:', { data, error, count });

      if (error) {
        console.error('Supabase error:', error);
        setError(`Error de base de datos: ${error.message}`);
        return;
      }

      if (!data) {
        console.log('No data returned from Supabase');
        setUsers([]);
        return;
      }

      console.log(`Successfully fetched ${data.length} users`);
      setUsers(data);
      
    } catch (error) {
      console.error('Unexpected error fetching users:', error);
      setError('Error inesperado al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error al cargar usuarios</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">
            Asegúrate de que las políticas RLS estén configuradas correctamente en Supabase.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-card shadow-elegant">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center">
            <Users className="h-6 w-6 mr-2 text-primary" />
            Gestión de Usuarios
          </h2>
          <Badge variant="outline" className="text-sm">
            {users.length} usuario(s) registrados
          </Badge>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay usuarios registrados</h3>
            <p className="text-muted-foreground mb-2">Los usuarios aparecerán aquí cuando se registren en la aplicación.</p>
            <p className="text-sm text-muted-foreground">
              Si esperas ver usuarios pero no aparecen, verifica las políticas RLS en Supabase.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <Card key={user.id} className="p-4 bg-background/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-cta-primary rounded-full flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-white" />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg">{user.nombre}</h3>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{user.email}</span>
                        </div>
                        {user.telefono && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>📞</span>
                            <span>{user.telefono}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Registrado: {formatDate(user.fecha_registro)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge variant="default">Activo</Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      ID: {user.id}
                    </p>
                    {user.auth_id && (
                      <p className="text-xs text-muted-foreground">
                        Auth: {user.auth_id.substring(0, 8)}...
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default UserManagement;
