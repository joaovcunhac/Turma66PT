import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: '50mb' }));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Lazy initialization to prevent crash if env vars are missing
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

export default app;
