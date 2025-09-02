import './globals.css';

export const metadata = {
  title: 'Twilio Communications App',
  description: 'Next.js app with Twilio webhooks and UI'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
