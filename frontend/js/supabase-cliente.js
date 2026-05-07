// supabase-client.js
// Inicializar la conexion con el proyecto
const SUPABASE_URL = 'https://raadwjynwsgxiozhtzfe.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhYWR3anlud3NneGlvemh0emZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNTIwOTksImV4cCI6MjA5MjYyODA5OX0.ZnzNLKTLDiH-xH1Ye3i4wsVECXQjji_syv-mzALY5zs'
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON);
// 'db' es el objeto que usaremos para todas las consultas

// PROBAR CONEXIÓN
async function probarConexion(){

    const { data, error } = await db
        .from("products")
        .select("*");

    if(error){
        console.log("❌ ERROR:", error.message);
    }else{
        console.log("✅ CONECTADO");
        console.log(data);
    }
}

probarConexion();