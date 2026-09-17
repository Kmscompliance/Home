import Image from "next/image";

/**
 * Real KMS Compliance logo (from Matt), background removed and cropped.
 * `lockup` = full icon + "KMS COMPLIANCE" wordmark baked into the image —
 * only legible on light backgrounds (the wordmark is navy).
 * `icon` = butterfly mark only, colour-legible on both light and dark
 * backgrounds — pair with a separate text wordmark when used on navy.
 */
export function Logo({
  className = "",
  variant = "lockup",
}: {
  className?: string;
  variant?: "lockup" | "icon";
}) {
  if (variant === "icon") {
    return (
      <Image
        src="/brand/kms-icon.png"
        alt="KMS Compliance"
        width={594}
        height={250}
        className={`h-8 w-auto ${className}`}
        priority
      />
    );
  }

  return (
    <Image
      src="/brand/kms-logo.png"
      alt="KMS Compliance"
      width={703}
      height={371}
      className={`h-9 w-auto ${className}`}
      priority
    />
  );
}
