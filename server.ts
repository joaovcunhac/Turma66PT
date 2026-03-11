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

// Lazy initialization
let supabase: any = null;

function getSupabase() {
  if (!supabase) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Configuração do Supabase ausente. Verifique as variáveis de ambiente SUPABASE_URL e SUPABASE_ANON_KEY.");
    }
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabase;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get("/api/students", async (req, res) => {
    try {
      const client = getSupabase();
      const { data, error } = await client
        .from('students')
        .select('*');
      
      if (error) throw error;
      res.json(data || []);
    } catch (error: any) {
      console.error("Supabase fetch error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch data" });
    }
  });

  app.post("/api/students", async (req, res) => {
    try {
      const client = getSupabase();
      const students = req.body;
      const { error } = await client
        .from('students')
        .upsert(students, { onConflict: 'id' });

      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      console.error("Supabase save error:", error);
      res.status(500).json({ error: error.message || "Failed to save data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
