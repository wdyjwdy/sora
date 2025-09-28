---
title: React
category: Handwrite
---

## Hooks

### useState

```js
let state;

function useState(initialValue) {
  state = state ?? initialValue;

  function setState(update) {
    if (typeof update === "function") {
      state = update(state);
    } else {
      state = update;
    }
    render();
  }

  return [state, setState];
}
```

### useReducer

```js
function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    setState((s) => reducer(s, action));
  }

  return [state, dispatch];
}
```
