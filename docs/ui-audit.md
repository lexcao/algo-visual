# UI audit

Reviewed against the brief: typography, whitespace, hierarchy, color, motion, micro-interaction, responsive layout, originality. Benchmark is the craft level of Awwwards, Webby, and FWA winners that teach or operate a single mechanism (clear type, one signature move, the working state visible without decoration). This is an operate surface. The world contributes type, palette, density, and the contracting span. It does not restyle the controls into an instrument.

Self-review was three passes: the first screenshots showed the span cutting through the cells and the live half of the array clipped on a phone; the second pass fixed both; the third checked the step recording, including the found state.

## Checklist

| Dimension | Result | Notes |
|---|---|---|
| Typography | Pass | Noto Serif SC for titles, Noto Sans SC for UI, JetBrains Mono only in the code. Title, sentence, and array use different sizes. Body copy stays inside a readable measure. On a 12-cell phone row the numerals get small so the whole line stays visible. |
| Whitespace | Pass | The title has more air above the array than the array has under its sentence. Variants are a divided list, not a stack of cards. The trace is a list with a number, a sentence, and the array. |
| Visual hierarchy | Pass | The array is the largest thing in the viewport. One filled button. The status sentence says what the step did. Code sits under the controls and highlights the line that just ran. |
| Color | Pass | Lacquer shell, bone page, cinnabar for the midpoint, the span, and the primary button. Low is pine, high is amber, the target is an ink ring. Discarded values drop to one quiet tone. Checked pairs are above 4.5:1, including bone on cinnabar (7.26) and quiet ink on bone (6.51). |
| Motion | Pass | The span's left and width ease with `cubic-bezier(0.16, 1, 0.3, 1)`. Cell color moves with the same step. `prefers-reduced-motion: reduce` removes those transitions. Nothing is hidden until an entrance animation finishes. |
| Micro-interaction | Pass | Cells lift on hover and press down. The current variant is an underline, not a second fill. The primary button darkens on hover and becomes a lacquer "已找到" when the return line runs. Focus is a 2px ring. Reset stays a border button. |
| Responsive | Pass | At 390px the whole array stays on screen, including the 12-value duplicate row. The header stacks, variant links scroll, and the primary button goes full width. At 1440px the code block is visible under the controls. |
| Originality | Pass | The old page was four identical cards. This one is a measured span that shrinks to the live range, with the discarded half left as quiet numerals. The index shows the real arrays instead of icon cards. |

## What changed in review

1. The span is measured from the cell boxes, so the ticks sit in the gap under the live range instead of through the numerals.
2. Phone layout no longer forces a 52px cell, which had clipped the midpoint off the right edge.
3. A midpoint that the last step already moved past is not painted as the current mid, and the live readout hides it until the next pick.

The finish review scored six fixes and ended on ship for that list: the number row is the largest object, the index has a status and a filled 开始, low and high are ink, mono stays in the code, phone actions are full width, and the empty trace has an English line.

## Limits

The page is a study tool, not a campaign site. Twelve values on a 390px screen are dense on purpose: hiding them in a sideways scroll hid the search. The name, tagline, and icon are placeholders from `src/branding.json`. The favicon and OG image are generated from that file and are not a finished logo.
