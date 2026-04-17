import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { StockAlert } from '@/components/StockAlert';
import { listMaterials } from '@/lib/repositories';
import { supabase } from '@/lib/supabaseClient';
import type { Material } from '@/types/domain';

export default function DashboardPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [category, setCategory] = useState<string>('all');

  useEffect(() => {
    const load = async () => {
      const { data } = await listMaterials(category === 'all' ? undefined : (category as Material['category']));
      setMaterials((data as Material[]) ?? []);
    };
    load();

    const channel = supabase
      .channel('materials-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'materials' }, load)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [category]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">在庫ダッシュボード</h1>
      <select className="border p-2 mb-4" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="all">すべて</option>
        <option value="malt">モルト</option>
        <option value="hop">ホップ</option>
        <option value="yeast">イースト</option>
        <option value="adjunct">副原料</option>
      </select>
      <StockAlert materials={materials} />
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">名前</th>
            <th className="border p-2">カテゴリ</th>
            <th className="border p-2">単位</th>
            <th className="border p-2">しきい値</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((m) => (
            <tr key={m.id}>
              <td className="border p-2">{m.name}</td>
              <td className="border p-2">{m.category}</td>
              <td className="border p-2">{m.unit}</td>
              <td className="border p-2">{m.threshold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
