import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ChatbaseContextType {
  chatbotId: string | null;
  secretKey: string | null;
  isEnabled: boolean;
  isLoading: boolean;
  error: string | null;
  updateChatbotId: (id: string) => Promise<void>;
  updateSecretKey: (key: string) => Promise<void>;
  toggleEnabled: (enabled: boolean) => Promise<void>;
}

const ChatbaseContext = createContext<ChatbaseContextType | undefined>(undefined);

export const ChatbaseProvider = ({ children }: { children: ReactNode }) => {
  const [chatbotId, setChatbotId] = useState<string | null>("ME-qZh_caXMauEwvUSSJv");
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Configuración fija para Chatbase
  useEffect(() => {
    const loadChatbaseConfig = async () => {
      try {
        // Mantener ID del chatbot y estado activado fijos
        setChatbotId("ME-qZh_caXMauEwvUSSJv");
        setIsEnabled(true);
        
        // Solo cargar la clave secreta desde localStorage si existe
        const savedConfig = localStorage.getItem('chatbase-config');
        if (savedConfig) {
          const config = JSON.parse(savedConfig);
          setSecretKey(config.secretKey || null);
        }
      } catch (err) {
        console.error('Error loading Chatbase config:', err);
        setError('Error al cargar la configuración de Chatbase');
      } finally {
        setIsLoading(false);
      }
    };

    loadChatbaseConfig();
  }, []);

  const updateChatbotId = async (id: string) => {
    try {
      setChatbotId(id);
      const config = {
        chatbotId: id,
        secretKey,
        isEnabled
      };
      localStorage.setItem('chatbase-config', JSON.stringify(config));
      setError(null);
    } catch (err) {
      console.error('Error updating chatbot ID:', err);
      setError('Error al actualizar el ID del chatbot');
    }
  };

  const toggleEnabled = async (enabled: boolean) => {
    try {
      setIsEnabled(enabled);
      const config = {
        chatbotId,
        secretKey,
        isEnabled: enabled
      };
      localStorage.setItem('chatbase-config', JSON.stringify(config));
      setError(null);
    } catch (err) {
      console.error('Error toggling Chatbase:', err);
      setError('Error al cambiar el estado de Chatbase');
    }
  };

  const updateSecretKey = async (key: string) => {
    try {
      setSecretKey(key);
      const config = {
        chatbotId,
        secretKey: key,
        isEnabled
      };
      localStorage.setItem('chatbase-config', JSON.stringify(config));
      setError(null);
    } catch (err) {
      console.error('Error updating secret key:', err);
      setError('Error al actualizar la clave secreta');
    }
  };

  return (
    <ChatbaseContext.Provider value={{
      chatbotId,
      secretKey,
      isEnabled,
      isLoading,
      error,
      updateChatbotId,
      updateSecretKey,
      toggleEnabled
    }}>
      {children}
    </ChatbaseContext.Provider>
  );
};

export const useChatbase = () => {
  const context = useContext(ChatbaseContext);
  if (context === undefined) {
    throw new Error('useChatbase must be used within a ChatbaseProvider');
  }
  return context;
};