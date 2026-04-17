import type { NextApiRequest, NextApiResponse } from 'next';
import { createTransaction } from '@/lib/repositories';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { lot_id, type, quantity, extracted } = req.body;
  const { data, error } = await createTransaction({
    lot_id,
    type,
    quantity,
    date: new Date().toISOString(),
    pdf_metadata: extracted
  });

  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ data });
}
