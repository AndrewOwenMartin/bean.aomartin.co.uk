import React from 'react';

export type BooleanAction =
  | { type: 'toggle' }
  | { type: 'set'; value: boolean }
  | { type: 'off' }
  | { type: 'on' };

export function booleanReducer(value: boolean, action: BooleanAction) {
  switch (action.type) {
    case 'toggle':
      return !value;
    case 'set':
      return action.value;
    case 'off':
      return false;
    case 'on':
      return true;
  }
}

export interface BooleanHook {
  value: boolean;
  toggle: () => void;
  set: (value: boolean) => void;
  on: () => void;
  off: () => void;
}

export const useBoolean = (init: boolean) => {
  const [value, dispatch] = React.useReducer(booleanReducer, init);

  const toggle = () => dispatch({ type: 'toggle' });
  const set = (newValue: boolean) => dispatch({ type: 'set', value: newValue });
  const off = () => dispatch({ type: 'off' });
  const on = () => dispatch({ type: 'on' });

  return {
    value,
    dispatch,
    toggle,
    set,
    off,
    on,
  };
};
