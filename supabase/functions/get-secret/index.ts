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
    console.log('Fetching secret:', secretName) // Debug log
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data, error } = await supabaseClient
      .from('secrets')
      .select('value')
      .eq('name', secretName)
      .single()

    if (error) {
      console.error('Database error:', error) // Debug log
      throw error
    }

    if (!data?.value) {
      console.error('No value found for secret:', secretName) // Debug log
      throw new Error(`No value found for secret: ${secretName}`)
    }

    console.log('Successfully fetched secret') // Debug log
    return new Response(
      JSON.stringify({ data: data.value }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in get-secret function:', error) // Debug log
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Error fetching secret from database'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})