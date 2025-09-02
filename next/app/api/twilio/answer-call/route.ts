import { NextRequest } from 'next/server';
import { getTwilioClient } from '@/lib/twilio';
import { incomingCalls, callLogs } from '@/lib/state';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { callSid } = await req.json();
  if (!callSid) return Response.json({ error: 'Call SID is required' }, { status: 400 });

  const incIdx = incomingCalls.findIndex((c) => c.callSid === callSid);
  if (incIdx !== -1) incomingCalls[incIdx].status = 'answered';
  const logIdx = callLogs.findIndex((c) => c.callSid === callSid);
  if (logIdx !== -1) callLogs[logIdx].status = 'answered';

  const vercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';
  const baseUrl = process.env.WEBHOOK_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || vercel;
  const client = getTwilioClient();
  try {
    await client.calls(callSid).update({ url: `${baseUrl}/api/twilio/call-answered`, method: 'POST' });
  } catch (e) {}

  return Response.json({ success: true });
}
