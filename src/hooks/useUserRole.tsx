import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type UserRole = 'admin' | 'user' | null;

export interface UserProfile {
  id: number;
  email: string;
  nombre: string;
  telefono: string;
  rol: UserRole;
  auth_id: string;
  fecha_creacion: string;
}

export const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await (supabase as any)
          .from('usuarios')
          .select('*')
          .eq('auth_id', user.id)
          .single();

        if (fetchError) {
          console.error('Error fetching user profile:', fetchError);
          setError('Error al cargar el perfil del usuario');
          setUserProfile(null);
        } else {
          setUserProfile(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Error inesperado al cargar el perfil');
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchUserProfile();
    }
  }, [user, authLoading]);

  const isAdmin = userProfile?.rol === 'admin';
  const isUser = userProfile?.rol === 'user';

  return {
    userProfile,
    isAdmin,
    isUser,
    loading: authLoading || loading,
    error
  };
};