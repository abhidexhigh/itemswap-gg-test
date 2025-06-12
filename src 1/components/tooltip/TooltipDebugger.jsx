{
  /* Production Tooltip Debugger Component */
}
import { useEffect, useState } from "react";

const TooltipDebugger = () => {
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkTooltips = () => {
      const tooltipElements = document.querySelectorAll("[data-tooltip-id]");
      const reactTooltips = document.querySelectorAll(".react-tooltip");
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      setDebugInfo({
        elementsWithTooltips: tooltipElements.length,
        activeTooltips: reactTooltips.length,
        isTouchDevice,
        isProduction: process.env.NODE_ENV === "production",
        userAgent: navigator.userAgent,
        windowDefined: typeof window !== "undefined",
        tooltipContainer: !!document.getElementById("global-tooltip-container"),
      });
    };

    checkTooltips();
    const interval = setInterval(checkTooltips, 2000);

    return () => clearInterval(interval);
  }, []);

  // Only show in development or when debugging is needed
  if (
    process.env.NODE_ENV === "production" &&
    !window.location.search.includes("debug=true")
  ) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px",
        fontSize: "12px",
        zIndex: 999999,
        borderRadius: "4px",
        fontFamily: "monospace",
      }}
    >
      <div>
        <strong>Tooltip Debug Info:</strong>
      </div>
      <div>Elements: {debugInfo.elementsWithTooltips}</div>
      <div>Active: {debugInfo.activeTooltips}</div>
      <div>Touch: {debugInfo.isTouchDevice ? "Yes" : "No"}</div>
      <div>Prod: {debugInfo.isProduction ? "Yes" : "No"}</div>
      <div>Container: {debugInfo.tooltipContainer ? "Yes" : "No"}</div>
    </div>
  );
};

export default TooltipDebugger;
