// @next
import { NextResponse } from 'next/server';

// @third-party
import axios from 'axios';

/***************************  API - MAILERLITE SUBSCRIBE  ***************************/

// POST handler for /api/subscribe
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body?.email === 'string' ? body.email.trim() : '';

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailPattern.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const endpoint = process.env.MAILERLITE_API_ENDPOINT;
    const apiKey = process.env.MAILERLITE_API_KEY;
    if (!endpoint || !apiKey) {
      console.error('MailerLite configuration is missing');
      return NextResponse.json({ error: 'Subscription service unavailable' }, { status: 503 });
    }

    const groups = process.env.MAILERLITE_GROUP?.split(',')
      .map((group) => group.trim())
      .filter(Boolean);

    await axios.post(
      `${endpoint}/subscribers`,
      { email, ...(groups?.length ? { groups } : {}) },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        }
      }
    );

    return NextResponse.json({ message: 'Subscribed successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error subscribing to MailerLite', error?.response?.data ?? error?.message ?? error);
    const message = error?.response?.data?.message || 'Unable to complete subscription';

    return NextResponse.json({ error: message }, { status: error?.response?.status || 500 });
  }
}
