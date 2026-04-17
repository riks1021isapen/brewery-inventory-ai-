import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email('メールアドレスの形式が不正です。'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください。')
});

export type AuthInput = z.infer<typeof authSchema>;
