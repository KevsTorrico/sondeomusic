import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Verificamos que quien llama esté realmente logueado
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
      headers: corsHeaders,
    });
  }

  const supabaseAuth = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
      headers: corsHeaders,
    });
  }

  // Este cliente sí tiene permisos de administrador — solo existe aquí, en el servidor
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  const body = await req.json().catch(() => ({}));

  if (body.action === "list") {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders });
    }
    const usuarios = data.users.map((u) => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
    }));
    return new Response(JSON.stringify({ usuarios }), { headers: corsHeaders });
  }

  if (body.action === "create") {
    const { email, password } = body;
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email y contraseña son obligatorios" }), {
        status: 400,
        headers: corsHeaders,
      });
    }
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders });
    }
    return new Response(JSON.stringify({ usuario: data.user }), { headers: corsHeaders });
  }

  if (body.action === "delete") {
    const { id } = body;
    if (!id) {
      return new Response(JSON.stringify({ error: "Falta el id" }), { status: 400, headers: corsHeaders });
    }
    if (id === user.id) {
      return new Response(JSON.stringify({ error: "No puedes eliminar tu propia cuenta" }), {
        status: 400,
        headers: corsHeaders,
      });
    }
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders });
    }
    return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders });
  }

  return new Response(JSON.stringify({ error: "Acción no reconocida" }), { status: 400, headers: corsHeaders });
});