import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import TeamBar from "./TeamBar";
import axios from "axios";
import UserBar from "./UserBar";

const ChatArea = ({ receiver, isTeam }) => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState();
  const [chats, setChats] = useState([]);
  const [receiverChats, setReceiverChats] = useState([]);

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

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`${url}/chats`, { withCredentials: true });
        setChats(res.data);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };

    fetchChats();
    const interval = setInterval(fetchChats, 3000); // Poll every 3 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (!isTeam) {
      setReceiverChats(
        chats.filter(
          (chat) =>
            (receiver &&
              chat.receiver?._id === receiver?._id &&
              chat.sender?._id === sender?._id) ||
            (chat.sender?._id === receiver?._id &&
              chat.receiver?._id === sender?._id)
        )
      );
    } else {
      setReceiverChats(
        chats.filter((chat) => receiver && chat.teamId === receiver?._id)
      );
    }
  }, [chats, receiver, sender]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !sender || !receiver) return;

    try {
      if (isTeam) {
        const res = await axios.post(
          `${url}/chats`,
          {
            sender: sender._id,
            message: message,
            teamId: receiver?._id,
          },
          { withCredentials: true }
        );
        setChats([...chats, res.data]);
      } else {
        const res = await axios.post(
          `${url}/chats`,
          {
            sender: sender._id,
            message: message,
            receiver: receiver?._id,
          },
          { withCredentials: true }
        );
        setChats([...chats, res.data]);
      }

      setMessage("");
    } catch (err) {
      console.error("Message send failed:", err.response?.data || err.message);
    }
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
                  chat.sender?._id === sender?._id ? "flex-end" : "flex-start", // Align messages
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  padding: "1rem",
                  backgroundColor:
                    chat.sender?._id === sender?._id ? "#3A3F58" : "#F4F5F7",
                  borderRadius: "0.5rem",
                  color: chat.sender?._id === sender?._id ? "white" : "black",
                  maxWidth: "60%",
                  wordWrap: "break-word",
                }}
              >
                <p style={{ paddingBottom: "1rem", opacity: "0.5" }}>
                  {chat.sender?._id === sender?._id ? "You" : chat.sender?.name}
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
