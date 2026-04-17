import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { createLot, listLots } from '@/lib/repositories';

export default function LotsPage() {
  const [lots, setLots] = useState<any[]>([]);
  const [form, setForm] = useState({ material_id: '', lot_no: '', vendor_id: '', quantity_total: 0, quantity_remaining: 0, cost_per_unit: 0, received_date: '' });
  const load = async () => setLots((await listLots()).data ?? []);
  useEffect(() => { load(); }, []);

  return <Layout><h1 className="text-xl font-bold mb-4">ロット登録</h1>
    <form className="grid grid-cols-4 gap-2 mb-6" onSubmit={async(e)=>{e.preventDefault(); await createLot(form); setForm({ ...form, lot_no: '' }); await load();}}>
      <input className="border p-2" placeholder="material_id" value={form.material_id} onChange={(e)=>setForm({...form, material_id:e.target.value})}/>
      <input className="border p-2" placeholder="lot_no" value={form.lot_no} onChange={(e)=>setForm({...form, lot_no:e.target.value})}/>
      <input className="border p-2" type="number" placeholder="qty" value={form.quantity_total} onChange={(e)=>setForm({...form, quantity_total:Number(e.target.value), quantity_remaining:Number(e.target.value)})}/>
      <button className="bg-black text-white">登録</button>
    </form>
    <pre className="bg-gray-50 p-3 text-xs overflow-auto">{JSON.stringify(lots, null, 2)}</pre>
  </Layout>;
}
