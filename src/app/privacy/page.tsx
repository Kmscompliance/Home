import { LegalPageShell } from "@/components/legal/LegalPageShell";

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy Policy" docLabel="Privacy Policy">
      <section>
        <h2 className="font-semibold">Who we are</h2>
        <p className="mt-2 text-brand-neutral-700">
          [Company name] (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates this demo. Contact: [contact
          email]. [Company registration number, if applicable]. [ICO registration number, if
          applicable — UK organisations that process personal data typically need to register with
          the Information Commissioner&rsquo;s Office].
        </p>
      </section>

      <section>
        <h2 className="font-semibold">What this demo actually collects today</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-brand-neutral-700">
          <li>
            Your name and email address, but only if you choose to leave them — either through the
            assistant&rsquo;s &ldquo;save and resume&rdquo; offer, or the optional form at the end of a
            quote. This is currently the only place we ask for anything that identifies you.
          </li>
          <li>
            What you type into the quote questions and the chat assistant. Free-text answers (e.g.
            describing your trade or line of work) and anything you say to the chat assistant are
            sent to Anthropic, the company whose Claude AI model powers this demo, so it can process
            what you&rsquo;ve written. Please don&rsquo;t enter anything you wouldn&rsquo;t want
            processed this way.
          </li>
          <li>
            The answers to the quote questions themselves (turnover band, years trading, claims
            history, and so on), logged without your name attached, so we can review how the demo is
            performing.
          </li>
          <li>
            Basic technical logs of how the assistant is used (e.g. whether a helpful nudge was
            shown) and how often the underlying AI is called — again, without anything that
            identifies you attached.
          </li>
        </ul>
        <p className="mt-2 text-brand-neutral-700">
          We don&rsquo;t currently use cookies, analytics, or advertising trackers on the parts of the
          site a visitor uses. The admin dashboard, which only our own team can access, uses one
          cookie to keep an admin signed in — that&rsquo;s not something a visitor to the quote flow
          ever receives.
        </p>
      </section>

      <section>
        <h2 className="font-semibold">Why we collect it</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-brand-neutral-700">
          <li>To run the quote demo itself — working out a simulated price from your answers.</li>
          <li>To follow up with you, only if you gave us your details and asked us to.</li>
          <li>To improve the demo and understand how it&rsquo;s being used.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-semibold">Who we share it with</h2>
        <p className="mt-2 text-brand-neutral-700">
          Anthropic processes the free text you type, as part of how the AI features work — see
          Anthropic&rsquo;s own privacy policy for how they handle it. We don&rsquo;t sell your data,
          and we don&rsquo;t share it with anyone else.
        </p>
      </section>

      <section>
        <h2 className="font-semibold">How long we keep it</h2>
        <p className="mt-2 text-brand-neutral-700">
          This is genuinely undefined in the system today, flagged here rather than made up: data is
          stored in files on the server running the demo, with no automatic deletion in place. A real
          retention policy — how long lead details, quote answers, and logs are kept, and how
          they&rsquo;re deleted on request — needs to be defined and built before this goes anywhere
          near real customers.
        </p>
      </section>

      <section>
        <h2 className="font-semibold">Your rights</h2>
        <p className="mt-2 text-brand-neutral-700">
          Under UK GDPR, you have rights over your personal data, including the right to ask what we
          hold about you, to have it corrected, and to have it deleted. To ask about any of this
          today, contact [contact email] — since this is a demo, the honest answer is likely
          &ldquo;we can delete what you gave us&rdquo;, not a fully built self-service process yet.
        </p>
      </section>

      <section>
        <h2 className="font-semibold">Where this policy needs work</h2>
        <p className="mt-2 text-brand-neutral-700">
          Before this is used with real customers, a compliance professional should at minimum: fill
          in the company details above; confirm this is still accurate against what the app actually
          collects; decide and document a real data retention/deletion policy; confirm whether ICO
          registration is required and register if so; and review the Anthropic sub-processor
          relationship, including whether a data processing agreement is needed.
        </p>
      </section>
    </LegalPageShell>
  );
}
