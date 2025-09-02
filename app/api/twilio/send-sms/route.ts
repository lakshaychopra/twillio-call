import { NextRequest } from 'next/server';
import { getTwilioClient } from '@/lib/twilio';
import { messages, uid } from '@/lib/state';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { to, from, body } = await req.json();
  if (!to || !from || !body) {
    return Response.json({ error: 'To, From and Body are required' }, { status: 400 });
  }

  const client = getTwilioClient();
  const message = await client.messages.create({ to, from, body });

  messages.unshift({
    id: uid(),
    from,
    to,
    body,
    direction: 'outbound',
    messageSid: message.sid,
    timestamp: new Date()
  });

  return Response.json({ success: true, messageSid: message.sid });
}
