import { describe, expect, it } from "vitest";
import { clampPillLeft } from "./DraggableHeaderPill";

describe("a pill in the chat's top bar", () => {
  it("keeps its whole width inside the bar, with a little air at both ends", () => {
    expect(clampPillLeft(-0.5, 120, 600)).toBeCloseTo(8 / 600);
    expect(clampPillLeft(2, 120, 600)).toBeCloseTo(1 - 128 / 600);
  });

  it("never leaves a pill wider than its bar off the edge", () => {
    expect(clampPillLeft(0.4, 900, 600)).toBeCloseTo(8 / 600);
  });

  it("leaves a bar with no width alone", () => {
    expect(clampPillLeft(0.25, 120, 0)).toBe(0.25);
  });
});
