# Coding Style

## Naming

Use full words in identifiers. Avoid terse abbreviations when a full word is available.

```ts
// bad
const ri = (n: number) => Math.floor(Math.random() * n);

// good
const randomInt = (count: number) => Math.floor(Math.random() * count);
```

Established abbreviations are acceptable: `Int`, `Str`, `Ref`, `Idx`, and similar.

## Case conventions

- **JS/TS:** camelCase for variables and functions; PascalCase for types and classes.
- **Python:** snake_case for variables and functions; PascalCase for classes and types.
- **Constants** may always be UPPER_SNAKE_CASE in either language.

## No magic strings

If a string literal appears more than once, extract it to a named constant.

```ts
// bad
if (step === "nextAgent") { ... }
...
setStep("nextAgent");

// good
const NEXT_AGENT = "nextAgent";
if (step === NEXT_AGENT) { ... }
...
setStep(NEXT_AGENT);
```

## Functions

Use fat arrow notation for all functions.

```ts
// bad
function randomInt(count: number) { return Math.floor(Math.random() * count); }

// good
const randomInt = (count: number) => Math.floor(Math.random() * count);
```

Only use `function` declarations where `this` binding is strictly required — and prefer to restructure the code to avoid needing `this` at all.

## React: separate component from hook

Every React component should have a companion `useComponent` hook defined in the same file. The hook owns all state and logic; the component owns JSX and event-to-value conversion.

```tsx
const useMyComponent = (init) => {
  // call React hooks and custom hooks here

  // define all functions here — they form a "private" API
  // functions should never take a DOM event; accept typed values instead
  // the event-to-value conversion happens in the component

  return {
    // "public" values and functions
  };
};

const MyComponent = (props: ReturnType<typeof useMyComponent>) => {
  // minimise hooks here — prefer the custom hook
  // convert events to values before passing to hook functions:
  // <input onChange={event => state.myInput.set(event.target.value)} />
  return <>{/* component JSX */}</>;
};
```

If the hook becomes complex, prefer extracting state transitions into a reducer and using `useReducer`.

## React: prefer spread props

Avoid passing many individual props. Compose an object and spread it.

```tsx
// bad
<MyComponent a={a} b={b} c={c} />

// good
<MyComponent {...myComponentProps} />
```

## Styles

Prefer CSS files over inline styles.
