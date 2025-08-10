import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminSetup } from '@/hooks/useAdminSetup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Shield, ArrowLeft } from 'lucide-react';

const AdminSetup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    telefono: ''
  });
  
  const { createAdminUser, isCreating } = useAdminSetup();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const result = await createAdminUser(
      formData.email,
      formData.password,
      formData.nombre,
      formData.telefono
    );

    if (result.success) {
      // Redirect to admin panel or login
      navigate('/auth');
    }
  };

  // If user is already logged in, redirect them
  if (user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-luxury font-bold mb-2">
            Configuración de Administrador
          </h1>
          <p className="text-muted-foreground text-sm">
            Crea el primer usuario administrador del sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre completo</Label>
            <Input
              id="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleInputChange('nombre')}
              required
              disabled={isCreating}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              required
              disabled={isCreating}
            />
          </div>

          <div>
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleInputChange('telefono')}
              required
              disabled={isCreating}
            />
          </div>

          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              required
              disabled={isCreating}
              minLength={6}
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              required
              disabled={isCreating}
              minLength={6}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isCreating}
            variant="premium"
          >
            {isCreating ? 'Creando administrador...' : 'Crear Administrador'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminSetup;