import type { Block, TextPart } from "@/lib/document-content/types";

/** The one consistent placeholder style used across every document: a highlighted
 * bracketed label plus a short inline guidance note, identical on web and in the
 * downloaded Word file. */
function Placeholder({ label, note }: { label: string; note: string }) {
  return (
    <span className="inline">
      <mark className="rounded bg-kms-highlight px-1.5 py-0.5 font-medium text-kms-navy ring-1 ring-inset ring-kms-highlight-border">
        [{label}]
      </mark>{" "}
      <span className="text-[0.85em] italic text-kms-text/55">({note})</span>
    </span>
  );
}

function renderParts(parts: TextPart[]) {
  return parts.map((part, i) =>
    typeof part === "string" ? (
      <span key={i}>{part}</span>
    ) : (
      <Placeholder key={i} label={part.placeholder} note={part.note} />
    )
  );
}

export function RichBlock({ block }: { block: Block }) {
  if (block.type === "p") {
    return <p className="text-sm leading-relaxed text-kms-text sm:text-base">{renderParts(block.parts)}</p>;
  }

  const ListTag = block.type === "ul" ? "ul" : "ol";
  return (
    <ListTag className={`space-y-1 pl-5 text-sm leading-relaxed text-kms-text sm:text-base ${block.type === "ul" ? "list-disc" : "list-decimal"}`}>
      {block.items.map((item, i) => (
        <li key={i}>{renderParts(item)}</li>
      ))}
    </ListTag>
  );
}
