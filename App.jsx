import React, { useState, useRef } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const canvasRef = useRef(null);

  const uploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (image) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffffff";
        ctx.font = "30px Arial";
        ctx.fillText(text, 20, 40);
      };
    } else {
      ctx.fillStyle = "#000";
      ctx.font = "30px Arial";
      ctx.fillText(text, 20, 40);
    }
  };

  const download = () => {
    const link = document.createElement("a");
    link.download = "duartevision.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1 style={{ color: "#5B2EFF" }}>
        Duarte<span style={{ color: "#00C2FF" }}>Vision</span>
      </h1>

      <p>Sua visão, sua criação.</p>

      <hr />

      <h2>Editor Básico</h2>

      <input
        type="text"
        placeholder="Digite um texto"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <br /><br />

      <input type="file" accept="image/*" onChange={uploadImage} />

      <br /><br />

      <button onClick={drawCanvas}>Gerar Arte</button>
      <button onClick={download} style={{ marginLeft: 10 }}>
        Baixar
      </button>

      <br /><br />

      <canvas
        ref={canvasRef}
        width={600}
        height={350}
        style={{ border: "1px solid #ccc" }}
      />
    </div>
  );
}
