import type { NextApiRequest, NextApiResponse } from 'next';
import { env } from '@/lib/env';
import { listVendors } from '@/lib/repositories';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { vendorId, lines } = req.body as { vendorId: string; lines: unknown[] };
  const { data: vendors } = await listVendors();
  const vendor = vendors?.find((v) => v.id === vendorId);
  if (!vendor) return res.status(400).json({ error: 'Vendor not found' });

  const payload = {
    to: vendor.email,
    subject: '原料発注書',
    text: `以下を発注します: ${JSON.stringify(lines)}`,
    lines
  };

  const response = await fetch(env.workerMailUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.CLOUDFLARE_WORKER_API_TOKEN || ''}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    return res.status(502).json({ error: 'Failed to send email via worker' });
  }

  return res.status(200).json({ message: '発注メール送信リクエストを受け付けました。' });
}
