// Apex Prometheus — Lead Capture Webhook
// Cloudflare Pages Function: /api/webhook
// Routes form submissions to: Telegram + Email + Google Sheet

interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
  RESEND_API_KEY: string;
  GOOGLE_SHEET_WEBHOOK: string;
}

interface FormData {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  service?: string;
  message?: string;
  businessName?: string;
  website?: string;
  industry?: string;
  location?: string;
  formType?: string;
  _timestamp?: string;
  _source?: string;
  _ip?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    // Parse form data
    const contentType = request.headers.get("content-type") || "";
    let formData: FormData = {};

    if (contentType.includes("application/json")) {
      formData = await request.json();
    } else if (contentType.includes("form-data") || contentType.includes("urlencoded")) {
      const data = await request.formData();
      for (const [key, value] of data.entries()) {
        (formData as any)[key] = value;
      }
    }

    // Add metadata
    const timestamp = new Date().toISOString();
    formData._timestamp = timestamp;
    formData._source = request.headers.get("referer") || "unknown";
    formData._ip = request.headers.get("cf-connecting-ip") || "unknown";

    // Route to all destinations simultaneously
    const results = await Promise.allSettled([
      sendTelegramAlert(formData, env),
      logToSheet(formData, env),
      sendEmail(formData, env),
    ]);

    // Log failures
    const failures = results.filter((r) => r.status === "rejected");
    if (failures.length > 0) {
      console.error("Webhook routing failures:", JSON.stringify(failures));
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Thank you! We will be in touch shortly.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Something went wrong. Please email us at info@apexprometheus.com",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// Handle CORS preflight
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};

// ─── TELEGRAM ALERT ───
async function sendTelegramAlert(formData: FormData, env: Env) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    console.warn("Telegram not configured, skipping");
    return;
  }

  const isScoreForm = formData.formType === "ai-visibility-score";

  const message = isScoreForm
    ? `🔥 *NEW LEAD — AI Visibility Score*

👤 *Business:* ${formData.businessName || "Not provided"}
🌐 *Website:* ${formData.website || "Not provided"}
🏭 *Industry:* ${formData.industry || "Not provided"}
📍 *Location:* ${formData.location || "Not provided"}
📧 *Email:* ${formData.email || "Not provided"}
📍 *Source:* ${formData._source}
🕐 *Time:* ${formData._timestamp}`
    : `🔥 *NEW LEAD — Apex Prometheus*

👤 *Name:* ${formData.name || "Not provided"}
📧 *Email:* ${formData.email || "Not provided"}
📱 *Phone:* ${formData.phone || "Not provided"}
🏢 *Company:* ${formData.company || "Not provided"}
🎯 *Service:* ${formData.service || "Not specified"}
📍 *Source:* ${formData._source}
🕐 *Time:* ${formData._timestamp}

💬 *Message:*
${formData.message || "No message"}`;

  const response = await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Telegram alert failed: ${response.status} — ${err}`);
  }
}

// ─── EMAIL NOTIFICATION ───
async function sendEmail(formData: FormData, env: Env) {
  if (!env.RESEND_API_KEY) {
    console.warn("Resend not configured, skipping email");
    return;
  }

  const isScoreForm = formData.formType === "ai-visibility-score";

  const subject = isScoreForm
    ? `AI Score Lead: ${formData.businessName || "Website Inquiry"}`
    : `New Lead: ${formData.name || "Website Inquiry"}`;

  const emailBody = isScoreForm
    ? `NEW LEAD — AI Visibility Score
========================
Time: ${formData._timestamp}
Source: ${formData._source}

Business: ${formData.businessName || "Not provided"}
Website: ${formData.website || "Not provided"}
Industry: ${formData.industry || "Not provided"}
Location: ${formData.location || "Not provided"}
Email: ${formData.email || "Not provided"}

---
Lead captured by Apex Prometheus webhook`
    : `NEW LEAD — Apex Prometheus
========================
Time: ${formData._timestamp}
Source: ${formData._source}

Name: ${formData.name || "Not provided"}
Email: ${formData.email || "Not provided"}
Phone: ${formData.phone || "Not provided"}
Company: ${formData.company || "Not provided"}
Service: ${formData.service || "Not specified"}

Message:
${formData.message || "No message"}

---
Lead captured by Apex Prometheus webhook`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Apex Prometheus <onboarding@resend.dev>",
      to: "info@apexprometheus.com",
      subject: subject,
      text: emailBody,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Email failed: ${response.status} — ${err}`);
  }
}

// ─── GOOGLE SHEET LOG ───
async function logToSheet(formData: FormData, env: Env) {
  if (!env.GOOGLE_SHEET_WEBHOOK) {
    console.warn("Google Sheet not configured, skipping");
    return;
  }

  const isScoreForm = formData.formType === "ai-visibility-score";

  const response = await fetch(env.GOOGLE_SHEET_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      timestamp: formData._timestamp,
      source: formData._source,
      formType: formData.formType || "contact",
      name: formData.name || formData.businessName || "",
      email: formData.email || "",
      phone: formData.phone || "",
      company: formData.company || "",
      service: formData.service || formData.industry || "",
      website: formData.website || "",
      location: formData.location || "",
      message: formData.message || "",
      status: "NEW",
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Sheet log failed: ${response.status} — ${err}`);
  }
}
