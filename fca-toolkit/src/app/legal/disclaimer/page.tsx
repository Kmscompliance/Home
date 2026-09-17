import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer | KMS Compliance FCA Authorisation Toolkit",
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold text-kms-navy">Disclaimer</h1>

      <div className="mt-8 space-y-5 text-sm leading-relaxed text-kms-text">
        <p>
          The documents available through the FCA Authorisation Toolkit
          (&ldquo;the Templates&rdquo;) are provided by KMS Compliance Ltd
          (&ldquo;KMS Compliance&rdquo;) as general, editable starting points
          based on general FCA authorisation good practice for a small,
          founder-led financial services firm.
        </p>
        <p>
          The Templates are <strong>not legal or regulatory advice</strong>,
          and are not tailored to your firm&apos;s specific circumstances,
          regulated activities, business model or risk profile. They must be
          reviewed, amended and tailored by you, and reviewed by a qualified
          compliance professional, before they are submitted to the FCA or
          otherwise relied upon.
        </p>
        <p>
          KMS Compliance accepts no liability for any loss, damage, or
          regulatory consequence arising from the use of a Template that has
          not been reviewed and tailored in this way, or for any errors,
          omissions, or changes in law or regulatory expectation that may
          affect the accuracy of the Templates over time.
        </p>
        <p>
          Purchasing a Template does not create a client relationship between
          you and KMS Compliance, and does not constitute the provision of
          regulated advice.
        </p>
        <p>
          If you require advice specific to your firm&apos;s authorisation
          application, please contact KMS Compliance directly to discuss a
          consultancy engagement.
        </p>
      </div>
    </div>
  );
}
