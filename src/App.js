import { useState, useEffect } from "react";
import axios from "axios";
import VantaBackground from "./components/VantaBackground";
import { useNavigate } from "react-router-dom";
import personas from "./personaCharacter.json";
const API = process.env.REACT_APP_API_BASE || "http://localhost:5000";



export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState(personas[0]);
  const [history, setHistory] = useState([]);   // רשימת שיחות
  const [convId, setConvId] = useState(null); // id שיחה פעילה
  const [showHist, setShowHist] = useState(false);
  const navigate = useNavigate();

  
  
  // מביאה את כל השיחות הקיימות
  const loadHistory = async () => {
    const res = await axios.get(`${API}/api/conversations`);
    console.log(res.data);
    setHistory(res.data);               // [{ _id, persona, createdAt }, ...]
    setShowHist(true);
  };

  // טוענת שיחה ספציפית ומציגה אותה
  const openConversation = async (id) => {
    try {
      const r = await axios.get(`${API}/api/conversations/${id}`);
      setMessages(r.data.messages);
      setConvId(id);
      // שומר גם persona לטובת הרקע
      setPersona({ name: r.data.persona, prompt: r.data.persona });
      setShowHist(false);
    } catch (e) {
      alert("שגיאה בטעינת שיחה");
    }
  };





  const sendMessage = async () => {
    if (!input) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/chat`, {
        conversationId: convId,
        personaPrompt: persona.prompt,
        messages: newMessages,
      });

      const reply = res.data.reply;
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      alert("שגיאה: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login")
    else {
      loadHistory();          // נטען מיד כשהקומפוננטה נטענת
    }
  }, [navigate]);                    // [] ⇒ רק בהרכבה ראשונה

  return (
    <VantaBackground persona={persona.name}>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl w-full max-w-lg">
          <div className="flex justify-between items-center mb-4">

            <button
              onClick={handleLogout}
              className="
              flex items-center gap-2
              px-3 py-1.5
              rounded-full
              text-sm font-medium
              text-red-600
              border border-red-300
              bg-white/80 backdrop-blur
              shadow-sm
              transition
              hover:bg-red-50 hover:text-red-700
              focus:outline-none focus:ring-2 focus:ring-red-400
            "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m-6 9a9 9 0 110-6"
                />
              </svg>
              Logout
            </button>
          </div>

          <h1 className="text-3xl font-bold text-center mb-4 text-gray-900">GeniusChat 🤖</h1>
          {showHist && (
            <div className="mb-4 rounded-lg border bg-white/90 backdrop-blur p-3 max-h-60 overflow-y-auto space-y-1 shadow">
              {history.map((c) => (
                <button
                  key={c._id}
                  onClick={() => openConversation(c._id)}
                  className="w-full text-right text-gray-800 hover:bg-indigo-100 px-2 py-1 rounded transition"
                >
                  {new Date(c.createdAt).toLocaleString("he-IL")} · {c.persona}
                </button>
              ))}
              <button
                onClick={() => setShowHist(false)}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                סגור
              </button>
            </div>
          )}
          <button
            onClick={loadHistory}
            className="mb-2 underline text-blue-600 hover:text-blue-800 transition"
          >
            📜 שיחות קודמות
          </button>

          <select
            className="w-full p-2 mb-4 rounded-md bg-gray-100 text-gray-800"
            onChange={(e) => setPersona(personas[e.target.value])}
          >
            {personas.map((p, idx) => (
              <option key={idx} value={idx}>{p.name}</option>
            ))}
          </select>

          <div className="h-72 overflow-y-auto space-y-2 bg-white border rounded-lg p-4 mb-4 shadow-inner text-gray-900">
            {messages.map((msg, idx) => (
              <p key={idx} className={`text-sm ${msg.role === "user" ? "text-right text-blue-700" : "text-left text-green-700"}`}>
                <strong>{msg.role === "user" ? "אתה" : "בוט"}:</strong> {msg.content}
              </p>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="הקלד הודעה..."
              className="flex-1 p-2 border rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-500"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              disabled={loading}
            >
              שלח
            </button>
          </div>
        </div>
      </div>
    </VantaBackground>
  );
}
