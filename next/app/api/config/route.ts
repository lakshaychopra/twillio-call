export const runtime = 'nodejs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const base = `${url.protocol}//${url.host}`;
  return Response.json({
    twilioNumbers: [process.env.TWILIO_NUMBER_1, process.env.TWILIO_NUMBER_2].filter(Boolean),
    webhookUrl: `${base}/api/twilio/incoming-call`,
    port: process.env.PORT || 3000,
    webhookBaseUrl: process.env.WEBHOOK_BASE_URL || base
  });
}
