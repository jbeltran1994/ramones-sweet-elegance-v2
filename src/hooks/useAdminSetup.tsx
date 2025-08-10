import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAdminSetup = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const createAdminUser = async (email: string, password: string, nombre: string, telefono: string) => {
    setIsCreating(true);
    try {
      // 1. Create the auth user with auto-confirm for admin
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            email_confirm: true // Auto-confirm admin users
          }
        }
      });

      if (authError) {
        throw new Error(`Error creando usuario auth: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error('No se pudo crear el usuario de autenticación');
      }

      // 2. Create the profile with admin role
      const { error: profileError } = await (supabase as any)
        .from('usuarios')
        .insert([{
          email: email,
          nombre: nombre,
          telefono: telefono,
          rol: 'admin',
          auth_id: authData.user.id
        }]);

      if (profileError) {
        console.error('Error creating admin profile:', profileError);
        // Don't throw here as the auth user was created successfully
        toast({
          title: "Advertencia",
          description: "Usuario de autenticación creado, pero hubo un problema al asignar el rol de administrador.",
          variant: "destructive"
        });
        return { success: false, user: authData.user };
      }

      toast({
        title: "¡Administrador creado exitosamente!",
        description: `El usuario ${email} ha sido creado con permisos de administrador.`,
      });

      return { success: true, user: authData.user };
    } catch (error) {
      console.error('Error in createAdminUser:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error inesperado al crear administrador",
        variant: "destructive"
      });
      return { success: false, user: null };
    } finally {
      setIsCreating(false);
    }
  };

  const updateUserRole = async (userId: number, newRole: 'admin' | 'user') => {
    try {
      const { error } = await (supabase as any)
        .from('usuarios')
        .update({ rol: newRole })
        .eq('id', userId);

      if (error) {
        throw new Error(`Error actualizando rol: ${error.message}`);
      }

      toast({
        title: "Rol actualizado",
        description: `El rol del usuario ha sido actualizado a ${newRole}.`,
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error inesperado al actualizar rol",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  return {
    createAdminUser,
    updateUserRole,
    isCreating
  };
};