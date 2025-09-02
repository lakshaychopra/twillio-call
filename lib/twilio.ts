import Twilio from 'twilio';

export function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID as string;
  const token = process.env.TWILIO_AUTH_TOKEN as string;
  if (!sid || !token) throw new Error('Missing Twilio credentials');
  return Twilio(sid, token);
}

