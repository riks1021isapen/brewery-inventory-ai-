import type { Material } from '@/types/domain';

export function StockAlert({ materials }: { materials: Material[] }) {
  const low = materials.filter((m) => Number((m as any).current_stock ?? 0) < m.threshold);
  if (!low.length) return null;
  return (
    <div className="bg-yellow-100 border border-yellow-400 p-3 rounded mb-4">
      <p className="font-semibold">在庫警告</p>
      <ul className="list-disc ml-6">
        {low.map((m) => (
          <li key={m.id}>{m.name}: しきい値({m.threshold}{m.unit})未満</li>
        ))}
      </ul>
    </div>
  );
}
