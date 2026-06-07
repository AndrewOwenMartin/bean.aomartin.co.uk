Status: ready-for-agent

# PRD: Respect prefers-reduced-motion in DiffAnim

## Problem Statement

`DiffAnim` auto-plays on mount. For users with vestibular disorders, unexpected looping motion can cause physical discomfort. The OS-level "reduce motion" preference exists precisely for this and we're ignoring it.

## Solution

Check `prefers-reduced-motion` at initialisation and start paused if it's set. The animation remains fully functional — the user can still hit Play manually.

## Implementation Notes

In `useDiffAnim`, replace the hardcoded `true` initial value of `isPlaying`:

```ts
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const [isPlaying, setIsPlaying] = React.useState(!prefersReduced);
```

No other changes needed. The controls already let the user play manually.

## Testing

Enable "Reduce motion" in OS accessibility settings, reload the page, confirm the animation starts paused. Disable it, reload, confirm it auto-plays.
