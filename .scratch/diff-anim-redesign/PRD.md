Status: ready-for-agent

# PRD: Redesign DiffAnim — two-panel diffusion phase animation

## Problem Statement

The existing `DiffAnim` component is text-heavy and visually crude: five card-style divs with plain text fields, no spatial sense of what diffusion actually does to a swarm. It does not convey the simplicity of the algorithm or the emergent clustering behaviour that makes SDS interesting.

## Solution

Replace `DiffAnim` with a two-panel component in the same location in the page. The left panel shows the Python diffusion phase implementation with the active line highlighted as the animation steps. The right panel shows the swarm state as an SVG histogram: a horizontal line with five hypothesis positions, five agent circles that stack upward at their current position. A connecting line is drawn in the SVG between the current agent and the polled agent during the polling step.

## User Stories

1. As a reader following the prose, I want to watch the algorithm highlight in sync with the visual, so I can connect code to behaviour.
2. As a reader who skips straight to the animation, I want to understand what is happening without reading any prose first.
3. As a reader, I want the animation to run automatically so I can watch without clicking.
4. As a reader who wants to go slowly, I want to pause and step through one step at a time.

## Design Decisions

### Layout
Two panels side by side. Code panel on the left, swarm panel on the right. On the code panel, the active Python line gets a highlighted background. The swarm panel is an SVG element.

### Code panel
The Python diffusion phase implementation — approximately:

```python
for agent in agents:
    if not agent.active:
        polled = random.choice(agents)
        if polled.active:
            agent.hyp = polled.hyp
        else:
            agent.hyp = random.choice(hypotheses)
```

Syntax highlighting via `prism-react-renderer`. This library is chosen because it renders tokens as JSX, giving full control over the per-line DOM structure — the active-line highlight is a conditional class on a `<div>` wrapping each line. `prism-react-renderer` should be added as a site-wide utility (it will be reused across the site for other code examples).

### Swarm panel
SVG, inline in React (no D3). Five hypothesis positions laid out evenly along a horizontal line. Five agent circles. Agents at the same hypothesis stack vertically upward from the line (histogram / bar chart style). Active agents are coloured (e.g. green), inactive agents are grey.

During the polling step, an animated connecting line is drawn in the SVG between the current agent circle and the polled agent circle.

### Interaction
- Auto-plays on mount.
- Controls: Play/Pause, Step (advances one step), Reset.
- Step is available at all times; Play/Pause toggles auto-play.

### Agent count and search space
Five agents. Five hypothesis positions (segments of the horizontal line). This is enough to show convergence clearly without visual clutter.

## Implementation Notes

- `DiffAnim.tsx` and `diff-anim.css` are replaced in place — `App.tsx` import does not change.
- The `useDiffAnim` hook logic is retained (or ported); only the rendering changes.
- SVG positions for hypothesis slots are computed from fixed slot count and SVG width — no library needed.
- Stacking: agents at the same hypothesis are sorted by index and offset vertically by one circle-diameter each.
- The connecting line animates using a CSS transition on SVG `<line>` coordinates or opacity.
- `prism-react-renderer` is installed in `bean/package.json`.

## Testing Decisions

Visual verification in the browser. `npm run build` must pass. The animation should run, pause, step, and reset correctly. Convergence (agents clustering at one hypothesis) should be visually obvious after several seconds of auto-play.

## Out of Scope

- Test phase animation (that is a separate component).
- Global behaviour charts (convergence over time, steady-state plots).
- Responsive/mobile layout.
- Connecting the hypothesis positions to any real search problem (positions are abstract for now).
