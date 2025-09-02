import { messages } from '@/lib/state';

export const runtime = 'nodejs';

export async function GET() {
  return Response.json(messages.slice(0, 100));
}

export async function DELETE() {
  messages.length = 0;
  return Response.json({ success: true });
}
