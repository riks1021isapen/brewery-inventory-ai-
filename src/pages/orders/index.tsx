import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { listVendors } from '@/lib/repositories';

export default function OrdersPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [vendorId, setVendorId] = useState('');
  const [lines, setLines] = useState('[{"material":"Pale Malt","qty":25,"unit":"kg"}]');
  const [message, setMessage] = useState('');

  useEffect(() => { listVendors().then((r) => setVendors(r.data ?? [])); }, []);

  return (
    <Layout>
      <h1 className="text-xl font-bold mb-4">発注作成</h1>
      <form className="space-y-3" onSubmit={async (e) => {
        e.preventDefault();
        const res = await fetch('/api/orders/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vendorId, lines: JSON.parse(lines) })
        });
        const data = await res.json();
        setMessage(data.message || data.error);
      }}>
        <select className="border p-2" value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
          <option value="">発注先を選択</option>
          {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
        <textarea className="border p-2 w-full h-28" value={lines} onChange={(e) => setLines(e.target.value)} />
        <button className="bg-black text-white px-4 py-2">発注メール送信</button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </Layout>
  );
}
