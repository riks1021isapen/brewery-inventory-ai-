import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { deleteVendor, listVendors, upsertVendor } from '@/lib/repositories';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const load = async () => setVendors((await listVendors()).data ?? []);

  useEffect(() => { load(); }, []);

  return <Layout><h1 className="text-xl font-bold mb-4">発注先管理</h1>
    <form className="flex gap-2 mb-4" onSubmit={async(e)=>{e.preventDefault(); await upsertVendor({name,email}); setName(''); setEmail(''); await load();}}>
      <input className="border p-2" value={name} onChange={(e)=>setName(e.target.value)} placeholder="name"/>
      <input className="border p-2" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="email"/>
      <button className="bg-black text-white px-3">保存</button>
    </form>
    <ul className="space-y-2">{vendors.map((v)=><li key={v.id} className="border p-2 flex justify-between">{v.name} ({v.email})<button className="text-red-600" onClick={async()=>{await deleteVendor(v.id); await load();}}>削除</button></li>)}</ul>
  </Layout>;
}
