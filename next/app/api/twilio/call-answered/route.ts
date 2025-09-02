import Twilio from 'twilio';

export const runtime = 'nodejs';

export async function POST() {
  const twiml = new Twilio.twiml.VoiceResponse();
  twiml.say('Hello! Thank you for calling. You are now connected to our system.');
  twiml.pause({ length: 10 });
  const xml = twiml.toString();
  return new Response(xml, { headers: { 'Content-Type': 'text/xml' } });
}
