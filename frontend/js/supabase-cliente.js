// =====================================
// js/supabase-cliente.js
// CONFIGURACION PROFESIONAL SUPABASE
// =====================================

// URL DEL PROYECTO
const SUPABASE_URL = "https://wiorkxgzqidzkkooomzw.supabase.co";

// PUBLIC ANON KEY
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indpb3JreGd6cWlkemtrb29vbXp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MTcwMjAsImV4cCI6MjA5NDA5MzAyMH0.KogeIN4bQV0qnjnBK6g3xeA1dlHU9HX2-3nAvuaQnKA";

// CREAR CLIENTE
const { createClient } = supabase;

const db = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
        auth: {
            persistSession: true,     // mantener sesión iniciada
            autoRefreshToken: true,  // renovar sesión
            detectSessionInUrl: true // recuperación de cuenta
        }
    }
);

// MENSAJE CONSOLA
console.log("☕ Supabase conectado correctamente");
