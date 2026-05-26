const Input = ({ icon: Icon, ...props }) => {
  return (
    <div style={{ position: "relative", marginBottom: "1rem" }}>
      <div
        style={{
          position: "absolute",
          inset: "0 auto 0 0",
          display: "flex",
          alignItems: "center",
          paddingLeft: "14px",
          pointerEvents: "none",
        }}
      >
        <Icon size={18} style={{ color: "rgba(220, 170, 255, 0.7)" }} />
      </div>
      <input
        {...props}
        style={{
          width: "100%",
          paddingLeft: "2.8rem",
          paddingRight: "1rem",
          paddingTop: "0.8rem",
          paddingBottom: "0.8rem",
          background: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(200, 150, 255, 0.25)",
          borderRadius: "12px",
          color: "#f0e6ff",
          fontSize: "15px",
          fontFamily: "inherit",
          outline: "none",
          transition: "border-color 0.2s, background 0.2s",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "rgba(200, 130, 255, 0.6)";
          e.target.style.background = "rgba(255, 255, 255, 0.13)";
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "rgba(200, 150, 255, 0.25)";
          e.target.style.background = "rgba(255, 255, 255, 0.08)";
          props.onBlur?.(e);
        }}
      />
    </div>
  );
};

export default Input;
