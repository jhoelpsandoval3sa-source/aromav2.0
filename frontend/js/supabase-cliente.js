// =====================================
// js/supabase-cliente.js
// CONFIGURACION PROFESIONAL SUPABASE
// =====================================

// URL DEL PROYECTO
const SUPABASE_URL = "https://xsambglvdvzmmyrqvyvo.supabase.co";

// PUBLIC ANON KEY
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzYW1iZ2x2ZHZ6bW15cnF2eXZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzODI5NDEsImV4cCI6MjA5NDk1ODk0MX0.1wMpLeosW0dWfTFLminbI7qTA0a82bdBdGt_zPaL0lI";

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
