import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { listTransactions } from '@/lib/repositories';

export default function TransactionsPage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { listTransactions().then((r) => setItems(r.data ?? [])); }, []);

  return (
    <Layout>
      <h1 className="text-xl font-bold mb-4">入出庫履歴</h1>
      <table className="w-full border text-sm"><thead><tr><th className="border p-2">日付</th><th className="border p-2">種別</th><th className="border p-2">数量</th><th className="border p-2">PDF抽出</th></tr></thead>
        <tbody>{items.map((t) => <tr key={t.id}><td className="border p-2">{t.date}</td><td className="border p-2">{t.type}</td><td className="border p-2">{t.quantity}</td><td className="border p-2"><pre>{JSON.stringify(t.pdf_metadata ?? {}, null, 2)}</pre></td></tr>)}</tbody></table>
    </Layout>
  );
}
