import type React from "react";

const FeaturePreview = ({ image }: { image: string }) => {
  const themeVars = {
    "--ai-primary-color": "hsl(var(--primary))",
    "--ai-background-color": "hsl(var(--background))",
    "--ai-text-color": "hsl(var(--foreground))",
    "--ai-text-dark": "hsl(var(--primary-foreground))",
    "--ai-border-color": "hsl(var(--border))",
    "--ai-border-main": "hsl(var(--foreground) / 0.1)",
    "--ai-highlight-primary": "hsl(var(--primary) / 0.12)",
    "--ai-highlight-header": "hsl(var(--accent) / 0.2)",
  };

  return (
    <div
      style={
        {
          width: "100%",
          height: "100%",
          position: "relative",
          background: "transparent",
          ...themeVars,
        } as React.CSSProperties
      }
      role="img"
      aria-label="AI Code Reviews interface showing code suggestions with apply buttons"
    >
      {/* Background Message Box (Blurred) */}
      <div
        style={{
          position: "absolute",
          top: "30px",
          left: "50%",
          transform: "translateX(-50%) scale(0.9)",
          width: "340px",
          height: "205.949px",
          background:
            "linear-gradient(180deg, var(--ai-background-color) 0%, transparent 100%)",
          opacity: 0.6,
          borderRadius: "8.826px",
          border: "0.791px solid var(--ai-border-color)",
          overflow: "hidden",
          backdropFilter: "blur(16px)",
        }}
      >
        <div
          className="border rounded-lg bg-card"
          style={{
            padding: "7.355px 8.826px",
            height: "100%",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        />
      </div>

      {/* Foreground Message Box (Main) */}
      <div
        style={{
          position: "absolute",
          top: "51.336px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "340px",
          height: "221.395px",
          background: "var(--ai-background-color)",
          backdropFilter: "blur(16px)",
          borderRadius: "9.488px",
          border: "1px solid var(--ai-border-main)",
          overflow: "hidden",
        }}
      >
        <div
          className="bg-card border border-border"
          style={{
            padding: "9.488px",
            height: "100%",
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              width: "100%",
              top: "47.67px",
              height: "33.118px",
              background: "hsl(var(--foreground) / 0.08)",
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              width: "100%",
              top: "80.791px",
              height: "45.465px",
              background: "var(--ai-highlight-primary)",
              zIndex: 1,
            }}
          />
          <img src={image} alt="" />
        </div>
      </div>
    </div>
  );
};

export default FeaturePreview;
