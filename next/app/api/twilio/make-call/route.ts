import { NextRequest } from 'next/server';
import { getTwilioClient } from '@/lib/twilio';
import { callLogs, uid } from '@/lib/state';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { to, from } = await req.json();
  if (!to || !from) return Response.json({ error: 'To and From are required' }, { status: 400 });

  const vercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';
  const baseUrl = process.env.WEBHOOK_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || vercel;
  const client = getTwilioClient();
  const call = await client.calls.create({
    to,
    from,
    url: `${baseUrl}/api/twilio/outbound-call-connected`,
    method: 'POST'
  });

  callLogs.unshift({ id: uid(), from, to, callSid: call.sid, status: 'initiated', direction: 'outbound', timestamp: new Date() });

  return Response.json({ success: true, callSid: call.sid });
}
