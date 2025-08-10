import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { ContactFormData } from "@/lib/validations";

export interface ContactMessage {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  mensaje: string;
  estado: 'pendiente' | 'en_proceso' | 'respondido';
  fecha_creacion: string;
  fecha_respuesta?: string;
  respuesta?: string;
}

export const useContactMessages = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createContactMessage = async (messageData: ContactFormData): Promise<ContactMessage | null> => {
    setIsCreating(true);
    try {
      const { data, error } = await (supabase as any)
        .from('mensajes_contacto')
        .insert([{
          nombre: messageData.nombre,
          telefono: messageData.telefono,
          email: messageData.email,
          mensaje: messageData.mensaje,
          estado: 'pendiente'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating contact message:', error);
        toast({
          title: "Error",
          description: "No se pudo enviar el mensaje. Intenta nuevamente.",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "¡Mensaje enviado!",
        description: "Gracias por contactarnos. Te responderemos pronto.",
      });

      return data;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado. Intenta nuevamente.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const getContactMessages = async (): Promise<ContactMessage[]> => {
    setIsLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('mensajes_contacto')
        .select('*')
        .order('fecha_creacion', { ascending: false });

      if (error) {
        console.error('Error fetching contact messages:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los mensajes.",
          variant: "destructive"
        });
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Unexpected error:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const updateMessageStatus = async (messageId: number, newStatus: ContactMessage['estado']): Promise<boolean> => {
    try {
      const { error } = await (supabase as any)
        .from('mensajes_contacto')
        .update({ estado: newStatus })
        .eq('id', messageId);

      if (error) {
        console.error('Error updating message status:', error);
        toast({
          title: "Error",
          description: "No se pudo actualizar el estado del mensaje.",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Estado actualizado",
        description: "El estado del mensaje ha sido actualizado correctamente.",
      });
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      return false;
    }
  };

  const respondToMessage = async (messageId: number, response: string): Promise<boolean> => {
    try {
      const { error } = await (supabase as any)
        .from('mensajes_contacto')
        .update({ 
          estado: 'respondido',
          respuesta: response,
          fecha_respuesta: new Date().toISOString()
        })
        .eq('id', messageId);

      if (error) {
        console.error('Error responding to message:', error);
        toast({
          title: "Error",
          description: "No se pudo enviar la respuesta.",
          variant: "destructive"
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      return false;
    }
  };

  return {
    createContactMessage,
    getContactMessages,
    updateMessageStatus,
    respondToMessage,
    isCreating,
    isLoading
  };
};