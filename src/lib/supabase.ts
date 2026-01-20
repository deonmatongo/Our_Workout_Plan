import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ewhigrnlelkermgyqgns.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3aGlncm5sZWxrZXJtZ3lxZ25zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MDI1OTEsImV4cCI6MjA4NDQ3ODU5MX0.HTGX59vmTXXaol8lVcT1vhQ5wKgPXg5Oqmw3OMKwEp0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
