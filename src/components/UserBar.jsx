import React from "react";

const UserBar = ({ user }) => {
  if (!user) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: "5rem",
        paddingLeft: "1.5rem",
        cursor: "pointer",
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
        {user.username.charAt(0).toUpperCase()}
      </div>

      {/* User Details */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <p style={{ fontSize: "16px", fontWeight: "500" }}>{user.username}</p>
        <p style={{ fontSize: "12px", color: "#7D7D7D" }}>
          {user.status || "No status"}
        </p>
      </div>
    </div>
  );
};

export default UserBar;
