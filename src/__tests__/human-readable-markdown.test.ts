import { describe, expect, it } from "vitest";
import {
  deriveHumanTitle,
  escapeMarkdownInline,
  normalizeHumanText,
  renderDerivedMarkdownBanner,
  renderNextAction,
} from "../human-readable-markdown.js";

describe("Human-Readable Markdown Contract helpers", () => {
  it("derives stable titles from the first meaningful source sentence", () => {
    const source = [
      "  ## Claim heading",
      "",
      "- Designed a deterministic evidence review workflow. Additional context follows.",
    ].join("\n");
    expect(deriveHumanTitle(source, "Fallback"))
      .toBe("Claim heading Designed a deterministic evidence review workflow.");
    expect(deriveHumanTitle(source, "Fallback"))
      .toBe(deriveHumanTitle(source, "Fallback"));
    expect(deriveHumanTitle("  ", "Fallback")).toBe("Fallback");
  });

  it("truncates deterministically at a word boundary", () => {
    const value = "Designed a deterministic, evidence-grounded review workflow that remains readable without opening another artifact.";
    const title = deriveHumanTitle(value, "Fallback", 64);
    expect(title).toBe("Designed a deterministic, evidence-grounded review workflow...");
    expect(title.length).toBeLessThanOrEqual(64);
  });

  it("normalizes source formatting and escapes Markdown control characters", () => {
    expect(normalizeHumanText("## Heading\r\n- item   text")).toBe("Heading item text");
    expect(escapeMarkdownInline("Claim | [review] *state*"))
      .toBe("Claim \\| \\[review\\] \\*state\\*");
  });

  it("renders a read-only boundary and explicit next action", () => {
    const banner = renderDerivedMarkdownBanner("canonical JSON");
    expect(banner).toContain("GENERATED, READ-ONLY VIEW");
    expect(banner).toContain("Canonical JSON remains the source of truth.");
    expect(renderNextAction("Review the canonical JSON.")).toBe([
      "## Next Action",
      "",
      "Review the canonical JSON.",
    ].join("\n"));
  });
});
