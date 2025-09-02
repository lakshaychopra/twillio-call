import { NextRequest } from 'next/server';
import Twilio from 'twilio';
import { callLogs } from '@/lib/state';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const bodyText = await req.text();
  const params = new URLSearchParams(bodyText);
  const callSid = params.get('CallSid') || undefined;

  if (callSid) {
    const idx = callLogs.findIndex((c) => c.callSid === callSid);
    if (idx !== -1) callLogs[idx].status = 'connected';
  }

  const twiml = new Twilio.twiml.VoiceResponse();
  twiml.say('Hello, this is a call from your Twilio application.');
  const xml = twiml.toString();
  return new Response(xml, { headers: { 'Content-Type': 'text/xml' } });
}
