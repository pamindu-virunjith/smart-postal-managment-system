import { useEffect } from "react";

export default function ChatBot(){
    useEffect(() => {
    if (!window.chatbase || window.chatbase("getState") !== "initialized") {
      window.chatbase = (...args) => {
        if (!window.chatbase.q) window.chatbase.q = [];
        window.chatbase.q.push(args);
      };
      window.chatbase = new Proxy(window.chatbase, {
        get(target, prop) {
          if (prop === "q") return target.q;
          return (...args) => target(prop, ...args);
        },
      });
    }

    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "N8P_pgG5AHs_Iv9i4DNib";
    script.domain = "www.chatbase.co";
    document.body.appendChild(script);
  }, []);

  return null; // No visible component needed
}