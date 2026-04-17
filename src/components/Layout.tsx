import type { PropsWithChildren } from 'react';
import Link from 'next/link';

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <nav className="flex gap-4 mb-6 text-sm">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/materials">Materials</Link>
        <Link href="/lots">Lots</Link>
        <Link href="/transactions">Transactions</Link>
        <Link href="/vendors">Vendors</Link>
        <Link href="/orders">Orders</Link>
      </nav>
      {children}
    </div>
  );
}
