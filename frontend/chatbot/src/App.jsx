import { useState, useRef, useEffect } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([]);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // User message
    const userMsg = { id: Date.now(), role: "user", text: input };
    setMsgs((prev) => [...prev, userMsg]);
    setInput("");

    // Bot placeholder
    const botMsg = { id: Date.now() + 1, role: "bot", text: "Thinking..." };
    setMsgs((prev) => [...prev, botMsg]);

    try {
      // Use environment variable or fallback to localhost
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      // Replace placeholder with real response
      setMsgs((prev) =>
        prev.map((m) => (m.id === botMsg.id ? { ...m, text: data.response } : m))
      );
    } catch (err) {
      // On error, show fallback message
      setMsgs((prev) =>
        prev.map((m) =>
          m.id === botMsg.id ? { ...m, text: "God is silent..." } : m
        )
      );
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 flex flex-col items-center pt-10 font-sans">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-900 drop-shadow-lg">
        Talk with God
      </h1>

      {/* Chat box */}
      <div className="w-full max-w-md h-96 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl p-4 shadow-lg overflow-y-auto">
        {msgs.map((m) => (
          <div
            key={m.id}
            className={`my-2 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[75%] break-words shadow-md ${
                m.role === "user" ? "bg-blue-500 text-white" : "bg-yellow-100 text-gray-900"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="flex w-full max-w-md mt-4 gap-2">
        <input
          className="flex-1 p-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="px-6 py-3 rounded-2xl bg-blue-500 text-white font-semibold hover:bg-blue-600 shadow-md"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}