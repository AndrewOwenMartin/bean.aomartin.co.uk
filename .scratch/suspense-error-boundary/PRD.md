Status: ready-for-agent

# PRD: Error boundary for lazy-loaded MathComparison

## Problem Statement

`MathComparison` (KaTeX) is lazy-loaded via `React.lazy`. If the chunk fails to fetch — flaky connection, bad deploy — the `Suspense` fallback renders forever. The math table silently disappears with no message and no way to recover.

## Solution

Wrap the `<Suspense>` boundary in an error boundary that catches chunk load failures and renders a minimal fallback.

## Implementation Notes

React doesn't ship a built-in error boundary component; it must be a class component or use a library. The simplest approach is a small reusable `ErrorBoundary` class component in `bean/src/ErrorBoundary.tsx`:

```tsx
class ErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() {
    return this.state.error ? this.props.fallback : this.props.children;
  }
}
```

In `App.tsx`:

```tsx
<ErrorBoundary fallback={<p>Could not load mathematical comparison.</p>}>
  <React.Suspense fallback={null}>
    <MathComparison />
  </React.Suspense>
</ErrorBoundary>
```

`ErrorBoundary` will be reusable for any future lazy-loaded component on the site.

## Testing

Simulate a network failure (DevTools → Network → block the `MathComparison-*.js` chunk), reload, confirm the fallback message renders instead of a blank space.
