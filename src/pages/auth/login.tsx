import { useRouter } from 'next/router';
import { AuthForm } from '@/components/AuthForm';
import { signIn } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  return (
    <main className="max-w-md mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">ログイン</h1>
      <AuthForm
        type="login"
        onSubmit={async ({ email, password }) => {
          const { error } = await signIn({ email, password });
          if (error) return error.message;
          router.push('/dashboard');
          return null;
        }}
      />
    </main>
  );
}
