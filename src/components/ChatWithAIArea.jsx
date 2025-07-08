import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import ChatbotBar from "./ChatbotBar";
import { use } from "react";

const ChatWithAIArea = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages((prev) => [...prev, { user: input, bot: "..." }]); // Optimistically add user message

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo-16K", // You can also use "mistralai/mistral-7b-instruct"
        messages: [{ role: "user", content: input }],
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`, // Ensure you have set this in your .env file
          "Content-Type": "application/json",
          "X-Title": "MyGPTChatApp", // Optional app name
        },
      }
    );

    setMessages([
      ...messages,
      { user: input, bot: response.data.choices[0].message.content },
    ]);
    setInput("");
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
        <div>
          <ChatbotBar />
        </div>

        <div
          style={{
            height: "70vh", // Adjust height as needed
            overflowY: "auto",
            padding: "1rem",
            borderRadius: "0.5rem",
          }}
        >
          {/* Chat Messages */}
          {messages.length > 0 &&
            messages.map((message, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  maxWidth: "60rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      padding: "1rem",
                      backgroundColor: "#3A3F58",
                      borderRadius: "0.5rem",
                      color: "white",
                      wordWrap: "break-word",
                    }}
                  >
                    <p style={{ paddingBottom: "1rem", opacity: "0.5" }}>You</p>
                    <p>{message.user}</p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      padding: "1rem",
                      backgroundColor: "#F4F5F7",
                      borderRadius: "0.5rem",
                      color: "black",
                      wordWrap: "break-word",
                    }}
                  >
                    <p style={{ paddingBottom: "1rem", opacity: "0.5" }}>
                      ChatBot
                    </p>
                    <p>{message.bot}</p>
                  </div>
                </div>
              </div>
            ))}
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
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <input
              value={input}
              style={{
                border: "none",
                backgroundColor: "#F4F5F7",
                width: "52%",
                padding: "1rem",
                fontSize: "1rem",
              }}
              placeholder="Type your message..."
              onChange={(e) => setInput(e.target.value)}
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
    </div>
  );
};

export default ChatWithAIArea;
