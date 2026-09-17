export function DocumentDisclaimer() {
  return (
    <div className="rounded-lg border border-kms-border bg-kms-surface p-4 text-xs leading-relaxed text-kms-text/80">
      <p>
        <strong className="text-kms-navy">This is a general template, not legal or regulatory advice.</strong>{" "}
        It must be tailored to your firm and reviewed by a qualified compliance
        professional before you submit or rely on it. KMS Compliance Ltd
        accepts no liability for use of this document without that review. See
        the full{" "}
        <a href="/legal/disclaimer" className="underline hover:text-kms-navy">
          disclaimer
        </a>
        .
      </p>
    </div>
  );
}
