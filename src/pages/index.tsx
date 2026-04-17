import Link from 'next/link';

export default function Home() {
  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-4">Brewery Inventory AI</h1>
      <p className="mb-4">在庫管理・PDF読取・発注メールを統合するアプリです。</p>
      <div className="flex gap-3">
        <Link href="/auth/signup" className="underline">サインアップ</Link>
        <Link href="/auth/login" className="underline">ログイン</Link>
      </div>
    </main>
  );
}
