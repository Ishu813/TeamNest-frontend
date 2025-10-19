import React from "react";

const ChatbotBar = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: "5rem",
        paddingLeft: "1.5rem",
        cursor: "pointer",
        backgroundColor: "#3d7aae",
        gap: "1rem",
      }}
    >
      {/* User Profile Picture Placeholder */}
      <div
        style={{
          width: "2.5rem",
          height: "2.5rem",
          borderRadius: "50%",
          backgroundColor: "#E0E0E0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        AI
      </div>

      {/* User Details */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <p style={{ fontSize: "16px", fontWeight: "500", color: "white" }}>
          ChatBot
        </p>
        <p style={{ fontSize: "12px", color: "lightgrey" }}>Open AI</p>
      </div>
    </div>
  );
};

export default ChatbotBar;
