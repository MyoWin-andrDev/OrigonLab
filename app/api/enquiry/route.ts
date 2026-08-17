import { NextResponse } from "next/server";

/**
 * Enquiry capture — a visitor leaves their email so OrigonLab can reach out.
 *
 * This is a lead, not a newsletter signup: the address has to actually reach
 * someone. Point ENQUIRY_ENDPOINT at whatever delivers it — a transactional
 * mail API (Resend, Postmark), a form service (Formspree, Basin), or an
 * automation hook. Any URL accepting a JSON POST works.
 *
 *   ENQUIRY_ENDPOINT="https://api.resend.com/emails"
 *   ENQUIRY_TOKEN="your-api-key"          # optional, sent as Bearer
 *
 * With no endpoint set this returns 501 rather than a fake success, so an
 * enquiry is never accepted and then quietly dropped.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export async function POST(request: Request) {
  let email: unknown;

  try {
    const body = await request.json();
    email = body?.email;
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL.test(email.trim())) {
    return NextResponse.json(
      { error: "That doesn't look like a valid email address." },
      { status: 400 }
    );
  }

  const endpoint = process.env.ENQUIRY_ENDPOINT;

  if (!endpoint) {
    // Honest failure: nothing is connected, so this enquiry reached no one.
    return NextResponse.json(
      { error: "Enquiries aren't connected yet — please email us directly." },
      { status: 501 }
    );
  }

  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.ENQUIRY_TOKEN
          ? { Authorization: `Bearer ${process.env.ENQUIRY_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        email: email.trim(),
        source: "footer",
        receivedAt: new Date().toISOString(),
      }),
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Couldn't send that. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Couldn't send that. Please try again." },
      { status: 502 }
    );
  }
}
