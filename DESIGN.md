---
name: algo·pace
description: "A lacquer-and-bone study surface with one cinnabar measure."
colors:
  cinnabar: "#8E2A22"
  cinnabar-deep: "#731F19"
  mark: "#F6D5CE"
  selection: "#F0C7C0"
  lacquer: "#1A1410"
  bone: "#F3EEE6"
  bone-raised: "#FBF8F3"
  ink: "#1A1410"
  ink-soft: "#3F362F"
  ink-quiet: "#5C534A"
  line: "#DDD4C8"
  bone-dim: "#E4D5C6"
typography:
  display:
    fontFamily: "Noto Serif SC, Songti SC, Noto Serif, serif"
    fontSize: "clamp(1.75rem, 3vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Noto Serif SC, Songti SC, Noto Serif, serif"
    fontSize: "1.55rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Noto Serif SC, Songti SC, Noto Serif, serif"
    fontSize: "1.35rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Noto Sans SC, PingFang SC, Noto Sans, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
    fontFeature: "palt"
  label:
    fontFamily: "Noto Sans SC, PingFang SC, Noto Sans, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "0.04em"
  figure:
    fontFamily: "Noto Sans SC, PingFang SC, Noto Sans, sans-serif"
    fontSize: "clamp(1.15rem, 3vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "normal"
  code:
    fontFamily: "JetBrains Mono, Noto Sans Mono, ui-monospace, monospace"
    fontSize: "0.92rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
rounded:
  span: "2px"
  cell: "3px"
  control: "4px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "18px"
  section: "28px"
  page: "48px"
components:
  button-primary:
    backgroundColor: "{colors.cinnabar}"
    textColor: "{colors.bone}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.cinnabar-deep}"
    textColor: "{colors.bone}"
  button-primary-disabled:
    backgroundColor: "{colors.lacquer}"
    textColor: "{colors.bone}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "#E9E2D8"
    textColor: "{colors.ink}"
  nav-current:
    backgroundColor: "{colors.lacquer}"
    textColor: "{colors.bone}"
  cell:
    backgroundColor: "{colors.bone-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.figure}"
    rounded: "{rounded.cell}"
  cell-mid:
    backgroundColor: "{colors.cinnabar}"
    textColor: "{colors.bone}"
    typography: "{typography.figure}"
    rounded: "{rounded.cell}"
  cell-discarded:
    backgroundColor: "transparent"
    textColor: "{colors.ink-quiet}"
    rounded: "{rounded.cell}"
  cell-target:
    backgroundColor: "{colors.bone-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.cell}"
  span:
    backgroundColor: "{colors.cinnabar}"
    rounded: "{rounded.span}"
    height: "3px"
  code-current:
    backgroundColor: "{colors.mark}"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    rounded: "{rounded.control}"
  variant-row:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
    padding: "20px 8px"
  variant-row-hover:
    backgroundColor: "#E7E0D4"
    textColor: "{colors.ink}"
  tally:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
---

# Design System: algo·pace

## Overview

**Creative North Star: "The Suanpan Span"**

algo·pace is a study surface: a lacquer shell over a bone page, with cinnabar as the only accent. The accent fills the midpoint and the measured span, and it fills the one primary button. The same red marks whatever is current: the nav underline, the code-line number, the trace index, the caret, and the focus ring. Low and high stay ink. A cell outside the range drops to one quiet tone.

Chinese is the primary line. Noto Serif SC carries the brand, the page title, and the section titles. Noto Sans SC carries the UI, including the English line set under each serif title. JetBrains Mono is loaded for the code block and for nothing else. The page is one left-aligned column. Reading text holds to 68ch. The array is the working object, and the status sentence and the buttons sit directly under it.

The material is flat. Depth is the lacquer bar on bone, raised bone on the cells and the code block, and hairline rules between list rows. Corners stay short. The signature is the span: a cinnabar bar with end ticks, positioned from the live low and high cell boxes, easing closed when a bound moves. prefers-reduced-motion cuts that transition. The name is set in the serif. There is no logo and no cast shadow.

**Key Characteristics:**

- Lacquer header, bone page, cinnabar as the only accent
- Serif Chinese titles, sans UI, mono kept inside the code block
- Low and high marks in ink; discarded cells in one quiet tone
- A span measured from the live cell boxes
- Flat surfaces, hairline rules, inset marks for the current item and the target
- One filled button, with reset as a ghost

## Colors

The palette is a warm near-black, a bone page, and one cinnabar accent. Tints of that red are washes, not extra hues.

### Primary

- **Cinnabar** (#8E2A22): The midpoint cell, the span and its ticks, and the filled primary button. Also the current nav underline, the current code-line number, keyword tokens, the trace index, the caret, the focus ring on bone, and the not-found text link.
- **Cinnabar Deep** (#731F19): The primary button on hover.
- **Cinnabar Wash** (#F6D5CE): The background of the current code line only.
- **Selection Wash** (#F0C7C0): Text selection, with lacquer as the selection text.

### Neutral

- **Lacquer** (#1A1410): The full-bleed header, the disabled primary button, and the theme color. The no-JS fallback sets the serif name in this color on bone, because that document has no header bar.
- **Bone** (#F3EEE6): The page background, header text, and the label on cinnabar fills.
- **Raised Bone** (#FBF8F3): In-range cells, the code block, and the skip link.
- **Ink** (#1A1410): Body text, in-range figures, and the low and high marks. The same value as lacquer.
- **Soft Ink** (#3F362F): English lines under titles, the lede's English, bounds, the legend, captions, the footer, and empty-trace copy.
- **Quiet Ink** (#5C534A): Discarded figures, hints, and code line numbers that are not current.
- **Hairline** (#DDD4C8): Rules on the variant index, the trace, the footer, the static intro list, and the code block border.
- **Dim Bone** (#E4D5C6): The English line under each nav label, on the lacquer bar.

### Named Rules

**The One Accent Rule.** Cinnabar is the only accent. It fills the midpoint, the span, and the primary button, and it marks the current nav underline, the current code-line number, keyword tokens, the trace index, the caret, and the focus ring. Low and high marks stay ink. The code-line wash and text selection are tints of the same red, not new hues.

**The Shared Pigment Rule.** Lacquer and ink are one value. The header, the disabled primary, body text, and the low and high marks all use it. A second near-black does not belong.

**The Quiet Discard Rule.** A cell outside the live range loses its fill and its border and is set in quiet ink. It does not take a hue of its own.

## Typography

**Display Font:** Noto Serif SC (Songti SC, Noto Serif, serif)
**Body Font:** Noto Sans SC (PingFang SC, Noto Sans, sans-serif)
**Label/Mono Font:** JetBrains Mono (Noto Sans Mono, ui-monospace, monospace), code block only

**Character:** Serif for the Chinese title line, sans for everything a person operates, mono inside the code block. The shipped files are Noto Sans SC at 400 and 600, Noto Serif SC at 600, and JetBrains Mono at 400. Body copy turns on `palt`. Figures that must line up use tabular numbers on the sans.

### Hierarchy

- **Display** (600, clamp(1.75rem, 3vw, 2.5rem), line-height 1.12, letter-spacing -0.03em): The Chinese page title. At the 720px breakpoint the size is 1.25rem. The English line under it is the sans at 1.05rem in soft ink, with no letter-spacing, and 0.9rem at that breakpoint.
- **Headline** (600, 1.55rem, line-height 1.2, letter-spacing -0.03em): Section titles (the code heading, the trace, the variant list). The English companion in the same heading is the sans at 0.95rem in soft ink.
- **Title** (600, 1.35rem, line-height 1, letter-spacing -0.03em): The brand name in the lacquer bar and in the no-JS fallback.
- **Body** (400, 1.0625rem, line-height 1.55): UI copy. The Chinese lede is 1.05rem with line-height 1.5. The status sentence under the array is 1.125rem with line-height 1.45. English partners under those are soft ink, 1rem and 0.95rem. Reading blocks stop at 68ch.
- **Label** (600, 0.75rem, line-height 1.1, letter-spacing 0.04em): The 低 / 中 / 高 marks under a cell. Low and high are ink. Mid is cinnabar. The step unit 步 is soft ink at 0.8rem with letter-spacing 0.08em, set beside a 1.65rem tabular figure.
- **Figure** (600, clamp(1.15rem, 3vw, 2.5rem), line-height 1): The number in an in-range cell, tabular. At the 720px breakpoint the size is 1rem. A compact trace cell uses 0.95rem.
- **Code** (400, 0.92rem, line-height 1.65): The source block, and only the source block.

### Named Rules

**The Serif Title Rule.** Noto Serif SC is the brand, the Chinese page title, and section titles. The English line paired with each of those is Noto Sans SC in soft ink. The rest of the UI is the sans.

**The Mono Fence Rule.** JetBrains Mono appears only inside the code block. Cell figures, the step count, bounds, and trace indexes use the sans with tabular numbers.

## Layout

The column is `min(1120px, calc(100% - 48px))`, centered, and shared by the header inner row, the main work, the footer, and the no-JS intro. At the 720px breakpoint the subtraction becomes 32px, so the side inset drops from 24px to 16px. Text that is read as a sentence stops at 68ch. Everything is left-aligned. The header is the only full-bleed band.

The header row is at least 72px tall, with the brand and the variant links at opposite ends and a 24px gap. Below 720px the row stacks, padding 16px 0, and the nav scrolls on one line with a 16px gap. English nav labels hide at that breakpoint. Main padding is 28px 0 16px, and 20px on top below 720px. A section title arrives with 36px of space above it (40px below 720px) and 12px below. The footer has a hairline along the top, then 28px 0 48px of padding, in soft ink at 0.95rem.

The array is a single grid of equal columns, gap 8px (4px below 720px), scrolling sideways when the squares need it. The status sentence and the control row sit under the grid with 8px and then 18px of separation. The control row is a wrap of tally, bounds, ghost, and primary, gap 12px 16px. Below 720px that row becomes a column and both buttons go full width. On the index, where the primary is the only control in the bar, the bar aligns it to the end.

The no-JS intro uses the same column, the same serif title, and a hairline stack of variant links. It has no lacquer bar. Its padding is 48px 0 64px.

Above 720px the cell figure uses the same 2.5rem ceiling as the Chinese title, and each cell is a square up to 120px, which is what makes the row the large object. At 720px the title is 1.25rem and the cell figure is 1rem.

### Named Rules

**The Single Column Rule.** One left-aligned column, `min(1120px, calc(100% - 48px))`, with reading text at 68ch. The lacquer header is the only full-bleed band.

## Elevation & Depth

The system does not cast shadows. Layers are tonal. The lacquer bar sits on the bone page. In-range cells and the code block are a step lighter than the page (raised bone). The current code line is a cinnabar wash on that raised bone. Lists divide with a 1px hairline, not a card and not a shadow.

The box-shadows that do exist are inset marks. The current nav item carries `inset 0 -2px 0` in cinnabar. A target cell carries `inset 0 0 0 2px` in ink, or in bone when that cell is also the midpoint. A cell hover lifts 2px with `translateY(-2px)` and lands again on press. A button press moves 1px down. Neither hover draws a shadow. In forced colors, the span, the midpoint cell, and the primary button take a CanvasText border so the measure survives.

### Shadow Vocabulary

- **Nav current** (`box-shadow: inset 0 -2px 0 #8E2A22`): The variant link for the open page. The bar itself stays flat.
- **Target ring** (`box-shadow: inset 0 0 0 2px #1A1410`): A target cell that is not the midpoint.
- **Target ring on the midpoint** (`box-shadow: inset 0 0 0 2px #F3EEE6`): The same ring, in bone, so it reads on the cinnabar fill.

### Named Rules

**The Flat Mark Rule.** No cast shadow. Depth is lacquer on bone, raised bone on cells and code, and the cinnabar wash on the current code line. Inset rules mark the current nav item and the target cell. Hover lifts a cell by 2px and does not grow a shadow.

## Shapes

Corners are short and consistent. The span and the 12px legend swatches use a 2px radius. Cells use a 3px radius. Buttons and the code block use a 4px radius. Cells are squares (`aspect-ratio: 1`), capped at 120px, and capped at 40px in a compact trace row.

The span is a 3px bar. Its ticks are 2px wide and 11px tall, starting 4px above the bar. Hairlines are 1px. The variant index, the trace, and the no-JS link list are divided rows: a rule on the top of the list and a rule under each row, with no surrounding card.

### Named Rules

**The Short Corner Rule.** Radius stays at 2px on the span and the legend swatches, 3px on cells, and 4px on buttons and the code block. Cells are squares.

## Components

### Buttons

One filled action, one ghost. Both are the sans at weight 600, 4px corners, padding 0 18px, min-height 44px. Below 720px both are full width and min-height 48px. Press moves the control 1px down over 160ms. The easing is cubic-bezier(0.16, 1, 0.3, 1). Focus uses the global ring.

- **Shape:** A short corner (4px), 44px minimum height, 48px and full width below 720px.
- **Primary:** Cinnabar fill, bone text, a 1px cinnabar border, min-width 7.5rem. This is 开始, 下一步, or the index 开始 link. Hover darkens to cinnabar deep, border included. The found state disables it: lacquer fill and border, bone text, default cursor.
- **Hover / Focus:** Hover is a color change, 160ms. Focus-visible is a 2px cinnabar outline, 3px offset. On the lacquer bar the outline is bone.
- **Ghost:** Transparent, ink text, a 1px #C9BFB2 border. Hover wash is #E9E2D8. This is 重置, and it is the only second button.

### Navigation

The header is a lacquer bar. The brand is the serif title size, bone, with no underline. Variant links are bone at 0.95rem, padding 8px 0, with the English name in dim bone at 0.75rem under the Chinese. The current link is an inset 2px cinnabar underline, not a pill and not a second fill. Focus inside the bar is a bone outline. Below 720px the links sit on one scrolling row and the English line is hidden. The skip link is raised bone with ink text, off-screen until focused.

### Array cells

An in-range cell is raised bone, ink figure, a 1px #D5CBBD border, a 3px corner, and a square up to 120px. The figure is the sans at weight 600, tabular, clamp(1.15rem, 3vw, 2.5rem). Hover lifts 2px. While a search is running, the cell is disabled: the lift stops and the cursor is not-allowed. Color does not dim.

- **Midpoint:** Cinnabar fill, cinnabar border, bone figure.
- **Discarded:** Transparent background, transparent border, quiet ink. The figure is the regular sans (400), not the 600 of an in-range cell.
- **Target:** The in-range cell plus an inset 2px ink ring. On the midpoint the ring is bone.
- **Marks:** 低 and 高 in ink, 中 in cinnabar, 0.75rem, weight 600, letter-spacing 0.04em, 18px under the cell (14px in a compact row).
- **Legend:** 12px swatches, 2px corners. Low and high are ink. Mid is cinnabar. Target is raised bone with the ink ring. The words are soft ink at 0.875rem.

### Measured span

The span is the signature. It is a 3px cinnabar bar with a 2px radius and square end ticks, 2px by 11px. It is positioned from the live boxes: left at the low cell's left edge, width through the high cell's right edge, top 8px below the cell bottom. Left, width, and top transition together over 520ms with cubic-bezier(0.16, 1, 0.3, 1). The bar sits under the cells and above the marks, ignores the pointer, and is hidden when the range is not live. Compact trace rows use the same measurement. prefers-reduced-motion sets the transition to none, so the bar jumps to the new bounds.

### Code block

Raised bone, a 1px hairline border, a 4px corner, 0.92rem mono, line-height 1.65. Each line is a grid: a 3rem line-number column, then the source. Line numbers are quiet ink and tabular. The current line is the cinnabar wash, and its line number is cinnabar. Keyword tokens are cinnabar. Comments, numbers, and names stay ink. The block scrolls sideways rather than wrapping.

### Variant index

A divided list, not a set of cards. Each row is a grid, `minmax(140px, 200px)` for the name and a flexible column for the array, padding 20px 8px, with a hairline under the row. The Chinese name is 1.15rem weight 600. The English name is soft ink at 0.9rem. The array is the sans, tabular, weight 600, 1.05rem, letter-spacing 0.04em. Hover washes the row with #E7E0D4. Below 720px the name and the array stack, and the array takes the full width. The index page's sample row above this list is the same cell-and-span component, read-only.

### Step tally

The step count is always on the control row. The unit 步 is soft ink, 0.8rem, letter-spacing 0.08em. The number is ink, 1.65rem, weight 600, line-height 1, letter-spacing -0.04em, tabular. Bounds beside it are soft ink at 0.95rem, tabular. The hint under the row is quiet ink at 0.8rem.

### Trace

A hairline list. The index is cinnabar, tabular, 1.15rem, weight 600, letter-spacing -0.04em, in a 2.5rem column. The sentence is body copy at 68ch, with the English line in soft ink at 0.92rem. Under each sentence, a compact read-only array replays that step with the same cells and the same measured span.

### Text link

Inline navigation stays ink on bone, or bone on lacquer. The recovery link on the missing page is the exception: cinnabar, weight 600, underline offset 0.18em.

### Named Rules

**The Measured Span Rule.** Left, width, and top come from the low and high cell boxes: left at the low cell's left, width through the high cell's right, top 8px below the cell bottom. Those three ease over 520ms with cubic-bezier(0.16, 1, 0.3, 1). prefers-reduced-motion removes the transition.

**The Single Primary Rule.** The step action is the one filled cinnabar button. Reset is the ghost. The found state keeps the button and disables it to lacquer. Below 720px both buttons are full width and 48px tall.

## Do's and Don'ts

### Do:

- **Do** keep the page bone and the app header lacquer, and use that same value for ink.
- **Do** fill the midpoint and the measured span with cinnabar, and keep the low and high marks in ink.
- **Do** clear the fill and the border of a discarded cell and set its figure in quiet ink.
- **Do** position the span from the live cell boxes, 8px below the cell bottom, and ease left, width, and top over 520ms unless reduced motion is requested.
- **Do** set Chinese titles in Noto Serif SC and the UI in Noto Sans SC, and keep JetBrains Mono inside the code block.
- **Do** use one filled cinnabar button for the step and a ghost button for reset.
- **Do** draw focus as a 2px outline offset 3px, cinnabar on bone and bone on the lacquer header.

### Don't:

- **Don't** add an accent that is not cinnabar or a wash of it.
- **Don't** paint the low or high marks in cinnabar.
- **Don't** give a discarded cell a fill, a border, or a hue of its own.
- **Don't** cast a drop shadow. Inset rules are reserved for the current nav item and the target ring.
- **Don't** set interface text, figures, or counts in JetBrains Mono.
- **Don't** place a second filled button beside the primary.
- **Don't** size the span from a column index. It follows the measured cell boxes.
