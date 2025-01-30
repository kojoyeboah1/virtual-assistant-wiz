// Follow this setup guide to integrate the Deno runtime into your application:
// https://docs.google.com/document/d/1AlzxfTr5lrB_7E8utKB4GtSxLVXGYY2jtZTcp_oaowU/edit#heading=h.z84gh8sclah3

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log the request for debugging
    console.log('Received request for secret');

    // Parse the request body
    const { secretName } = await req.json();
    console.log('Requested secret:', secretName);

    // Validate the secret name
    if (!secretName) {
      console.error('No secret name provided');
      throw new Error('Secret name is required');
    }

    // Get the secret value from environment variables
    const secretValue = Deno.env.get(secretName);
    if (!secretValue) {
      console.error(`Secret ${secretName} not found in environment variables`);
      throw new Error(`Secret ${secretName} not found`);
    }

    console.log(`Successfully retrieved secret: ${secretName}`);

    // Return the secret value
    return new Response(
      JSON.stringify({
        data: secretValue,
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in get-secret function:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 400,
      },
    );
  }
});