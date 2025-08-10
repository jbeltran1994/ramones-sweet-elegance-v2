import { useState } from "react";
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

// Temporary mock data - TODO: Replace with Supabase integration when table is created
const mockMessages: ContactMessage[] = [
  {
    id: 1,
    nombre: "Ana García",
    telefono: "+598 99 123 456",
    email: "ana.garcia@email.com",
    mensaje: "Hola! Quisiera hacer un pedido especial para el cumpleaños de mi hija.",
    estado: "pendiente",
    fecha_creacion: new Date().toISOString()
  }
];

let messageIdCounter = 2;

export const useContactMessages = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ContactMessage[]>(mockMessages);
  const { toast } = useToast();

  const createContactMessage = async (messageData: ContactFormData): Promise<ContactMessage | null> => {
    setIsCreating(true);
    try {
      // TODO: Replace with actual Supabase integration when table is created
      const newMessage: ContactMessage = {
        id: messageIdCounter++,
        nombre: messageData.nombre,
        telefono: messageData.telefono,
        email: messageData.email,
        mensaje: messageData.mensaje,
        estado: 'pendiente',
        fecha_creacion: new Date().toISOString()
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMessages(prev => [newMessage, ...prev]);

      toast({
        title: "¡Mensaje enviado!",
        description: "Gracias por contactarnos. Te responderemos pronto.",
      });

      return newMessage;
    } catch (error) {
      console.error('Error creating contact message:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Intenta nuevamente.",
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
      // TODO: Replace with actual Supabase query when table is created
      await new Promise(resolve => setTimeout(resolve, 300));
      return messages;
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const updateMessageStatus = async (messageId: number, newStatus: ContactMessage['estado']): Promise<boolean> => {
    try {
      // TODO: Replace with actual Supabase update when table is created
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, estado: newStatus } : msg
        )
      );

      toast({
        title: "Estado actualizado",
        description: "El estado del mensaje ha sido actualizado correctamente.",
      });
      return true;
    } catch (error) {
      console.error('Error updating message status:', error);
      return false;
    }
  };

  const respondToMessage = async (messageId: number, response: string): Promise<boolean> => {
    try {
      // TODO: Replace with actual Supabase update when table is created
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { 
                ...msg, 
                estado: 'respondido' as const,
                respuesta: response,
                fecha_respuesta: new Date().toISOString()
              } 
            : msg
        )
      );
      return true;
    } catch (error) {
      console.error('Error responding to message:', error);
      return false;
    }
  };

  return {
    createContactMessage,
    getContactMessages,
    updateMessageStatus,
    respondToMessage,
    isCreating,
    isLoading,
    messages // Export messages for component use
  };
};