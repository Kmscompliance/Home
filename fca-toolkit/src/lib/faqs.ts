export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "Are these templates legal or regulatory advice?",
    answer:
      "No. They're general starting templates based on FCA authorisation good practice for a small, founder-led firm. They are not tailored to any specific firm and must be reviewed by a qualified compliance professional before you submit or rely on them. KMS Compliance accepts no liability for use of a template without that review.",
  },
  {
    question: "What do I actually get after I pay?",
    answer:
      "An editable Word (.docx) file for the document you bought, delivered via a secure, time-limited download link by email, and also shown directly on the confirmation page after checkout in case the email is delayed.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. Checkout is guest-only — choose a document, pay with Stripe, and download. There's nothing to sign up for.",
  },
  {
    question: "How do I know what to fill in?",
    answer:
      "Every place you need to add your own details — firm name, FRN, regulated activities, SMF holder names, risk appetite, and so on — is highlighted with a bracketed label like [FIRM NAME], plus a short guidance note explaining what to insert and why. The same highlighting style is used consistently across all 13 documents.",
  },
  {
    question: "Can I preview a document before I buy it?",
    answer:
      "Yes. Every document page shows the first section plus a full table of contents of what the document covers, so you can judge relevance before paying. The rest stays locked until purchase.",
  },
  {
    question: "Is there a discount for buying multiple documents?",
    answer:
      "A full toolkit bundle covering all 13 documents is planned — see the Pricing section for details. For now, each document is sold individually.",
  },
  {
    question: "Who is KMS Compliance?",
    answer:
      "KMS Compliance Ltd is a UK FCA compliance consultancy for sole traders and small, founder-led financial services firms. These templates are adapted from the documents we use with our own consultancy clients.",
  },
];
