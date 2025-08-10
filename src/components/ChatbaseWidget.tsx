import { useEffect } from 'react';
import { useChatbase } from '@/hooks/useChatbase';

const ChatbaseWidget = () => {
  const { chatbotId, isEnabled } = useChatbase();

  useEffect(() => {
    // Solo cargar el script si está habilitado y hay un chatbotId
    if (!isEnabled || !chatbotId) {
      return;
    }

    // Crear el script de configuración específico para el chatbot
    const configScript = document.createElement('script');
    configScript.innerHTML = `
      window.embeddedChatbotConfig = {
        chatbotId: "${chatbotId}",
        domain: "${window.location.hostname}"
      }
    `;

    // Crear el script de carga de Chatbase
    const embedScript = document.createElement('script');
    embedScript.src = "https://www.chatbase.co/embed.min.js";
    embedScript.async = true;
    embedScript.defer = true;
    embedScript.setAttribute('chatbotId', chatbotId);

    // Agregar ambos scripts al documento
    document.head.appendChild(configScript);
    document.head.appendChild(embedScript);

    // Cleanup: remover los scripts cuando el componente se desmonte o cambie la configuración
    return () => {
      // Remover scripts específicos de Chatbase
      const configScripts = document.querySelectorAll('script:not([src])');
      const embedScripts = document.querySelectorAll('script[src="https://www.chatbase.co/embed.min.js"]');
      
      configScripts.forEach(script => {
        if (script.innerHTML.includes('embeddedChatbotConfig')) {
          script.remove();
        }
      });
      
      embedScripts.forEach(script => {
        script.remove();
      });
      
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

      // Remover el contenedor del chat si existe
      const chatbaseContainer = document.querySelector('[id*="chatbase"]');
      if (chatbaseContainer) {
        chatbaseContainer.remove();
      }
    };
  }, [chatbotId, isEnabled]);

  // Este componente no renderiza nada visible, solo carga el script
  return null;
};

export default ChatbaseWidget;