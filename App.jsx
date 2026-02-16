import { useState, useRef, useEffect } from "react"; import { Card, CardContent } from "@/components/ui/card"; import { Button } from "@/components/ui/button"; import { Input } from "@/components/ui/input"; import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; import { motion } from "framer-motion";

export default function UltimateCreatorApp() { const canvasRef = useRef(null);

const [elements, setElements] = useState([]); const [dragging, setDragging] = useState(null); const [video, setVideo] = useState(null); const [projects, setProjects] = useState([]); const [templates] = useState([ { name: "Post Instagram" }, { name: "Story" }, { name: "Cartaz Evento" }, ]);

useEffect(() => { const saved = localStorage.getItem("ultimate-projects"); if (saved) setProjects(JSON.parse(saved)); }, []);

/* ================= ADICIONAR ELEMENTOS ================= */

const addText = () => { setElements([ ...elements, { id: Date.now(), type: "text", text: "Novo Texto", x: 60, y: 60, size: 28, color: "#000", }, ]); };

const addSticker = () => { setElements([ ...elements, { id: Date.now(), type: "sticker", text: "🔥", x: 100, y: 100, }, ]); };

const uploadImage = (e) => { const file = e.target.files[0]; if (!file) return;

setElements([
  ...elements,
  {
    id: Date.now(),
    type: "image",
    src: URL.createObjectURL(file),
    x: 0,
    y: 0,
    w: 220,
    h: 160,
  },
]);

};

const uploadVideo = (e) => { const file = e.target.files[0]; if (file) setVideo(URL.createObjectURL(file)); };

/* ================= CANVAS ================= */

const draw = () => { const canvas = canvasRef.current; const ctx = canvas.getContext("2d");

ctx.clearRect(0, 0, canvas.width, canvas.height);

elements.forEach((el) => {
  if (el.type === "text") {
    ctx.fillStyle = el.color;
    ctx.font = `${el.size}px Arial`;
    ctx.fillText(el.text, el.x, el.y);
  }

  if (el.type === "sticker") {
    ctx.font = "32px Arial";
    ctx.fillText(el.text, el.x, el.y);
  }

  if (el.type === "image") {
    const img = new Image();
    img.src = el.src;
    img.onload = () => ctx.drawImage(img, el.x, el.y, el.w, el.h);
  }
});

};

/* ================= DRAG ================= */

const handleMouseDown = (e) => { const rect = canvasRef.current.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top;

const found = elements.find(
  (el) => x >= el.x && x <= el.x + 200 && y >= el.y - 30 && y <= el.y + 150
);

if (found) setDragging(found.id);

};

const handleMouseMove = (e) => { if (!dragging) return;

const rect = canvasRef.current.getBoundingClientRect();
const x = e.clientX - rect.left;
const y = e.clientY - rect.top;

setElements(
  elements.map((el) =>
    el.id === dragging ? { ...el, x, y } : el
  )
);

};

const handleMouseUp = () => setDragging(null);

/* ================= EXPORT ================= */

const downloadImage = () => { const link = document.createElement("a"); link.download = "arte.png"; link.href = canvasRef.current.toDataURL(); link.click(); };

/* ================= PROJETOS ================= */

const saveProject = () => { const updated = [...projects, { elements, date: new Date().toLocaleString() }]; setProjects(updated); localStorage.setItem("ultimate-projects", JSON.stringify(updated)); };

/* ================= UI ================= */

return ( <div className="min-h-screen bg-gray-100 p-6"> <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6" > <h1 className="text-4xl font-semibold tracking-wide"> <span className="text-[#5B2EFF]">Duarte</span> <span className="text-[#00C2FF] font-light">Vision</span> </h1> <p className="text-sm text-gray-500 mt-1">Sua visão, sua criação.</p> </motion.div>

<Tabs defaultValue="design">
    <TabsList className="grid grid-cols-6 mb-6">
      <TabsTrigger value="design">Design</TabsTrigger>
      <TabsTrigger value="video">Vídeo</TabsTrigger>
      <TabsTrigger value="templates">Templates</TabsTrigger>
      <TabsTrigger value="projects">Projetos</TabsTrigger>
      <TabsTrigger value="export">Exportar</TabsTrigger>
      <TabsTrigger value="ai">IA</TabsTrigger>
    </TabsList>

    {/* DESIGN */}
    <TabsContent value="design">
      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={addText}>Texto</Button>
            <Button onClick={addSticker}>Sticker</Button>
            <Input type="file" accept="image/*" onChange={uploadImage} />
            <Button onClick={draw}>Renderizar</Button>
          </div>

          <canvas
            ref={canvasRef}
            width={650}
            height={420}
            className="border bg-white rounded-xl"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />

          <p className="text-sm text-gray-500">
            Arraste elementos com o mouse
          </p>
        </CardContent>
      </Card>
    </TabsContent>

    {/* VIDEO */}
    <TabsContent value="video">
      <Card>
        <CardContent className="space-y-4 p-4">
          <Input type="file" accept="video/*" onChange={uploadVideo} />

          {video && (
            <video controls className="w-full rounded-xl">
              <source src={video} />
            </video>
          )}

          <p>Editor de timeline avançado (base pronta)</p>
        </CardContent>
      </Card>
    </TabsContent>

    {/* TEMPLATES */}
    <TabsContent value="templates">
      <Card>
        <CardContent className="p-4 space-y-2">
          {templates.map((t, i) => (
            <div key={i} className="border p-2 rounded">
              {t.name}
            </div>
          ))}
        </CardContent>
      </Card>
    </TabsContent>

    {/* PROJETOS */}
    <TabsContent value="projects">
      <Card>
        <CardContent className="space-y-4 p-4">
          <Button onClick={saveProject}>Salvar Projeto</Button>

          {projects.map((p, i) => (
            <div key={i} className="border p-2 rounded">
              {p.date}
            </div>
          ))}
        </CardContent>
      </Card>
    </TabsContent>

    {/* EXPORT */}
    <TabsContent value="export">
      <Card>
        <CardContent className="p-4 space-y-3">
          <Button onClick={downloadImage}>Exportar Imagem</Button>
          <p>Exportar vídeo e PDF em breve</p>
        </CardContent>
      </Card>
    </TabsContent>

    {/* IA */}
    <TabsContent value="ai">
      <Card>
        <CardContent className="p-4">
          <p>🤖 Gerador automático de artes (estrutura pronta)</p>
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
</div>

); }
