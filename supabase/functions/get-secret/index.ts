import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { secretName } = await req.json();
    console.log('Requested secret:', secretName);

    // Get the secret directly from environment variables
    const secretValue = Deno.env.get(secretName);
    
    if (!secretValue) {
      console.error(`Secret ${secretName} not found`);
      throw new Error(`Secret ${secretName} not found`);
    }

    console.log('Successfully retrieved secret');
    
    return new Response(
      JSON.stringify({ 
        data: secretValue 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in get-secret function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Error retrieving secret'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});