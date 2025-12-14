import { describe, it, expect } from "vitest";
import fc from "fast-check";

describe("Property-Based Test Setup", () => {
  it("should run property-based tests with fast-check", () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        return n + 0 === n;
      }),
      { numRuns: 100 }
    );
  });

  it("should verify string concatenation property", () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (a, b) => {
        const result = a + b;
        return result.startsWith(a) && result.endsWith(b);
      }),
      { numRuns: 100 }
    );
  });
});
