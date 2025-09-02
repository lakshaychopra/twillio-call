import { NextRequest } from 'next/server';
import { getTwilioClient } from '@/lib/twilio';
import { incomingCalls, callLogs } from '@/lib/state';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { callSid } = await req.json();
  if (!callSid) return Response.json({ error: 'Call SID is required' }, { status: 400 });

  const client = getTwilioClient();
  try {
    await client.calls(callSid).update({ status: 'completed' });
  } catch {}

  const incIdx = incomingCalls.findIndex((c) => c.callSid === callSid);
  if (incIdx !== -1) incomingCalls.splice(incIdx, 1);
  const logIdx = callLogs.findIndex((c) => c.callSid === callSid);
  if (logIdx !== -1) callLogs[logIdx].status = 'rejected';

  return Response.json({ success: true });
}
