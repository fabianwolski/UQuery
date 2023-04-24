import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zmshqsmmckzubglmrclg.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptc2hxc21tY2t6dWJnbG1yY2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQ5OTc5MzMsImV4cCI6MTk5MDU3MzkzM30.UaW4eEGHy7XMuzrHUN6RAjgEVmoguaGY7F4KGP0OK58";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
