import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faMessage } from "@fortawesome/free-regular-svg-icons";
import {
  faUserGroup,
  faFile,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "6rem",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#3A3F58",
        color: "white",
        fontSize: "24px",
        gap: "2rem",
        paddingTop: "2rem",
        zIndex: 1,
      }}
    >
      <a style={{ color: "white", textDecoration: "none" }} href="/account">
        <FontAwesomeIcon icon={faCircleUser} />
      </a>
      <a style={{ color: "white", textDecoration: "none" }} href="/chats">
        <FontAwesomeIcon icon={faMessage} />
      </a>
      <a style={{ color: "white", textDecoration: "none" }} href="/teams">
        <FontAwesomeIcon icon={faUserGroup} />
      </a>
      <a style={{ color: "white", textDecoration: "none" }} href="/projects">
        <FontAwesomeIcon icon={faFile} />
      </a>
      <a style={{ color: "white", textDecoration: "none" }} href="/search">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </a>
    </div>
  );
};

export default Sidebar;
