export interface Env {
  EMAIL: {
    send: (message: {
      from: string;
      to: string;
      subject: string;
      text: string;
      attachments?: Array<{ filename: string; content: string; type: string }>;
    }) => Promise<void>;
  };
  MAIL_FROM: string;
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

    const body = await req.json<any>();
    const pdfBase64 = body.pdfBase64 ?? '';

    await env.EMAIL.send({
      from: env.MAIL_FROM,
      to: body.to,
      subject: body.subject ?? '発注書',
      text: body.text ?? '発注書を送付します。',
      attachments: pdfBase64
        ? [{ filename: 'order.pdf', content: pdfBase64, type: 'application/pdf' }]
        : undefined
    });

    return Response.json({ ok: true, message: 'order email sent' });
  }
};
