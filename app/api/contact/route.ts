import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, service, message, consent } = body;

    if (!name || !phone || !email || !message) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    if (!consent) {
      return NextResponse.json({ error: "Consent is required" }, { status: 400 });
    }

    // Here you can integrate with an email service (Resend, SendGrid, etc.)
    // For now, we log and return success
    console.log("New contact form submission:", { name, phone, email, service, message });

    // TODO: Send email notification to solangesbraidingsalon@gmail.com
    // const { Resend } = await import("resend");
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "noreply@solangehairbraiding.com",
    //   to: "solangesbraidingsalon@gmail.com",
    //   subject: `New Contact Form — ${name}`,
    //   text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nService: ${service}\nMessage: ${message}`,
    // });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
