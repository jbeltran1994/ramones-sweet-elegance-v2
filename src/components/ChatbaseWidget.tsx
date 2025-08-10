import { useEffect } from 'react';
import { useChatbase } from '@/hooks/useChatbase';

const ChatbaseWidget = () => {
  const { chatbotId, isEnabled } = useChatbase();

  useEffect(() => {
    // Solo cargar el script si está habilitado y hay un chatbotId
    if (!isEnabled || !chatbotId) {
      return;
    }

    // Implementar el script exacto de Chatbase
    const initializeChatbase = () => {
      // Inicializar chatbase si no existe o no está inicializado
      // @ts-ignore
      if (!window.chatbase || window.chatbase("getState") !== "initialized") {
        // @ts-ignore
        window.chatbase = (...arguments) => {
          // @ts-ignore
          if (!window.chatbase.q) {
            // @ts-ignore
            window.chatbase.q = [];
          }
          // @ts-ignore
          window.chatbase.q.push(arguments);
        };
        
        // @ts-ignore
        window.chatbase = new Proxy(window.chatbase, {
          get(target, prop) {
            if (prop === "q") {
              return target.q;
            }
            return (...args) => target(prop, ...args);
          }
        });
      }

      const onLoad = () => {
        const script = document.createElement("script");
        script.src = "https://www.chatbase.co/embed.min.js";
        script.id = chatbotId; // ID específico del chatbot
        script.setAttribute('domain', window.location.hostname);
        document.body.appendChild(script);
        
        console.log('Chatbase script loaded with ID:', chatbotId);
      };

      if (document.readyState === "complete") {
        onLoad();
      } else {
        window.addEventListener("load", onLoad);
      }
    };

    // Ejecutar la inicialización
    initializeChatbase();

    // Cleanup
    return () => {
      // Remover el script específico
      const existingScript = document.querySelector(`script[id="${chatbotId}"]`);
      if (existingScript) {
        existingScript.remove();
      }

      // Limpiar la configuración global de chatbase
      // @ts-ignore
      if (window.chatbase) {
        // @ts-ignore
        delete window.chatbase;
      }

      // Remover cualquier elemento del widget
      const chatbaseElements = document.querySelectorAll('[id*="chatbase"], [class*="chatbase"]');
      chatbaseElements.forEach(element => {
        element.remove();
      });

      // Remover iframes de chatbase
      const chatbaseIframes = document.querySelectorAll('iframe[src*="chatbase.co"]');
      chatbaseIframes.forEach(iframe => {
        if (iframe.parentElement) {
          iframe.parentElement.remove();
        }
      });

      console.log('Chatbase widget cleaned up');
    };
  }, [chatbotId, isEnabled]);

  return null;
};

export default ChatbaseWidget;