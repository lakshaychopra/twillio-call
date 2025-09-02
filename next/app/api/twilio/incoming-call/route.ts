import { NextRequest } from 'next/server';
import Twilio from 'twilio';
import { incomingCalls, callLogs, uid } from '@/lib/state';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const bodyText = await req.text();
  const params = new URLSearchParams(bodyText);
  const callSid = params.get('CallSid') || '';
  const from = params.get('From') || '';
  const to = params.get('To') || '';

  incomingCalls.unshift({ id: uid(), callSid, from, to, status: 'ringing', timestamp: new Date() });
  callLogs.unshift({ id: uid(), from, to, callSid, status: 'ringing', direction: 'inbound', timestamp: new Date() });

  const twiml = new Twilio.twiml.VoiceResponse();
  twiml.say('Please hold while we connect you.');
  const xml = twiml.toString();
  return new Response(xml, { headers: { 'Content-Type': 'text/xml' } });
}
