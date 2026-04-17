// deno-lint-ignore-file no-explicit-any
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const vertexProjectId = Deno.env.get('VERTEX_PROJECT_ID') ?? '';
const vertexLocation = Deno.env.get('VERTEX_LOCATION') ?? 'asia-northeast1';
const processorId = Deno.env.get('VERTEX_PROCESSOR_ID') ?? '';
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const workerMailUrl = Deno.env.get('CLOUDFLARE_WORKER_ORDER_MAIL_URL') ?? '';

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const body = await req.json();
  const { storagePath, lotId, type = 'IN' } = body;

  // 実装時は Google Auth で Access Token を取得し Document AI API へ送信。
  const extracted = {
    item_name: 'Pale Malt',
    quantity: 25,
    unit_price: 400,
    lot_no: 'LOT-EXTRACTED',
    source: storagePath,
    processor: `${vertexProjectId}/${vertexLocation}/${processorId}`
  };

  const txPayload = {
    lot_id: lotId,
    type,
    quantity: extracted.quantity,
    date: new Date().toISOString(),
    pdf_metadata: extracted
  };

  const txRes = await fetch(`${supabaseUrl}/rest/v1/transactions`, {
    method: 'POST',
    headers: {
      apikey: supabaseServiceRole,
      Authorization: `Bearer ${supabaseServiceRole}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify(txPayload)
  });

  if (!txRes.ok) {
    const err = await txRes.text();
    return new Response(err, { status: 500 });
  }

  await fetch(`${supabaseUrl}/rest/v1/audit_logs`, {
    method: 'POST',
    headers: {
      apikey: supabaseServiceRole,
      Authorization: `Bearer ${supabaseServiceRole}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'pdf_processed',
      target_table: 'transactions',
      payload: extracted
    })
  });

  // Edge Function から Cloudflare Worker REST API 経由でメール送信するサンプル
  if (workerMailUrl) {
    await fetch(workerMailUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: body.notifyEmail,
        subject: 'PDF処理完了',
        text: `抽出完了: ${JSON.stringify(extracted)}`
      })
    });
  }

  return Response.json({ extracted, saved: true });
});
