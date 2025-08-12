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
    if (!chatbotId || !isEnabled) {
      return;
    }

    // Clean up any existing script
    const existingScript = document.getElementById(chatbotId);
    if (existingScript) {
      existingScript.remove();
    }

    // Initialize chatbase if not already done
    if (!window.chatbase || window.chatbase("getState") !== "initialized") {
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
    }

    const onLoad = () => {
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = chatbotId;
      script.setAttribute('domain', 'www.chatbase.co');
      script.setAttribute('chatbot-id', chatbotId);
      script.setAttribute('data-minimizable', 'true');
      document.body.appendChild(script);
      
      // Configure chatbase after script loads
      script.onload = () => {
        if (window.chatbase) {
          window.chatbase('init', {
            chatbotId: chatbotId,
            minimizable: true,
            startMinimized: false
          });
        }
      };
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
      return () => {
        window.removeEventListener("load", onLoad);
      };
    }
  }, [chatbotId, isEnabled]);

  // This component doesn't render anything visible
  return null;
};