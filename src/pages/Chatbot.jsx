import { useState } from "react";
import "./Chatbot.css";
import { GoogleGenerativeAI } from "@google/generative-ai";

let aliveMessages = []
const GEMINI_API_KEY = "AIzaSyBkGHdrlisAOMXj1vGK5rvPbKAAK8agd3A"; // Tu API Key
const ai = new GoogleGenerativeAI(GEMINI_API_KEY);

async function askGemini(history) {
  // Convierte el historial a formato Gemini
  const contents = history.map(msg => ({
    role: msg.from === "user" ? "user" : "model",
    parts: [{ text: msg.text }]
  }));

  const response = await ai.generateContent({
    model: "gemini-2.5-flash",
    contents,
  });
  // El texto de la respuesta está en response.response.text()
  return await response.response.text();
}

function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(aliveMessages);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => setInput(e.target.value);

  const handleSend = async () => {
    if (input.trim() === "") return;
    const newMessages = [...messages, { text: input, from: "user" }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    const reply = await askGemini(newMessages);
    setMessages([...newMessages, { text: reply, from: "bot" }]);
    setLoading(false);
  };
  aliveMessages = messages
  return (
    <div className="container">
      <div className="chat-container">
        <div className="chat">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={msg.from === "user" ? "chat-message user" : "chat-message bot"}
              style={{ textAlign: msg.from === "user" ? "right" : "left" }}
            >
              <b>{msg.from === "user" ? "Tú" : "Gemini"}:</b> {msg.text}
            </div>
          ))}
          {loading && (
            <div className="chat-message bot typing">
            Gemini está escribiendo...
            </div>
            )}
        </div>
        <div className="prompt-section">
          <input
            type="text"
            className="prompt"
            placeholder="Describe tu situacion o duda"
            value={input}
            onChange={handleInputChange}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <button className="submit-prompt" onClick={handleSend} disabled={loading}>Enviar</button>
        </div>
      </div>
    </div>
  );
}
export default Chatbot;