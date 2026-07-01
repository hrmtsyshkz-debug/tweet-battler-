function full(half: number[]): number[] {
  return half.concat([...half].reverse());
}

function grid(rows: number[][]): number[][] {
  return rows.map(full);
}

/**
 * Hand-authored 14x14 body silhouettes (each row given as its left half,
 * mirrored to full width) so generated monsters read as actual creatures
 * instead of random noise blobs. One is picked deterministically per
 * fighter by the same seeded RNG used for stats/moves.
 */
export const SPRITE_TEMPLATES: number[][][] = [
  // Chibi: round tapered blob body with small feet
  grid([
    [0, 0, 0, 0, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ]),
  // Horn: chibi silhouette with a small horn bump
  grid([
    [0, 0, 1, 0, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ]),
  // Squat: wide toad/turtle body on a two-leg stance
  grid([
    [0, 0, 0, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 1, 1, 0],
    [0, 1, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ]),
  // Tall: slim, taller body
  grid([
    [0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
  ]),
];

export const TEMPLATE_EYE_ROW = 4;
export const TEMPLATE_EYE_COL_L = 5;
export const TEMPLATE_EYE_COL_R = 8;
