import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mltpwyyugscrblijbhff.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sdHB3eXl1Z3NjcmJsaWpiaGZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMDA5OTgsImV4cCI6MjA2NDg3Njk5OH0.6LAau9YCyJ_s9UJwk_7E8mYC5mQ555tVTmUy0z4lLaE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
