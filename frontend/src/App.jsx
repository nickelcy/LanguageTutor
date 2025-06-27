import { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";
const server = import.meta.env.VITE_SERVER;
import MD from "react-markdown";
import { BiVolumeMute } from "react-icons/bi";
import { BiVolumeFull } from "react-icons/bi";

function App() {
  const [chats, setChats] = useState([]);
  const [history, setHistory] = useState(JSON.parse(localStorage.getItem("chatHistory")) || []);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottom = useRef(null);
  const inputRef = useRef(null);
  const [play, setPlay] = useState(false);

  const setLocalHistory = () => {
    const toStore = history.length > 10 ? history.slice(-10) : history;
    localStorage.setItem("chatHistory", JSON.stringify(toStore));
  };

  const submit = async (e) => {
    if (!input.trim()) return;
    inputRef.current?.focus();
    setLoading(true);
    console.log(history);
    e.preventDefault();
    try {
      const response = await axios.post(`${server}/chat`, { input, history });
      setInput("");
      // const audio = new Audio("http://localhost:5000/audio");
      // play && audio.play();
      setChats((prev) => {
        return [...prev, { input, output: response.data.response }];
      });
      setHistory((prev) => {
        return [
          ...prev,
          {
            role: "user",
            content: input,
          },
          {
            role: "assistant",
            content: response.data.response,
          },
        ];
      });
      setLoading(false);
    } catch (error) {
      console.error(error.response.data.message);
      alert(error.response.data.message || "Error making request.");
      setLoading(false);
    }
  };

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  useEffect(() => {
    setLocalHistory()
  }, [history]);

  return (
    <div
      className="text-bg-dark d-flex flex-column align-items-center justify-content-end p-3"
      style={{ width: "100vw", height: "100vh" }}
    >
      <div
        className="overflow-y-auto hide-scrollbar container d-flex align-items-center flex-column"
      >
        {chats.map((chat, index) => (
          <div
            key={index}
            className=" bg-secondary bg-opacity-25 text-white w-100 rounded p-4 mt-3"
            style={{ maxWidth: "800px" }}
          >
            <p className="mb-1">
              <strong>You:</strong> {chat.input}
            </p>
            <hr />
            <div className="mb-0">
              <MD>{chat.output}</MD>
            </div>
          </div>
        ))}
        <div ref={bottom} />
      </div>

      {loading && <div className="text-secondary mt-2">Loading...</div>}

      <form
        onSubmit={(e) => submit(e)}
        className="mt-4 mb-2 w-100"
        style={{ maxWidth: "600px" }}
      >
        <div className="input-group">
          <input
            type="text"
            ref={inputRef}
            className="form-control"
            placeholder="Try saying konnichiwa..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck="false"
          />
          <button
            type="button"
            className="btn btn-secondary d-flex justify-content-center align-items-center"
            onClick={() => setPlay((prev) => !prev)}
          >
            {play ? <BiVolumeFull /> : <BiVolumeMute />}
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !input.trim()}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
