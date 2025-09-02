# Twilio Communications App

Note: The app has been migrated to a single Next.js application with built-in API routes under `next/`. The previous `client/` (CRA) and `server/` (Express) have been removed.

To develop locally:

```
cd next
npm install
npm run dev
```

Deploy to Vercel by selecting the `next/` directory as the project root and setting required env vars.

## Features

- 📱 **SMS Messaging** - Send and receive text messages
- 📞 **Outbound Calling** - Make calls to any phone number
- ☎️ **Incoming Calls** - Answer or reject incoming calls with visual interface
- 📊 **Real-time Dashboard** - Activity overview and statistics
- 🔄 **Live Updates** - Real-time polling for messages and calls
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Application Tabs

### 📊 Dashboard
- Overview statistics (messages, calls, active calls)
- Recent message and call activity
- Real-time updates

### 💬 Messages
- **Send Messages**: Choose from number, enter recipient, type message
- **Message History**: View all sent/received SMS with timestamps
- **Real-time Reception**: Incoming messages appear automatically

### 📞 Dialer  
- **Make Calls**: Select from number and dial any phone number
- **Call History**: Track all outbound calls with status
- **One-click Calling**: Simple interface for quick dialing

### ☎️ Calls
- **Incoming Call Alerts**: Visual notifications with caller info
- **Answer/Reject**: One-click call handling
- **Call Animation**: Pulsing alerts for incoming calls
- **Call Status Tracking**: Real-time call state updates

### ⚙️ Settings
- **Number Management**: View your Twilio phone numbers
- **Webhook Configuration**: Setup instructions for Twilio Console
- **Capability Display**: Voice and SMS indicators per number

## Prerequisites

- Node.js (v16 or higher)
- Two Twilio phone numbers
- Twilio Account SID and Auth Token
- ngrok (for development webhook URLs)

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd twilio-communications-app/next
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the `next` directory:

```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_NUMBER_1=+1234567890
TWILIO_NUMBER_2=+1234567891
WEBHOOK_BASE_URL=http://localhost:3000
```

### 3. Setup ngrok (for development)

```bash
# Install ngrok globally
npm install -g ngrok

# Start ngrok on port 3000 (in a separate terminal)
ngrok http 3000
```

Copy the ngrok HTTPS URL and use it as your `WEBHOOK_BASE_URL`.

### 4. Configure Twilio Webhooks

1. Go to your [Twilio Console](https://console.twilio.com/)
2. Navigate to Phone Numbers → Manage → Active numbers
3. For each phone number, configure:
   - **Voice webhook**: `https://your-ngrok-url.ngrok.io/api/twilio/incoming-call`
   - **Messaging webhook**: `https://your-ngrok-url.ngrok.io/api/twilio/sms`
   - Set method to "POST" for both

### 5. Start the Application

```bash
npm run dev
```

Access the application at:
- **App + API**: http://localhost:3000

Note: Data is stored in-memory in serverless functions and is not persisted between deployments or cold starts.

## How It Works

### SMS Flow
1. **Outbound**: Select from number → Enter recipient → Type message → Send
2. **Inbound**: Webhook receives SMS → Stores in database → Displays in Messages tab

### Call Flow
1. **Outbound**: Select from number → Enter number → Click Call
2. **Inbound**: Webhook receives call → Shows in Calls tab → Answer/Reject options

### Real-time Updates
- Polls every 2 seconds for new messages and incoming calls
- Visual notifications for incoming calls with animations
- Automatic refresh of call logs and message history

## API Endpoints

### SMS
- `POST /api/twilio/sms` - Webhook for incoming SMS
- `POST /api/twilio/send-sms` - Send outbound SMS
- `GET /api/twilio/messages` - Get message history
- `DELETE /api/twilio/messages` - Clear message history

### Calls
- `POST /api/twilio/incoming-call` - Webhook for incoming calls
- `POST /api/twilio/make-call` - Make outbound call  
- `POST /api/twilio/answer-call` - Answer incoming call
- `POST /api/twilio/reject-call` - Reject incoming call
- `GET /api/twilio/logs` - Get call history
- `GET /api/twilio/incoming-calls` - Get active incoming calls

### Configuration
- `GET /api/config` - Get Twilio numbers configuration

## Project Structure

```
twilio-communications-app/
├── server/
│   ├── index.js              # Express server
│   └── routes/
│       ├── twilio.js         # SMS & call handling
│       └── config.js         # Configuration endpoints
├── client/                   # React frontend
│   ├── src/
│   │   ├── App.tsx          # Main application
│   │   └── App.css          # Styling
│   └── package.json
├── package.json              # Root package.json
├── .env                      # Environment variables
└── README.md
```

## Features in Detail

### Dashboard Tab
- **Statistics Cards**: Real-time counts of messages, calls, and active calls
- **Recent Activity**: Last 5 messages and calls with quick preview
- **Direction Indicators**: Visual cues for inbound/outbound communications

### Messages Tab
- **Composer Interface**: Dropdown for from number, input for recipient
- **Rich Text Area**: Multi-line message composition
- **Message History**: Scrollable list with send/receive indicators
- **Contact Formatting**: Pretty phone number display

### Dialer Tab
- **Number Input**: Large, center-aligned dialing interface
- **From Number Selection**: Dropdown to choose which Twilio number to use
- **Call History**: Complete log of outbound calls with status

### Calls Tab
- **Incoming Call Cards**: Large, prominent display with caller information
- **Action Buttons**: Green answer and red reject buttons
- **Call Animations**: Pulsing effects and ringing icon animation
- **Empty State**: Helpful message when no calls are waiting

### Settings Tab
- **Number Display**: Formatted view of your Twilio numbers with capabilities
- **Webhook URLs**: Copy-ready webhook endpoints
- **Setup Instructions**: Step-by-step Twilio Console configuration guide

## Styling Features

- **Glass Morphism**: Translucent backgrounds with blur effects
- **Gradient Background**: Beautiful purple-to-blue gradient
- **Smooth Animations**: Hover effects, transitions, and call animations
- **Responsive Design**: Mobile-first approach with breakpoint handling
- **Status Colors**: Color-coded indicators for success, pending, and failed states
- **Interactive Elements**: Button hover effects and form focus states

## Security Notes

- Environment variables for all sensitive configuration
- Input validation on all API endpoints
- HTTPS required for production webhooks
- Rate limiting recommended for production use

## Troubleshooting

### Common Issues

1. **Messages not receiving**: Check SMS webhook URL in Twilio Console
2. **Calls not coming through**: Verify voice webhook URL configuration
3. **Webhook errors**: Ensure ngrok is running and accessible
4. **Environment variables**: Confirm `.env` file is in root directory

### Debug Steps

1. Check server logs: `npm run server:dev`
2. Verify webhook URLs in Twilio Console
3. Test ngrok accessibility: `curl https://your-ngrok-url.ngrok.io/api/twilio/config`
4. Confirm phone number formats use E.164 format (+1234567890)

## Production Deployment

1. Use a proper domain instead of ngrok
2. Set up SSL certificates for HTTPS
3. Configure environment variables on your hosting platform
4. Update webhook URLs in Twilio Console to production domain
5. Set up database for message and call persistence
6. Implement rate limiting and authentication

## License

MIT License 
