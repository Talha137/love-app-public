import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import confetti from "canvas-confetti";
import Admin from "./Admin";
import "./App.css";

function LovePage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [yes, setYes] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  const send = async (ans) => {
    await fetch("http://localhost:5000/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        answer: ans,
        time: new Date().toLocaleString(),
      }),
    });
  };

  // FAST ESCAPE NO BUTTON
  const moveNo = () => {
    const randomX = (Math.random() * window.innerWidth) - window.innerWidth / 2;
    const randomY = (Math.random() * window.innerHeight) - window.innerHeight / 2;

    setNoPos({
      x: randomX,
      y: randomY,
    });
  };

  const yesClick = () => {
    setYes(true);
    send("YES");

    confetti({
      particleCount: 300,
      spread: 140,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="container">

      {step === 1 && (
        <div className="card">
          <h1 className="title">💖 Enter Your Name</h1>

          <input
            className="input"
            placeholder="Your name..."
            onChange={(e) => setName(e.target.value)}
          />

          <button
            className="btn primary"
            onClick={() => name.trim() && setStep(2)}
          >
            Continue ➜
          </button>
        </div>
      )}

      {step === 2 && !yes && (
        <div className="card">
          <h1 className="title">Do you love me, {name}? 💕</h1>

          <div className="btnRow">
            
            {/* YES BUTTON */}
            <button className="btn yes" onClick={yesClick}>
              YES 💖
            </button>

            {/* NO BUTTON (UNTOUCHABLE + FAST RUNNER) */}
            <button
              className="btn no"
              onMouseEnter={moveNo}
              onMouseMove={moveNo}
              onMouseDown={moveNo}
              onTouchStart={moveNo}
              onClick={(e) => {
                e.preventDefault();
                moveNo();
              }}
              style={{
                position: "fixed",
                left: "50%",
                top: "50%",
                transform: `translate(${noPos.x}px, ${noPos.y}px)`,
                transition: "0.03s linear",
                zIndex: 9999,
                cursor: "not-allowed",
              }}
            >
              NO 😅
            </button>

          </div>
        </div>
      )}

      {yes && (
        <div className="card">
          <h1 className="love">💖 Yesss {name}, I knew it 💖</h1>
        </div>
      )}

      {/* ADMIN BUTTON */}
      <div style={{ marginTop: "20px" }}>
        <a href="/admin">
          <button className="btn primary">
            Admin Panel
          </button>
        </a>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LovePage />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
