import { useRouter } from 'next/router';
import { AuthForm } from '@/components/AuthForm';
import { signUp } from '@/lib/auth';

export default function SignupPage() {
  const router = useRouter();
  return (
    <main className="max-w-md mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">サインアップ</h1>
      <AuthForm
        type="signup"
        onSubmit={async ({ email, password }) => {
          const { error } = await signUp({ email, password });
          if (error) return error.message;
          router.push('/dashboard');
          return null;
        }}
      />
    </main>
  );
}
