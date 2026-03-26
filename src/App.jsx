import { useState, useEffect } from "react";
import "./App.css";

const eyeColors = ["#3b82f6", "#22c55e", "#6b21a8", "#000000", "#a16207"];
const hairColors = ["#000000", "#4b5563", "#facc15", "#b91c1c", "#e5e7eb"];
const outfits = ["tshirt", "hoodie", "jacket", "suit"];
const skinTones = ["#f1c27d", "#e0ac69", "#c68642", "#8d5524"];
const accessories = ["none", "glasses"];
const hairStyles = ["short", "long", "bald"];
const faceShapes = ["round", "oval", "heart"];
const expressions = ["happy", "smile", "smirk"];

function App() {
  const [avatar, setAvatar] = useState(null);
  const [entropy, setEntropy] = useState([]);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      setMouse({ x, y });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const getQuantumEntropy = async () => {
    try {
      const res = await fetch("https://quantum-avatar-engine.onrender.com/entropy");

      if (!res.ok) throw new Error("Backend failed");

      const data = await res.json();

      return data;


    } catch (err) {
      console.error("Entropy fetch failed:", err);
      return null;
    }
  };

  const generateAvatar = async () => {
    const data = await getQuantumEntropy();

if (!data || !data.entropy || data.entropy.length < 10) {
  console.error("Bad entropy");
  return;
}

const ent = data.entropy;

    const timeSeed = Date.now() % 1000;

    const newAvatar = {
      eyes: eyeColors[(ent[0] + timeSeed) % eyeColors.length],
      hair: hairColors[(ent[1] + timeSeed) % hairColors.length],
      outfit: outfits[(ent[2] + timeSeed) % outfits.length],
      skin: skinTones[(ent[4] + timeSeed) % skinTones.length],
      accessory: accessories[(ent[6] + timeSeed) % accessories.length],
      hairStyle: hairStyles[(ent[7] + timeSeed) % hairStyles.length],
      face: faceShapes[(ent[3] + timeSeed) % faceShapes.length],
      expression: expressions[(ent[5] + timeSeed) % expressions.length],
      dna: ent.slice(0, 5).map((n) => n.toString(16)).join("-"),
      source: data.source,
      timestamp: data.timestamp
    };

    setEntropy(ent);
    setAvatar(newAvatar);
  };

  return (
    <div className="container">
      <h1>Quantum Avatar Engine</h1>

      <button onClick={generateAvatar}>
        Generate Quantum Avatar
      </button>

      {avatar && (
        <div className="card">

<div className="avatar">
<svg width="260" height="320" viewBox="0 0 200 280">

{/* HAIR BACK */}
{avatar.hairStyle !== "bald" && (
  <path
    d="M40 90 Q100 10 160 90 L160 200 Q100 250 40 200 Z"
    fill={avatar.hair}
  />
)}

{/* FACE SHAPE */}
{avatar.face === "oval" && (
  <ellipse cx="100" cy="115" rx="52" ry="68" fill={avatar.skin} />
)}

{avatar.face === "round" && (
  <circle cx="100" cy="115" r="60" fill={avatar.skin} />
)}

{avatar.face === "heart" && (
  <path
    d="M100 50 
       C60 50, 50 90, 50 120 
       C50 160, 75 185, 100 195 
       C125 185, 150 160, 150 120 
       C150 90, 140 50, 100 50 Z"
    fill={avatar.skin}
  />
)}

{/* FACE SHADOW */}
<ellipse cx="100" cy="130" rx="45" ry="50" fill="rgba(0,0,0,0.05)" />

{/* NECK */}
<rect x="85" y="175" width="30" height="30" rx="10" fill={avatar.skin} />

{/* BODY */}
<ellipse cx="100" cy="245" rx="75" ry="40" fill="#d1d5db" />

{/* EYES WITH BLINK */}
<g className="eyes">
  <ellipse cx="75" cy="115" rx="11" ry="7" fill="white" />
  <ellipse cx="125" cy="115" rx="11" ry="7" fill="white" />

  <circle cx="75" cy="115" r="4.5" fill={avatar.eyes} />
  <circle cx="125" cy="115" r="4.5" fill={avatar.eyes} />

  <circle cx="73" cy="113" r="1.5" fill="white" />
  <circle cx="123" cy="113" r="1.5" fill="white" />
</g>

{/* EYEBROWS */}
<path d="M65 95 Q75 90 85 95" stroke="#444" strokeWidth="2" fill="none"/>
<path d="M115 95 Q125 90 135 95" stroke="#444" strokeWidth="2" fill="none"/>

{/* NOSE */}
<path d="M100 120 Q104 135 96 135" stroke="#555" fill="none"/>

{/* LIPS + EXPRESSIONS */}
{avatar.expression === "happy" && (
  <path d="M75 150 Q100 170 125 150" fill="#d97706" />
)}

{avatar.expression === "smile" && (
  <path d="M75 150 Q100 160 125 150" stroke="#333" strokeWidth="2" fill="none" />
)}

{avatar.expression === "smirk" && (
  <path d="M80 155 Q100 160 120 150" stroke="#333" strokeWidth="2" fill="none" />
)}

{/* CHEEKS */}
<circle cx="65" cy="140" r="6" fill="rgba(255,100,100,0.15)" />
<circle cx="135" cy="140" r="6" fill="rgba(255,100,100,0.15)" />

{/* HAIR FRONT */}
{avatar.hairStyle === "short" && (
  <path
    d="M60 80 Q100 40 140 80 Q120 65 100 70 Q80 65 60 80"
    fill={avatar.hair}
  />
)}

{avatar.hairStyle === "long" && (
  <path
    d="M50 80 Q100 20 150 80"
    stroke={avatar.hair}
    strokeWidth="25"
    strokeLinecap="round"
    fill="none"
  />
)}

{/* GLASSES */}
{avatar.accessory === "glasses" && (
  <>
    <circle cx="75" cy="115" r="13" stroke="#222" fill="transparent"/>
    <circle cx="125" cy="115" r="13" stroke="#222" fill="transparent"/>
    <line x1="88" y1="115" x2="112" y2="115" stroke="#222"/>
  </>
)}

</svg>
</div>

          <div className="info">
            <p><strong>Eyes:</strong> {avatar.eyes}</p>
            <p><strong>Hair:</strong> {avatar.hair}</p>
            <p><strong>Outfit:</strong> {avatar.outfit}</p>
            <p><strong>QDNA:</strong> {avatar.dna}</p>
            <p><strong>Timestamp:</strong> {avatar.timestamp}</p>
          </div>

          <div className="entropy">
            <p>Entropy:</p>
            <small>{entropy.slice(0, 30).join(", ")}...</small>
          </div>

        </div>
      )}
    </div>
  );
}

export default App;