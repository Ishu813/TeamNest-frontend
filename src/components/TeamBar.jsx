import React, { useState } from "react";
import UserBar from "./UserBar";

const TeamBar = ({ team, showMem }) => {
  if (!team) return null;

  const [showMembers, setShowMembers] = useState(false);

  return (
    <div
      style={{
        alignContent: "center",
        paddingLeft: "1rem",
        cursor: "pointer",
      }}
    >
      {/* Team Header */}
      <div style={{ display: "flex", alignItems: "center" }}>
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
            margin: "1rem",
          }}
        >
          T
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "24px",
            opacity: "0.6",
            fontWeight: "bold",
          }}
        >
          <p>{team.teamName}</p>
        </div>
      </div>

      {/* Show/Hide Members Toggle */}
      {showMem ? (
        <p
          style={{
            fontSize: "12px",
            color: "#7D7D7D",
            paddingLeft: "1rem",
            cursor: "pointer",
          }}
          onClick={() => setShowMembers(!showMembers)}
        >
          {showMembers ? "Hide Members" : "Show Members"}
        </p>
      ) : (
        <p
          style={{
            fontSize: "12px",
            color: "#7D7D7D",
            paddingLeft: "4rem",
            paddingBottom: "1rem",
          }}
        >
          {team.members.length} members
        </p>
      )}

      {/* Members List */}
      {showMembers &&
        team.members.map(
          (member) =>
            member && <UserBar key={member.user._id} user={member.user} />
        )}
    </div>
  );
};

export default TeamBar;
