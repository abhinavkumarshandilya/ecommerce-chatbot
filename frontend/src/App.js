// src/App.js
// src/App.js
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, from: "user" };
    setMessages([...messages, userMessage]);
    let response = "Sorry, I didn't understand that.";

    try {
      if (input.toLowerCase().includes("top 5")) {
        const res = await axios.get("http://localhost:3001/api/top-products");
        response = "Top 5 products:\n" + res.data.map(p => p.name).join("\n");
      } else if (input.match(/status.*\s+(\d+)/)) {
        const orderId = input.match(/(\d+)/)[1];
        const res = await axios.get(`http://localhost:3001/api/order-status/${orderId}`);
        if (res.data) {
          response = `Order ${orderId}: ${res.data.status}`;
        } else {
          response = "Order not found";
        }
      } else if (input.match(/stock.*\s+(.+)/i)) {
        const productName = input.match(/stock\s+(.+)/i)[1];
        const res = await axios.get(`http://localhost:3001/api/stock-check/${productName}`);
        if (res.data.error) {
          response = res.data.error;
        } else {
          response = `${res.data.name}: ${res.data.stock} in stock`;
        }
      }
    } catch (error) {
      response = "Error communicating with the server.";
    }

    const botMessage = { text: response, from: "bot" };
    setMessages(prevMessages => [...prevMessages, botMessage]);
    setInput("");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>E-Commerce Chatbot</h1>
      <div style={{ border: "1px solid #ccc", padding: "10px", minHeight: "400px" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.from === "user" ? "right" : "left" }}>
            <span style={{ background: msg.from === "user" ? "#007bff" : "#6c757d", color: "white", padding: "5px 10px", borderRadius: "10px" }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about top products, order status, or stock..."
          style={{ width: "80%", padding: "10px" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Send
        </button>
      </form>
    </div>
  );
}

export default App;