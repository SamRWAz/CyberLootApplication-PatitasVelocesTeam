import axios, { type AxiosInstance } from 'axios';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://unpvaagrenqwuhhlclmq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVucHZhYWdyZW5xd3VoaGxjbG1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MzA2OTIsImV4cCI6MjA3NzUwNjY5Mn0.UKeAS54NBBBt0gH0ZFrfCrOiCKi2V9mOdonGptBym9Q';

// Cliente de Supabase para Auth
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Instancia de axios para REST API (mantener compatibilidad)
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`,
  headers: {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Prefer': 'return=representation',
  },
});

