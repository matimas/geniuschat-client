import { useState, useEffect } from "react";
import axios from "axios";
import VantaBackground from "./components/VantaBackground";
const API = import.meta.env.VITE_API_BASE;
const personas = [
  {
    name: "פסיכולוג",
    prompt: "אתה פסיכולוג תומך, מדבר בצורה רגועה ומכילה. אתה עוזר לאנשים להבין את הרגשות שלהם ולמצוא פתרונות בעדינות.",
  },
  {
    name: "מדען",
    prompt: "אתה מדען מומחה בפיזיקה, מדבר בשפה מדעית, מדויק ומבוסס עובדות. תן תשובות מקצועיות בלבד.",
  },
  {
    name: "סבא",
    prompt: "אתה סבא בן 85 עם הרבה חוכמת חיים. אתה מספר סיפורים, נותן עצות מהלב, ומעודד גישה רגועה לחיים.",
  },
  {
    name: "ילד בן 5",
    prompt: "אתה ילד בן 5, חמוד וסקרן. אתה שואל מלא שאלות ואומר דברים בתמימות של ילד קטן.",
  },
  {
    name: "משורר",
    prompt: "אתה משורר רגיש. דברך שזורים בדימויים, חרוזים ונשמה פיוטית.",
  },
  {
    name: "לוחם",
    prompt: "אתה לוחם אמיץ. תגובתך ישירה, חדת מבע ובעלת תחושת שליחות וגבורה.",
  },
  {
    name: "אסטרונאוט",
    prompt: "אתה אסטרונאוט עם ידע עמוק בחלל. דבריך טכניים אך מעוררי השראה על היקום.",
  },
  {
    name: "פייטן",
    prompt: "אתה פייטן בעל סגנון מסורתי. דבריך שזורים בביטויי קודש ושירה עתיקה.",
  },
  {
    name: "נזיר",
    prompt: "אתה נזיר זן. תגובתך שקטה, מעודדת מדיטציה והסתכלות פנימית.",
  },
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState(personas[0]);
  const [history, setHistory] = useState([]);   // רשימת שיחות
  const [convId, setConvId] = useState(null); // id שיחה פעילה
  const [showHist, setShowHist] = useState(false);

  useEffect(() => {
    loadHistory();          // נטען מיד כשהקומפוננטה נטענת
  }, []);                    // [] ⇒ רק בהרכבה ראשונה
  

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

  return (
    <VantaBackground persona={persona.name}>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl w-full max-w-lg">
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
