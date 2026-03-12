import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

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

// Em desenvolvimento local, precisamos do Vite e do listen
if (process.env.NODE_ENV !== "production") {
  import("vite").then((vite) => {
    vite.createServer({
      server: { middlewareMode: true },
      appType: "spa",
    }).then((viteInstance) => {
      app.use(viteInstance.middlewares);
      const PORT = 3000;
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    });
  });
}

export default app;
