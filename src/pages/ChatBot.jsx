import React from "react";
import Sidebar from "../components/Sidebar";
import ChatbotBar from "../components/ChatbotBar";
import ChatWithAIArea from "../components/ChatWithAIArea";

const ChatBot = () => {
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
            <h3>ChatBot</h3>
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
              Chat with AI
            </p>
            <div style={{ cursor: "pointer" }}>
              <ChatbotBar />
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ width: "100%" }}>
          <ChatWithAIArea />
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
