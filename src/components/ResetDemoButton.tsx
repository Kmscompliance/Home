"use client";

export function ResetDemoButton() {
  function handleReset() {
    try {
      window.localStorage.clear();
      window.sessionStorage.clear();
    } catch {
      // storage can be unavailable (private browsing, etc.) — reset still
      // works via the hard navigation below either way
    }
    // A full navigation, not a client-side route change, so every
    // component remounts from scratch — the wizard, the assistant thread,
    // everything.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/";
  }

  return (
    <button
      type="button"
      onClick={handleReset}
      className="text-sm text-brand-neutral-500 hover:text-brand-navy-900"
      title="Clear this browser's demo session and start fresh"
    >
      Reset demo
    </button>
  );
}
