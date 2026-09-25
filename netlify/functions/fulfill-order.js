// Stripe webhook handler: fires when a Payment Link purchase completes,
// looks up which pack was bought (via the `package_id` metadata set on
// each Payment Link), and emails the buyer their documents as real file
// attachments via Resend.
//
// No Stripe or Resend npm packages used on purpose - this keeps the
// function dependency-free (Node's built-in `crypto` covers signature
// verification, `fs` reads the attached files), so there's nothing to
// `npm install` and no build step needed. Both API calls are plain
// HTTPS requests.
//
// The actual document files live in ./documents (bundled with this
// function via netlify.toml's `included_files` - they are never part
// of the public website, only this function can read them).

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const DOCS_DIR = path.join(__dirname, "documents");

// ---------------------------------------------------------------------
// Package catalogue - one entry per Payment Link's `package_id`.
// `files` are attached for real. `pending` lists documents still being
// finalised for that pack - named in the email so buyers know it's
// coming, not silently missing.
// ---------------------------------------------------------------------
const AML_PACK_FILES = [
  "Anti_Money_Laundering_Policy_v2.0_Template.docx",
  "Anti_Money_Laundering_Incident_Register_v2.0_Template.docx",
  "AML_Business_Wide_Risk_Assessment_v2.0_Template.xlsx",
  "Sanctions_Screening_Log_v2.0_Template.xlsx",
  "Conflicts_of_Interest_Register_v2.0_Template.xlsx",
  "Gifts_and_Hospitality_Register_v2.0_Template.xlsx",
];

const COMPLAINTS_PACK_FILES = [
  "Complaints_Procedure_v2.0_Template.docx",
  "Complaints_Register_v2.0_Template.xlsx",
  "Compliance_Breach_Log_v2.0_Template.xlsx",
];

const COMPLIANCE_MONITORING_PACK_FILES = [
  "Compliance_Monitoring_Plan_v2.0_Template.docx",
  "Compliance_Monitoring_Programme_Policy_v2.0_Template.docx",
  "Compliance_Monitoring_Schedule_v2.0_Template.xlsx",
  "File_Review_Record_v2.0_Template.xlsx",
  "Corrective_Action_Log_v2.0_Template.xlsx",
  "Compliance_Universe_Register_v2.0_Template.xlsx",
  "Data_Processing_Policy_v2.0_Template.docx",
  "Record_of_Processing_Activities_v2.0_Template.xlsx",
  "Data_Rights_Request_Log_v2.0_Template.xlsx",
  "Data_Breach_Log_v2.0_Template.xlsx",
  "Data_Protection_Complaints_Log_v2.0_Template.xlsx",
  "Data_Retention_Schedule_v2.0_Template.xlsx",
  "DPIA_Register_v2.0_Template.xlsx",
];

const CUSTOMER_DUE_DILIGENCE_PACK_FILES = [
  "Customer_Due_Diligence_Policy_v2.0_Template.docx",
  "Customer_Vulnerability_Policy_v2.0_Template.docx",
  "Customer_Due_Diligence_Checklist_v2.0_Template.xlsx",
  "Enhanced_Due_Diligence_Checklist_v2.0_Template.xlsx",
  "Customer_Due_Diligence_Register_v2.0_Template.xlsx",
];

const SENIOR_MANAGEMENT_PACK_FILES = [
  "SMCR_Statement_of_Responsibilities_v2.0_Template.docx",
  "FIT_and_Proper_Questionnaire_v1.0.docx",
];

const CONSUMER_DUTY_PACK_FILES = [
  "Consumer_Duty_Implementation_Plan_v2.0_Template.docx",
  "Consumer_Duty_Outcome_MI_v2.0_Template.xlsx",
  "Target_Market_Register_v2.0_Template.xlsx",
  "Fair_Value_Register_v2.0_Template.xlsx",
  "Consumer_Duty_Board_Report_Actions_v2.0_Template.xlsx",
  "Financial_Promotions_Policy_v2.0_Template.docx",
  "Financial_Promotions_Log_v2.0_Template.xlsx",
  "Financial_Promotion_Approval_Checklist_v2.0_Template.xlsx",
];

const RISK_MANAGEMENT_PACK_FILES = ["Risk_Management_Framework_v2.0_Template.docx", "Risk_Assessment_Log_v2.0_Template.xlsx"];

const TRAINING_PACK_FILES = [
  "Training_and_Competence_Policy_v2.0_Template.docx",
  "Training_Matrix_v2.0_Template.xlsx",
  "Training_Log_v2.0_Template.xlsx",
  "Competence_Register_v2.0_Template.xlsx",
  "CPD_Log_v2.0_Template.xlsx",
  "Individual_Training_Record_v2.0_Template.xlsx",
];

const PACKAGES = {
  "aml-pack": { name: "AML Pack", files: AML_PACK_FILES, pending: [] },
  "complaints-pack": { name: "Complaints Pack", files: COMPLAINTS_PACK_FILES, pending: [] },
  "compliance-monitoring-pack": { name: "Compliance Monitoring Pack", files: COMPLIANCE_MONITORING_PACK_FILES, pending: [] },
  "customer-due-diligence-pack": { name: "Customer Due Diligence Pack", files: CUSTOMER_DUE_DILIGENCE_PACK_FILES, pending: [] },
  "senior-management-pack": { name: "Senior Management Pack", files: SENIOR_MANAGEMENT_PACK_FILES, pending: [] },
  "consumer-duty-pack": { name: "Consumer Duty Pack", files: CONSUMER_DUTY_PACK_FILES, pending: [] },
  "risk-management-pack": { name: "Risk Management Pack", files: RISK_MANAGEMENT_PACK_FILES, pending: [] },
  "training-pack": { name: "Training Pack", files: TRAINING_PACK_FILES, pending: [] },
  "complete-bundle": {
    name: "Complete Authorisation Pack (all 8 packs)",
    files: [
      ...AML_PACK_FILES,
      ...COMPLAINTS_PACK_FILES,
      ...COMPLIANCE_MONITORING_PACK_FILES,
      ...CUSTOMER_DUE_DILIGENCE_PACK_FILES,
      ...SENIOR_MANAGEMENT_PACK_FILES,
      ...CONSUMER_DUTY_PACK_FILES,
      ...RISK_MANAGEMENT_PACK_FILES,
      ...TRAINING_PACK_FILES,
    ],
    pending: [],
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

function buildEmailHtml(packageName, fileNames, pending) {
  const fileListHtml = fileNames
    .map((f) => `<li style="margin-bottom:6px;">${prettifyFilename(f)}</li>`)
    .join("");

  const pendingHtml =
    pending && pending.length
      ? `<p style="color:#5B616B;font-size:0.9rem;">
           Still being finalised, on the way separately: ${pending.join(", ")}.
         </p>`
      : "";

  return `
    <div style="font-family: Arial, sans-serif; color: #23262B; max-width: 560px; margin: 0 auto;">
      <h1 style="color:#11304F; font-size:1.4rem;">Thanks for your purchase!</h1>
      <p>Here's your <strong>${packageName}</strong> from KMS Compliance Ltd, attached to this email:</p>
      <ul style="padding-left:20px;">${fileListHtml}</ul>
      ${pendingHtml}
      <p style="color:#5B616B; font-size:0.9rem;">
        Questions about these documents? Just reply to this email or reach us at
        admin@kmscompliance.com.
      </p>
    </div>
  `;
}

function prettifyFilename(filename) {
  return filename.replace(/_v\d+(\.\d+)?(_Template)?\.(docx|xlsx)$/i, "").replace(/_/g, " ");
}

function loadAttachments(fileNames) {
  return fileNames.map((filename) => {
    const filePath = path.join(DOCS_DIR, filename);
    const content = fs.readFileSync(filePath).toString("base64");
    return { filename, content };
  });
}

async function sendEmail({ to, subject, html, attachments }) {
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
      attachments,
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
    const attachments = loadAttachments(pkg.files);
    await sendEmail({
      to: customerEmail,
      subject: `Your ${pkg.name} from KMS Compliance`,
      html: buildEmailHtml(pkg.name, pkg.files, pkg.pending),
      attachments,
    });
  } catch (err) {
    console.error("Failed to send fulfillment email:", err.message);
    // Return 500 so Stripe retries the webhook automatically.
    return { statusCode: 500, body: "Email send failed" };
  }

  return { statusCode: 200, body: "OK" };
};
