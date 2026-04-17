import { useState } from 'react';
import { authSchema } from '@/schemas/auth';

type Props = {
  type: 'signup' | 'login';
  onSubmit: (input: { email: string; password: string }) => Promise<string | null>;
};

export function AuthForm({ type, onSubmit }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const parsed = authSchema.safeParse({ email, password });
        if (!parsed.success) {
          setError(parsed.error.issues[0]?.message ?? '入力を確認してください。');
          return;
        }
        const submitError = await onSubmit(parsed.data);
        setError(submitError);
      }}
      className="space-y-3"
    >
      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="mail@example.com" className="border p-2 w-full" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="********" className="border p-2 w-full" />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button className="bg-black text-white px-4 py-2" type="submit">{type === 'signup' ? 'サインアップ' : 'ログイン'}</button>
    </form>
  );
}
