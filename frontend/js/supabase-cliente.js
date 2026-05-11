const SUPABASE_URL = 'https://wiorkxgzqidzkkooomzw.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indpb3JreGd6cWlkemtrb29vbXp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MTcwMjAsImV4cCI6MjA5NDA5MzAyMH0.KogeIN4bQV0qnjnBK6g3xeA1dlHU9HX2-3nAvuaQnKA';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON);

console.log("✅ Supabase listo");
