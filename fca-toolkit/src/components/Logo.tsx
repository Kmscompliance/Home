/**
 * Temporary placeholder logo recreated from Matt's description/reference image:
 * a geometric butterfly (navy upper wings, green lower wings) beside the
 * "KMS COMPLIANCE" wordmark. Swap for the real exported logo file once provided.
 */
export function Logo({ className = "", withWordmark = true }: { className?: string; withWordmark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M16 8C16 8 13.5 2 8.5 3C4.5 3.8 4 8 6.5 10.5C9 13 16 13.5 16 13.5V8Z" fill="#112F4F" />
        <path d="M16 8C16 8 18.5 2 23.5 3C27.5 3.8 28 8 25.5 10.5C23 13 16 13.5 16 13.5V8Z" fill="#1C4770" />
        <path d="M16 14C16 14 14 20.5 9.5 20.8C6 21 5 17.3 7 15C9 12.7 16 12.3 16 12.3V14Z" fill="#068A53" />
        <path d="M16 14C16 14 18 20.5 22.5 20.8C26 21 27 17.3 25 15C23 12.7 16 12.3 16 12.3V14Z" fill="#0AA868" />
        <line x1="16" y1="7" x2="16" y2="22" stroke="#112F4F" strokeWidth="1.2" />
      </svg>
      {withWordmark && (
        <span className="font-semibold tracking-[0.18em] text-kms-navy text-sm sm:text-base">
          KMS COMPLIANCE
        </span>
      )}
    </span>
  );
}
