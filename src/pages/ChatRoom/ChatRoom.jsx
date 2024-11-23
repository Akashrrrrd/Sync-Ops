import React, { useState, useEffect, useRef } from "react";
import "./ChatRoom.css";

const ChatRoom = () => {
  const [fabric, setFabric] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [isErasing, setIsErasing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [sentiment, setSentiment] = useState(null);
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    import("fabric").then((module) => {
      setFabric(module.fabric);
    });
  }, []);

  useEffect(() => {
    if (fabric && canvasRef.current) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: true,
        width: 800,
        height: 600,
      });

      const canvas = fabricCanvasRef.current;
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.color = color;
      canvas.freeDrawingBrush.width = brushSize;

      return () => {
        canvas.dispose();
      };
    }
  }, [fabric]);

  useEffect(() => {
    if (fabricCanvasRef.current && fabricCanvasRef.current.freeDrawingBrush) {
      fabricCanvasRef.current.freeDrawingBrush.color = color;
      fabricCanvasRef.current.freeDrawingBrush.width = brushSize;
    }
  }, [color, brushSize]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const analyzeSentiment = async (text) => {
    try {
      const response = await fetch("https://api.example.com/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const result = await response.json();
      setSentiment(result.sentiment);
    } catch (error) {
      console.error("Sentiment analysis error:", error);
    }
  };

  const fetchSuggestions = async (text) => {
    try {
      const response = await fetch("https://api.example.com/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const result = await response.json();
      setAiSuggestions(result.suggestions);
    } catch (error) {
      console.error("Suggestions fetching error:", error);
    }
  };

  const handleInputChange = (e) => {
    const inputText = e.target.value;
    setMessage(inputText);
    fetchSuggestions(inputText);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      await analyzeSentiment(message); // Analyze sentiment before sending
      const newMessage = {
        username: username || "Anonymous",
        text: message,
        sentiment,
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
      setAiSuggestions([]);
    }
  };

  const clearCanvas = () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.clear();
    }
  };

  const toggleEraser = () => {
    setIsErasing(!isErasing);
    if (fabricCanvasRef.current) {
      if (!isErasing) {
        fabricCanvasRef.current.freeDrawingBrush.color = "#ffffff";
        fabricCanvasRef.current.freeDrawingBrush.width = 20;
      } else {
        fabricCanvasRef.current.freeDrawingBrush.color = color;
        fabricCanvasRef.current.freeDrawingBrush.width = brushSize;
      }
    }
  };

  const downloadCanvas = () => {
    if (fabricCanvasRef.current) {
      const dataURL = fabricCanvasRef.current.toDataURL({
        format: "png",
        quality: 0.8,
      });
      const link = document.createElement("a");
      link.download = "whiteboard.png";
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const uploadImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (f) => {
      const data = f.target.result;
      fabric.Image.fromURL(data, (img) => {
        img.scaleToWidth(200);
        fabricCanvasRef.current.add(img);
        fabricCanvasRef.current.renderAll();
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="chatroom-container">
      <div className="whiteboard-section">
        <p className="chat-room-header">SyncOps Chat Room</p>
        <canvas ref={canvasRef} className="whiteboard" />
        <div className="whiteboard-controls">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="color-picker"
          />
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="brush-size-slider"
          />
          <button
            onClick={toggleEraser}
            className={`control-button ${isErasing ? "active" : ""}`}
          >
            {isErasing ? "Draw" : "Erase"}
          </button>
          <button onClick={clearCanvas} className="control-button">
            Clear
          </button>
          <button onClick={downloadCanvas} className="control-button">
            Download
          </button>
          <label className="control-button">
            Upload
            <input
              type="file"
              accept="image/*"
              onChange={uploadImage}
              style={{ display: "none" }}
            />
          </label>
        </div>
      </div>

      <div className="chat-section">
        <div className="chat-header">
          <h2>Team Chat</h2>
        </div>
        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx} className="message">
              <div className="message-header">
                <strong>{msg.username}</strong>
                <span className="timestamp">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
                <span className={`sentiment ${msg.sentiment}`}>
                  {msg.sentiment}
                </span>
              </div>
              <div className="message-content">{msg.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="message-input">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your name"
            className="username-input-cr"
          />
          <div className="message-submit">
            <input
              type="text"
              value={message}
              onChange={handleInputChange}
              placeholder="Type a message"
              className="text-input"
            />
            <button type="submit" className="send-button">
              Send
            </button>
          </div>
        </form>

        {aiSuggestions.length > 0 && (
          <div className="ai-suggestions">
            <p>Suggestions:</p>
            <ul>
              {aiSuggestions.map((suggestion, idx) => (
                <li key={idx} onClick={() => setMessage(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
