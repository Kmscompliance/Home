import type { DocumentBody } from "./types";
import { riskManagementFramework } from "./risk-management-framework";

const registry: Record<string, DocumentBody> = {
  [riskManagementFramework.slug]: riskManagementFramework,
};

export function getDocumentBody(slug: string): DocumentBody | undefined {
  return registry[slug];
}
