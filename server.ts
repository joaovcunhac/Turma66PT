import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase: any = null;

function getSupabase() {
  if (!supabase) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Configuração do Supabase ausente.");
    }
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabase;
}

const app = express();
app.use(express.json({ limit: '50mb' }));

// API Routes
app.get("/api/students", async (req, res) => {
  try {
    const client = getSupabase();
    const { data, error } = await client.from('students').select('*');
    if (error) throw error;
    res.json(data || []);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/students", async (req, res) => {
  try {
    const client = getSupabase();
    const { error } = await client.from('students').upsert(req.body, { onConflict: 'id' });
    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Configuração de ambiente
if (process.env.NODE_ENV !== "production") {
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  }).then((vite) => {
    app.use(vite.middlewares);
  });
} else {
  app.use(express.static(path.join(process.cwd(), "dist")));
  app.get("*", (req, res) => {
    // No Vercel, os arquivos estáticos são servidos de forma diferente, 
    // mas manteremos isso para compatibilidade local
    res.sendFile(path.join(process.cwd(), "dist", "index.html"));
  });
}

// Só inicia o listen se não estiver no Vercel (Vercel usa o export)
if (process.env.NODE_ENV !== "production") {
  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
