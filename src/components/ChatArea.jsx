import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import TeamBar from "./TeamBar";
import axios from "axios";
import UserBar from "./UserBar";
import socket from "./socket"; // Adjust the import path as necessary

const ChatArea = ({ receiver, isTeam }) => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState();
  const [chats, setChats] = useState([]);
  const [receiverChats, setReceiverChats] = useState([]);

  // Fetch sender info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${url}/isauthuser`, {
          withCredentials: true,
        });
        setSender(response.data.user);
      } catch (error) {
        console.log("Unauthorized");
      }
    };
    fetchUser();
  }, []);

  // Fetch all chats (initial load)
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`${url}/chats`, {
          withCredentials: true,
        });
        setChats(res.data);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };
    fetchChats();
  }, []);

  // Handle private messages
  useEffect(() => {
    if (!sender || isTeam || !receiver) return;

    socket.emit("join", sender.username);

    const handlePrivateMessage = ({ sender: from, message }) => {
      setChats((prev) => [
        ...prev,
        { sender: from, message, receiver: sender.username },
      ]);
    };

    socket.on("private_message", handlePrivateMessage);

    return () => {
      socket.off("private_message", handlePrivateMessage);
    };
  }, [receiver, sender, isTeam]);

  // Handle group messages
  useEffect(() => {
    if (!receiver?._id || !isTeam) return;

    socket.emit("join-team", receiver._id);

    const handleGroupMessage = ({ sender: from, message, teamId }) => {
      if (teamId === receiver._id) {
        setChats((prev) => [...prev, { sender: from, message, teamId }]);
      }
    };

    socket.on("group-message", handleGroupMessage);

    return () => {
      socket.off("group-message", handleGroupMessage);
    };
  }, [receiver, isTeam]);

  // Filter chats for this conversation
  useEffect(() => {
    if (!sender || !receiver) return;

    if (!isTeam) {
      setReceiverChats(
        chats.filter(
          (chat) =>
            (chat.receiver === receiver.username &&
              chat.sender === sender.username) ||
            (chat.receiver === sender.username &&
              chat.sender === receiver.username)
        )
      );
    } else {
      setReceiverChats(chats.filter((chat) => chat.teamId === receiver._id));
    }
  }, [chats, receiver, sender, isTeam]);

  // Handle message sending
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || !sender || !receiver) return;

    if (isTeam) {
      socket.emit("group_message", {
        sender: sender.username,
        teamId: receiver._id,
        message,
      });
    } else {
      socket.emit("private_message", {
        sender: sender.username,
        receiver: receiver.username,
        message,
      });
    }

    setMessage(""); // clear input only, no local message push
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Chat Header */}
      <div
        style={{
          width: "100%",
          position: "fixed",
          top: "0",
          borderBottom: "1px dashed #F4F5F7",
        }}
      >
        {isTeam ? (
          <div>
            <TeamBar team={receiver} />
          </div>
        ) : (
          <div>
            <UserBar user={receiver} />
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "5rem",
          padding: "2rem",
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        {receiverChats.length > 0 ? (
          receiverChats.map((chat) => (
            <div
              key={chat._id}
              style={{
                display: "flex",
                justifyContent:
                  chat.sender === sender?.username ? "flex-end" : "flex-start", // Align messages
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  padding: "1rem",
                  backgroundColor:
                    chat.sender === sender?.username ? "#3A3F58" : "#F4F5F7",
                  borderRadius: "0.5rem",
                  color: chat.sender === sender?.username ? "white" : "black",
                  maxWidth: "60%",
                  wordWrap: "break-word",
                }}
              >
                <p style={{ paddingBottom: "1rem", opacity: "0.5" }}>
                  {chat.sender === sender?.username ? "You" : chat.sender}
                </p>
                <p>{chat.message}</p>
              </div>
            </div>
          ))
        ) : receiver ? (
          <div>No Messages Yet</div>
        ) : null}
      </div>

      {/* Chat Input */}
      <div
        style={{
          backgroundColor: "white",
          width: "100%",
          position: "fixed",
          bottom: "0",
          borderTop: "1px dashed #F4F5F7",
        }}
      >
        <form
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            height: "6rem",
            gap: "2rem",
            marginLeft: "6rem",
          }}
          onSubmit={handleSubmit}
        >
          <input
            value={message}
            style={{
              border: "none",
              backgroundColor: "#F4F5F7",
              width: "52%",
              padding: "1rem",
              fontSize: "1rem",
            }}
            placeholder="Type your message..."
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            style={{
              border: "none",
              backgroundColor: "#3A3F58",
              color: "white",
              height: "3rem",
              width: "3rem",
              borderRadius: "0.5rem",
            }}
            type="submit"
          >
            <FontAwesomeIcon
              style={{ fontSize: "1.5rem" }}
              icon={faPaperPlane}
            />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;
