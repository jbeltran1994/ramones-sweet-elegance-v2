import { useEffect } from 'react';
import { useChatbase } from '@/hooks/useChatbase';

const ChatbaseWidget = () => {
  const { chatbotId, isEnabled } = useChatbase();
  useEffect(() => {
    // Solo cargar el script si está habilitado y hay un chatbotId
    if (!isEnabled || !chatbotId) return;

    // Crear el script de Chatbase
    const script = document.createElement('script');
    script.src = 'https://www.chatbase.co/embed.min.js';
    script.async = true;
    script.defer = true;
    
    // Configurar el chatbot
    script.onload = () => {
      // @ts-ignore - Chatbase no tiene tipos TypeScript oficiales
      if (window.embeddedChatbotConfig) {
        // @ts-ignore
        window.embeddedChatbotConfig = {
          chatbotId: chatbotId,
          domain: window.location.hostname
        };
      } else {
        // @ts-ignore
        window.embeddedChatbotConfig = {
          chatbotId: chatbotId,
          domain: window.location.hostname
        };
      }
    };

    document.head.appendChild(script);

    // Cleanup: remover el script cuando el componente se desmonte
    return () => {
      const existingScript = document.querySelector('script[src="https://www.chatbase.co/embed.min.js"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      // Limpiar la configuración global
      // @ts-ignore
      if (window.embeddedChatbotConfig) {
        // @ts-ignore
        delete window.embeddedChatbotConfig;
      }
    };
  }, [chatbotId, isEnabled]);

  // Este componente no renderiza nada visible, solo carga el script
  return null;
};

export default ChatbaseWidget;