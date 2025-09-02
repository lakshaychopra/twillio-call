import { incomingCalls } from '@/lib/state';

export const runtime = 'nodejs';

export async function GET() {
  const active = incomingCalls.filter((c) => c.status === 'ringing');
  return Response.json(active);
}
