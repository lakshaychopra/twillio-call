import { NextRequest } from 'next/server';
import Twilio from 'twilio';
import { messages, uid } from '@/lib/state';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const bodyText = await req.text();
  const params = new URLSearchParams(bodyText);
  const data = Object.fromEntries(params) as Record<string, string>;

  messages.unshift({
    id: uid(),
    from: data.From,
    to: data.To,
    body: data.Body,
    direction: 'inbound',
    messageSid: data.MessageSid,
    timestamp: new Date()
  });

  const twiml = new Twilio.twiml.MessagingResponse();
  const xml = twiml.toString();

  return new Response(xml, { headers: { 'Content-Type': 'text/xml' } });
}
