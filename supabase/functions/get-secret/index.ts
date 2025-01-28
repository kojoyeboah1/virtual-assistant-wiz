import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { secretName } = await req.json()
    console.log('Requested secret:', secretName)

    // Get the secret directly from environment variables
    const secretValue = Deno.env.get(secretName)
    
    if (!secretValue) {
      console.error(`Secret ${secretName} not found`)
      throw new Error(`Secret ${secretName} not found`)
    }

    console.log('Successfully retrieved secret')
    return new Response(
      JSON.stringify(secretValue),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in get-secret function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Error retrieving secret'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})