import { useEffect } from 'react';
import { useChatbase } from '@/hooks/useChatbase';

declare global {
  interface Window {
    chatbase: any;
  }
}

export const ChatbaseWidget = () => {
  const { chatbotId, isEnabled } = useChatbase();

  useEffect(() => {
    // Limpieza de scripts existentes cuando se desactiva o cambia el ID
    const cleanupExistingScripts = () => {
      const existingScripts = document.querySelectorAll('script[src*="chatbase.co"]');
      existingScripts.forEach(script => script.remove());
      
      // Limpiar el objeto chatbase del window
      if (window.chatbase) {
        delete window.chatbase;
      }
    };

    // Si no está habilitado o no hay ID, limpiar y salir
    if (!isEnabled || !chatbotId || chatbotId.trim() === '') {
      cleanupExistingScripts();
      return;
    }

    // Limpiar scripts anteriores antes de cargar el nuevo
    cleanupExistingScripts();

    // Initialize chatbase
    window.chatbase = (...args: any[]) => {
      if (!window.chatbase.q) {
        window.chatbase.q = [];
      }
      window.chatbase.q.push(args);
    };
    
    window.chatbase = new Proxy(window.chatbase, {
      get(target, prop) {
        if (prop === "q") {
          return target.q;
        }
        return (...args: any[]) => target(prop, ...args);
      }
    });

    const loadChatbaseScript = () => {
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = `chatbase-${chatbotId}`;
      script.setAttribute('chatbot-id', chatbotId);
      script.setAttribute('domain', 'www.chatbase.co');
      script.onload = () => {
        console.log('Chatbase widget loaded successfully');
      };
      script.onerror = () => {
        console.error('Error loading Chatbase widget');
      };
      document.body.appendChild(script);
    };

    if (document.readyState === "complete") {
      loadChatbaseScript();
    } else {
      window.addEventListener("load", loadChatbaseScript);
      return () => {
        window.removeEventListener("load", loadChatbaseScript);
      };
    }

    // Cleanup function para cuando el componente se desmonte o cambien las dependencias
    return () => {
      cleanupExistingScripts();
    };
  }, [chatbotId, isEnabled]);

  // This component doesn't render anything visible
  return null;
};