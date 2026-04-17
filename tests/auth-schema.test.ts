import { authSchema } from '@/schemas/auth';

describe('auth schema', () => {
  it('rejects short password', () => {
    const result = authSchema.safeParse({ email: 'a@a.com', password: '1234567' });
    expect(result.success).toBe(false);
  });

  it('accepts 8+ password', () => {
    const result = authSchema.safeParse({ email: 'a@a.com', password: '12345678' });
    expect(result.success).toBe(true);
  });
});
