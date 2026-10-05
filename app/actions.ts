"use server";

import { contact } from "@/content/site";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function sendContactMessage(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const projectType = String(formData.get("projectType") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) {
    return {
      status: "error",
      message: "Please fill in your name, email, and a short message.",
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      "RESEND_API_KEY is not set; contact form submission was not sent.",
      { name, email }
    );
    return {
      status: "error",
      message:
        "The contact form isn't wired up to send email yet. Please reach out directly instead.",
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio <onboarding@resend.dev>",
        to: contact.recipientEmail,
        reply_to: email,
        subject: `New project inquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nProject type: ${projectType}\n\n${message}`,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend API error", res.status, body);
      return {
        status: "error",
        message: "Something went wrong sending your message. Please email directly instead.",
      };
    }

    return {
      status: "success",
      message: "Thanks, that's sent. I'll get back to you soon.",
    };
  } catch (err) {
    console.error("Failed to send contact message", err);
    return {
      status: "error",
      message: "Something went wrong sending your message. Please email directly instead.",
    };
  }
}
