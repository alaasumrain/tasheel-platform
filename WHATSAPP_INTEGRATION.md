# WhatsApp Integration - Implementation Guide

**Status:** ✅ Implemented (Test Mode)  
**Last Updated:** January 2025

## Overview

WhatsApp Business API integration for sending automated notifications to customers and receiving customer messages. Currently in **TEST MODE** - logs messages instead of sending them.

---

## ✅ What's Implemented

### 1. **WhatsApp Button Component** ✅
- **Location:** `src/components/ui/whatsapp-button.tsx`
- **Features:**
  - Opens WhatsApp chat with pre-filled message
  - Button and icon variants
  - Bilingual support (Arabic/English)
  - Used in:
    - Customer dashboard (request detail page)
    - Footer (social links)

### 2. **WhatsApp Notification Functions** ✅
- **Location:** `src/lib/whatsapp-notifications.ts`
- **Functions:**
  - `sendOrderConfirmationWhatsApp` - Order received confirmation
  - `sendQuoteReadyWhatsApp` - Quote ready notification
  - `sendPaymentConfirmedWhatsApp` - Payment confirmation
  - `sendStatusUpdateWhatsApp` - Order status updates
  - `sendOrderCompletedWhatsApp` - Order completed notification

### 3. **WhatsApp Core Library** ✅
- **Location:** `src/lib/whatsapp.ts`
- **Features:**
  - Phone number formatting (E.164 format)
  - Phone number validation
  - `sendWhatsAppMessage` function (TEST MODE)
  - `sendWhatsAppTemplate` function (for approved templates)

### 4. **WhatsApp Webhook Handler** ✅
- **Location:** `src/app/api/whatsapp/webhook/route.ts`
- **Features:**
  - Receives incoming WhatsApp messages
  - Finds customer by phone number
  - Logs messages to application_events
  - Webhook verification (GET endpoint)

### 5. **Integration Points** ✅
- ✅ Quote request submission → Sends WhatsApp confirmation
- ✅ Admin creates quote → Sends WhatsApp with quote details
- ✅ Payment completion → Sends WhatsApp confirmation
- ✅ Order status updates → Sends WhatsApp notification
- ✅ Customer dashboard → WhatsApp button for support

---

## ⚠️ Setup Required (Production)

### Step 1: Choose WhatsApp Provider

**Option A: Twilio WhatsApp API** (Recommended)
- **Docs:** https://www.twilio.com/docs/whatsapp
- **Cost:** Pay-per-message (~$0.005-0.01 per message)
- **Pros:** Official, reliable, good documentation
- **Setup:** Requires Twilio account + WhatsApp Business approval

**Option B: Meta WhatsApp Business API**
- **Docs:** https://developers.facebook.com/docs/whatsapp
- **Cost:** Pay-per-message
- **Pros:** Direct from Meta, official API
- **Setup:** Requires Meta Business account + WhatsApp Business verification

### Step 2: Install Twilio SDK (if using Twilio)

```bash
npm install twilio
```

### Step 3: Add Environment Variables

Add to `.env.local`:

```env
# Twilio WhatsApp (if using Twilio)
WHATSAPP_ACCOUNT_SID=your_account_sid
WHATSAPP_AUTH_TOKEN=your_auth_token
WHATSAPP_FROM_NUMBER=whatsapp:+14155238886  # Your Twilio WhatsApp number

# OR Meta WhatsApp (if using Meta)
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
WHATSAPP_VERIFY_TOKEN=your_verify_token  # For webhook verification

# Public WhatsApp number (for buttons)
NEXT_PUBLIC_WHATSAPP_NUMBER=+970592345678
```

### Step 4: Update `src/lib/whatsapp.ts`

Uncomment the Twilio code and remove the TEST MODE logging:

```typescript
// Replace the TEST MODE code with:
const twilio = require('twilio');
const client = twilio(accountSid, authToken);

const message = await client.messages.create({
  from: `whatsapp:${fromNumber}`,
  to: `whatsapp:${params.to}`,
  body: params.message,
  mediaUrl: params.mediaUrl ? [params.mediaUrl] : undefined,
});

return {
  success: true,
  messageId: message.sid,
};
```

### Step 5: Configure Webhook

1. **In Twilio/Meta Dashboard:**
   - Set webhook URL: `https://yourdomain.com/api/whatsapp/webhook`
   - Configure for incoming messages

2. **For Meta (if using):**
   - Set verify token in dashboard
   - Match `WHATSAPP_VERIFY_TOKEN` in `.env`

### Step 6: Test

1. Send a test WhatsApp message
2. Check logs for successful delivery
3. Test webhook by sending a message to your WhatsApp number
4. Verify messages are logged in `application_events`

---

## 📱 Usage Examples

### Send WhatsApp Notification

```typescript
import { sendOrderConfirmationWhatsApp } from '@/lib/whatsapp-notifications';

await sendOrderConfirmationWhatsApp({
  orderNumber: 'ORD-20250122-001',
  customerPhone: '+970592345678',
  customerName: 'Ahmed Ali',
  serviceName: 'Passport Translation',
});
```

### Use WhatsApp Button Component

```tsx
import { WhatsAppButton } from '@/components/ui/whatsapp-button';

<WhatsAppButton
  phoneNumber="+970592345678"
  message="Hello, I need help with my order"
  variant="button"
  fullWidth
/>
```

---

## 📋 Current Status

### ✅ Completed
- WhatsApp button component
- WhatsApp notification functions (5 types)
- WhatsApp core library (phone formatting, validation)
- Webhook handler (receives messages)
- Integration with email notifications
- WhatsApp button in customer dashboard
- WhatsApp link in footer

### ⏳ Pending (Production Setup)
- [ ] Install Twilio SDK (or Meta SDK)
- [ ] Add environment variables
- [ ] Uncomment Twilio/Meta code in `whatsapp.ts`
- [ ] Configure webhook in Twilio/Meta dashboard
- [ ] Test with real WhatsApp numbers
- [ ] Get WhatsApp Business verification (if needed)

---

## 🔍 Testing Mode

Currently, WhatsApp messages are **logged to console** instead of being sent. This allows development and testing without WhatsApp API credentials.

**Example console output:**
```
[WhatsApp TEST MODE] Would send message: {
  to: '+970592345678',
  message: 'Order confirmation...',
  mediaUrl: undefined
}
```

To enable real sending, follow the setup steps above.

---

## 📝 Notes

- All phone numbers are automatically formatted to E.164 format
- WhatsApp messages are bilingual (Arabic/English)
- Messages are sent in addition to emails (not replacement)
- WhatsApp failures don't block email notifications
- Customer phone numbers are stored in `customers.phone` and `applications.customer_phone`

---

## 🔗 Related Files

- `src/lib/whatsapp.ts` - Core WhatsApp functions
- `src/lib/whatsapp-notifications.ts` - Notification functions
- `src/components/ui/whatsapp-button.tsx` - UI component
- `src/app/api/whatsapp/webhook/route.ts` - Webhook handler
- `messages/en.json` & `messages/ar.json` - Translations

---

**WhatsApp Integration is ready for production setup!** 🎉

