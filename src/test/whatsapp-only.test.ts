import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The store takes orders on WhatsApp only: there is no cart, no checkout and
 * no online payment anywhere on the site. This guard fails if any source file
 * reintroduces payment/checkout/cart content.
 */
function listFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...listFiles(full));
    else out.push(full);
  }
  return out;
}

const FORBIDDEN =
  /add to cart|checkout|installment|instalment|payment|credit card|debit card|easypaisa|jazzcash|cash on delivery/i;

describe("WhatsApp-only store rules", () => {
  it("never mentions carts, checkout or payments anywhere in the app source", () => {
    const files = listFiles("src")
      .filter((f) => /\.(tsx?|css)$/.test(f))
      .filter((f) => !f.startsWith("src/test"));
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      expect(
        readFileSync(file, "utf8"),
        `${file} must not mention checkout/payment content`,
      ).not.toMatch(FORBIDDEN);
    }
  });
});
