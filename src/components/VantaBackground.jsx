import React, { useEffect, useRef } from "react";
import NET    from "vanta/dist/vanta.net.min";
import FOG    from "vanta/dist/vanta.fog.min";
import CELLS  from "vanta/dist/vanta.cells.min";
import DOTS   from "vanta/dist/vanta.dots.min";
import WAVES  from "vanta/dist/vanta.waves.min";
import HALO   from "vanta/dist/vanta.halo.min";
import personaVantaConfig from "../PersonaVataConfig";

const effects = { NET, FOG, CELLS, DOTS, WAVES, HALO };


export default function VantaBackground({ persona, children }) {
  const vantaRef   = useRef(null);      // DOM-node
  const effRef     = useRef(null);      // מחזיק את האפקט

  useEffect(() => {
    if (!window.VANTA || !window.THREE || !vantaRef.current) return;

    // ניקוי אפקט קודם אם קיים
    if (effRef.current) effRef.current.destroy();

    const cfg   = personaVantaConfig[persona] || personaVantaConfig.default;
    const init = effects[cfg.effect] || effects.NET;
    
    effRef.current = init({
      el: vantaRef.current,
      THREE: window.THREE,
      ...cfg.options,
    });

    return () => {
      if (effRef.current) effRef.current.destroy();
    };
  }, [persona]);

  return (
    <div ref={vantaRef} style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <div style={{
        position: "absolute",
        top: 0, left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        color: "white",
      }}>
        {children}
      </div>
    </div>
  );
}
