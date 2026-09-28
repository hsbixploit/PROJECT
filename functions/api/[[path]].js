// functions/api/[[path]].js
// Cloudflare Pages Function - handle /api/*

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // ==== ENDPOINT: /api?ip=1 ====
  if (url.searchParams.get('ip') === '1') {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const country = request.headers.get('CF-IPCountry') || 'unknown';
    const city = request.cf?.city || 'unknown';
    const region = request.cf?.region || 'unknown';
    const timezone = request.cf?.timezone || 'unknown';
    
    return new Response(JSON.stringify({
      ip, country, city, region, timezone
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // ==== ENDPOINT: /api?url=... ====
  const target = url.searchParams.get('url');
  if (!target) {
    return new Response(JSON.stringify({ error: 'Parameter "url" atau "ip=1" wajib diisi' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const res = await fetch(target, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0