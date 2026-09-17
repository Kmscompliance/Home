/** A run of text within a paragraph or list item: plain text, or a highlighted placeholder. */
export type TextPart =
  | string
  | {
      /** The bracketed label shown to the reader, e.g. "FIRM NAME" renders as [FIRM NAME]. */
      placeholder: string;
      /** Short guidance shown inline next to the placeholder, explaining what to insert and why. */
      note: string;
    };

export type Block =
  | { type: "p"; parts: TextPart[] }
  | { type: "ul"; items: TextPart[][] }
  | { type: "ol"; items: TextPart[][] };

export interface DocumentSection {
  id: string;
  heading: string;
  blocks: Block[];
}

export interface DocumentBody {
  slug: string;
  /** One-line summary shown above the table of contents. */
  summary: string;
  sections: DocumentSection[];
  /** Anything the KMS team should double-check with a qualified compliance professional before this is sold. */
  regulatoryFlags?: string[];
}

/** Shorthand for building a placeholder text part. */
export function ph(placeholder: string, note: string): TextPart {
  return { placeholder, note };
}
