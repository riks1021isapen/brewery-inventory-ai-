import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { deleteMaterial, listMaterials, upsertMaterial } from '@/lib/repositories';
import type { Material } from '@/types/domain';

const empty: Partial<Material> = { name: '', category: 'malt', unit: 'kg', threshold: 0, notes: '' };

export default function MaterialsPage() {
  const [items, setItems] = useState<Material[]>([]);
  const [form, setForm] = useState<Partial<Material>>(empty);

  const load = async () => {
    const { data } = await listMaterials();
    setItems((data as Material[]) ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Layout>
      <h1 className="text-xl font-bold mb-4">原料管理</h1>
      <form className="grid grid-cols-5 gap-2 mb-6" onSubmit={async (e) => { e.preventDefault(); await upsertMaterial(form); setForm(empty); await load(); }}>
        <input className="border p-2" placeholder="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <select className="border p-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Material['category'] })}>
          <option value="malt">malt</option><option value="hop">hop</option><option value="yeast">yeast</option><option value="adjunct">adjunct</option>
        </select>
        <input className="border p-2" placeholder="unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
        <input className="border p-2" type="number" placeholder="threshold" value={form.threshold} onChange={(e) => setForm({ ...form, threshold: Number(e.target.value) })} />
        <button className="bg-black text-white">保存</button>
      </form>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="border p-2 flex justify-between"><span>{item.name} ({item.category})</span><button className="text-red-600" onClick={async () => { await deleteMaterial(item.id); await load(); }}>削除</button></li>
        ))}
      </ul>
    </Layout>
  );
}
