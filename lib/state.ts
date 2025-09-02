export type MessageItem = {
  id: string;
  from: string;
  to: string;
  body: string;
  direction: 'inbound' | 'outbound';
  messageSid?: string;
  timestamp: Date;
};

export type CallLogItem = {
  id: string;
  from: string;
  to: string;
  callSid?: string;
  status: string;
  direction: 'inbound' | 'outbound';
  timestamp: Date;
};

export type IncomingCallItem = {
  id: string;
  callSid: string;
  from: string;
  to: string;
  status: string;
  timestamp: Date;
};

export const messages: MessageItem[] = [];
export const callLogs: CallLogItem[] = [];
export const incomingCalls: IncomingCallItem[] = [];

export function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

