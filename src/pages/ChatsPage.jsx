import React, { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import UserBar from "../components/UserBar";
import ChatArea from "../components/ChatArea";
import axios from "axios";

const ChatsPage = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const [users, setUsers] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/users`, {
        withCredentials: true,
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error.message);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter users based on search input
  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <div>
      <Sidebar />
      <div style={{ display: "flex", marginLeft: "6rem" }}>
        {/* Sidebar for Users */}
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: "#F4F5F7",
            width: "28rem",
            borderRight: "1px solid #ddd",
          }}
        >
          <div
            style={{
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3>Chats</h3>
            <div
              style={{
                backgroundColor: "white",
                marginTop: "1rem",
                display: "flex",
                alignItems: "center",
                padding: "0.5rem",
                borderRadius: "8px",
                boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                style={{ paddingLeft: "1rem", color: "#888" }}
              />
              <input
                type="text"
                style={{
                  border: "none",
                  outline: "none",
                  padding: "0.75rem",
                  marginLeft: "0.5rem",
                  flex: "1",
                }}
                placeholder="Search here..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* User List */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p
              style={{
                paddingLeft: "2rem",
                color: "#7D7D7D",
                fontSize: "12px",
                marginBottom: "1rem",
              }}
            >
              DIRECT MESSAGES
            </p>
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() =>
                  setReceiver((prev) => (prev?._id === user._id ? prev : user))
                }
                style={{ cursor: "pointer" }}
              >
                <UserBar user={user} />
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ width: "100%" }}>
          <ChatArea receiver={receiver} isTeam={false} />
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;
