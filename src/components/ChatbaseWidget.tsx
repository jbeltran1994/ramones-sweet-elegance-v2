import { useEffect } from 'react';
import { useChatbase } from '@/hooks/useChatbase';

const ChatbaseWidget = () => {
  const { chatbotId, isEnabled } = useChatbase();

  useEffect(() => {
    // Solo cargar el script si está habilitado y hay un chatbotId
    if (!isEnabled || !chatbotId) {
      return;
    }

    // Limpiar cualquier configuración anterior
    // @ts-ignore
    if (window.embeddedChatbotConfig) {
      // @ts-ignore
      delete window.embeddedChatbotConfig;
    }

    // Configurar el chatbot según el formato oficial de Chatbase
    // @ts-ignore
    window.embeddedChatbotConfig = {
      chatbotId: chatbotId,
      domain: window.location.hostname
    };

    // Crear el script de Chatbase
    const script = document.createElement('script');
    script.src = 'https://www.chatbase.co/embed.min.js';
    script.async = true;
    script.defer = true;

    // Agregar el script al documento
    document.body.appendChild(script);

    // Log para debugging
    console.log('Chatbase widget initialized with config:', {
      chatbotId: chatbotId,
      domain: window.location.hostname
    });

    // Cleanup: remover el script y la configuración cuando cambie
    return () => {
      // Remover el script
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

      // Remover el widget del DOM si existe
      const chatbaseWidget = document.getElementById('chatbase-bubble-button');
      if (chatbaseWidget) {
        chatbaseWidget.remove();
      }

      // Remover el iframe del chat si existe
      const chatbaseIframe = document.querySelector('iframe[src*="chatbase.co"]');
      if (chatbaseIframe && chatbaseIframe.parentElement) {
        chatbaseIframe.parentElement.remove();
      }

      // Remover cualquier contenedor del chatbase
      const chatbaseContainers = document.querySelectorAll('[id*="chatbase"], [class*="chatbase"]');
      chatbaseContainers.forEach(container => {
        container.remove();
      });

      console.log('Chatbase widget cleaned up');
    };
  }, [chatbotId, isEnabled]);

  // Este componente no renderiza nada visible, solo carga el script
  return null;
};

export default ChatbaseWidget;