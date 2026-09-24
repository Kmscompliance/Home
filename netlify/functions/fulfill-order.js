// Stripe webhook handler: fires when a Payment Link purchase completes,
// looks up which pack was bought (via the `package_id` metadata set on
// each Payment Link), and emails the buyer their documents via Resend.
//
// No Stripe or Resend npm packages used on purpose - this keeps the
// function dependency-free (Node's built-in `crypto` covers signature
// verification), so there's nothing to `npm install` and no build step
// needed. Both API calls are plain HTTPS requests.

const crypto = require("crypto");

// ---------------------------------------------------------------------
// Package catalogue - one entry per Payment Link's `package_id`.
// Swap the placeholder `files` links for the real ones once the actual
// documents are ready.
// ---------------------------------------------------------------------
const PACKAGES = {
  "aml-pack": {
    name: "AML Pack",
    files: [
      { label: "Anti Money Laundering Incident Register", url: "https://example.com/REPLACE-aml-incident-register" },
      { label: "Anti Money Laundering Policy", url: "https://example.com/REPLACE-aml-policy" },
    ],
  },
  "complaints-pack": {
    name: "Complaints Pack",
    files: [
      { label: "Complaints Procedure", url: "https://example.com/REPLACE-complaints-procedure" },
      { label: "Compliance Breach Log", url: "https://example.com/REPLACE-compliance-breach-log" },
    ],
  },
  "compliance-monitoring-pack": {
    name: "Compliance Monitoring Pack",
    files: [
      { label: "Compliance Monitoring Plan", url: "https://example.com/REPLACE-compliance-monitoring-plan" },
      { label: "Compliance Monitoring Policy", url: "https://example.com/REPLACE-compliance-monitoring-policy" },
    ],
  },
  "customer-due-diligence-pack": {
    name: "Customer Due Diligence Pack",
    files: [
      { label: "Customer Due Diligence Checklist", url: "https://example.com/REPLACE-cdd-checklist" },
      { label: "Customer Due Diligence Policy", url: "https://example.com/REPLACE-cdd-policy" },
      { label: "Customer Vulnerability Policy", url: "https://example.com/REPLACE-customer-vulnerability-policy" },
    ],
  },
  "financials-pack": {
    name: "Financials Pack",
    files: [
      { label: "Data Processing Policy", url: "https://example.com/REPLACE-data-processing-policy" },
      { label: "Financial Forecasts", url: "https://example.com/REPLACE-financial-forecasts" },
      { label: "Financial Promotion Strategy", url: "https://example.com/REPLACE-financial-promotion-strategy" },
    ],
  },
  "senior-management-pack": {
    name: "Senior Management Pack",
    files: [
      { label: "FIT and Proper Questionnaire", url: "https://example.com/REPLACE-fit-and-proper-questionnaire" },
      { label: "SMR Statement of Responsibility", url: "https://example.com/REPLACE-smr-statement-of-responsibility" },
    ],
  },
  "consumer-duty-pack": {
    name: "Consumer Duty Pack",
    files: [
      { label: "Implementation Plan - Consumer Duty", url: "https://example.com/REPLACE-consumer-duty-implementation-plan" },
    ],
  },
  "risk-management-pack": {
    name: "Risk Management Pack",
    files: [
      { label: "Risk Assessment Log", url: "https://example.com/REPLACE-risk-assessment-log" },
      { label: "Risk Management Framework Policy", url: "https://example.com/REPLACE-risk-management-framework-policy" },
    ],
  },
  "training-pack": {
    name: "Training Pack",
    files: [
      { label: "Training Log", url: "https://example.com/REPLACE-training-log" },
      { label: "Training Policy", url: "https://example.com/REPLACE-training-policy" },
    ],
  },
  "complete-bundle": {
    name: "Complete Authorisation Pack (all 9 packs)",
    files: [
      { label: "Download the complete bundle (all documents)", url: "https://example.com/REPLACE-complete-bundle" },
    ],
  },
};

// ---------------------------------------------------------------------
// Verify the request really came from Stripe, using the signing secret
// from the webhook endpoint's settings (STRIPE_WEBHOOK_SECRET env var).
// Manual implementation of Stripe's documented signing scheme, so no
// Stripe SDK dependency is needed.
// ---------------------------------------------------------------------
function verifyStripeSignature(rawBody, sigHeader, secret, toleranceSeconds = 300) {
  if (!sigHeader) throw new Error("Missing Stripe-Signature header");

  const parts = Object.fromEntries(
    sigHeader.split(",").map((part) => {
      const [key, value] = part.split("=");
      return [key, value];
    })
  );

  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) throw new Error("Malformed Stripe-Signature header");

  const signedPayload = `${timestamp}.${rawBody}`;
  const expectedSig = crypto.createHmac("sha256", secret).update(signedPayload, "utf8").digest("hex");

  const sigBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expectedSig, "hex");
  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    throw new Error("Signature mismatch");
  }

  const age = Math.floor(Date.now() / 1000) - parseInt(timestamp, 10);
  if (age > toleranceSeconds) throw new Error("Timestamp too old - possible replay");

  return true;
}

function buildEmailHtml(packageName, files) {
  const linksHtml = files
    .map((f) => `<li style="margin-bottom:8px;"><a href="${f.url}" style="color:#068A53;">${f.label}</a></li>`)
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; color: #23262B; max-width: 560px; margin: 0 auto;">
      <h1 style="color:#11304F; font-size:1.4rem;">Thanks for your purchase!</h1>
      <p>Here's your <strong>${packageName}</strong> from KMS Compliance Ltd:</p>
      <ul style="padding-left:20px;">${linksHtml}</ul>
      <p style="color:#5B616B; font-size:0.9rem;">
        Questions about these documents? Just reply to this email or reach us at
        admin@kmscompliance.com.
      </p>
    </div>
  `;
}

async function sendEmail({ to, subject, html }) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.RESEND_FROM_EMAIL || "admin@kmscompliance.com";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `KMS Compliance <${fromAddress}>`,
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend API error (${res.status}): ${body}`);
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return { statusCode: 500, body: "Server misconfigured" };
  }

  const rawBody = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body;
  const sigHeader = event.headers["stripe-signature"] || event.headers["Stripe-Signature"];

  try {
    verifyStripeSignature(rawBody, sigHeader, webhookSecret);
  } catch (err) {
    console.error("Signature verification failed:", err.message);
    return { statusCode: 400, body: "Invalid signature" };
  }

  let stripeEvent;
  try {
    stripeEvent = JSON.parse(rawBody);
  } catch (err) {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  if (stripeEvent.type !== "checkout.session.completed") {
    // Not an event we care about - acknowledge it so Stripe stops retrying.
    return { statusCode: 200, body: "Ignored (not a checkout completion)" };
  }

  const session = stripeEvent.data.object;
  const packageId = session.metadata && session.metadata.package_id;
  const customerEmail = session.customer_details && session.customer_details.email;

  if (!packageId || !PACKAGES[packageId]) {
    console.error("Unknown or missing package_id on session:", packageId);
    return { statusCode: 200, body: "Ignored (unknown package_id)" };
  }

  if (!customerEmail) {
    console.error("No customer email on session", session.id);
    return { statusCode: 200, body: "Ignored (no customer email)" };
  }

  const pkg = PACKAGES[packageId];

  try {
    await sendEmail({
      to: customerEmail,
      subject: `Your ${pkg.name} from KMS Compliance`,
      html: buildEmailHtml(pkg.name, pkg.files),
    });
  } catch (err) {
    console.error("Failed to send fulfillment email:", err.message);
    // Return 500 so Stripe retries the webhook automatically.
    return { statusCode: 500, body: "Email send failed" };
  }

  return { statusCode: 200, body: "OK" };
};
