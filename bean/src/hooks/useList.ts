import React from "react";

export type ListAction<StateType, ItemAction> =
  | {
      index: number;
      action: ItemAction;
      type: "setItem";
      itemReducer: (state: StateType, action: ItemAction) => StateType;
    }
  | {
      type: "append";
      item: StateType;
    }
  | {
      type: "insertItem";
      item: StateType;
      index: number;
    }
  | {
      index?: number;
      type: "remove";
    }
  | {
      type: "set";
      newList: StateType[];
    }
  | {
      type: "map";
      action: ItemAction;
      itemReducer: (state: StateType, action: ItemAction) => StateType;
    }
  | {
      type: "replaceItem";
      index: number;
      newValue: StateType;
    }
  | {
      type: "toggle";
      item: StateType;
      match?: (item: StateType) => boolean;
    }
  | {
      type: "filter";
      filter: (item: StateType) => boolean;
    }
  | { type: "resize"; size: number; filler: StateType }
  | { type: "fill"; fillValue: StateType };

export function listReducer<StateType, InnerActionType>(
  state: StateType[],
  action: ListAction<StateType, InnerActionType>,
) {
  switch (action.type) {
    case "set":
      return action.newList;
    case "setItem":
      return [
        ...state.slice(0, action.index),
        action.itemReducer(state[action.index], action.action),
        ...state.slice(action.index + 1),
      ];
    case "insertItem":
      return [
        ...state.slice(0, action.index),
        action.item,
        ...state.slice(action.index),
      ];
    case "append":
      return listReducer(state, {
        type: "insertItem",
        item: action.item,
        index: state.length - 1,
      });
    case "remove": {
      const index = action.index || 0;
      return [...state.slice(0, index), ...state.slice(index + 1)];
    }
    case "map":
      // apply an action to all items in the list.
      return state.map((item) => action.itemReducer(item, action.action));
    case "replaceItem":
      return [
        ...state.slice(0, action.index),
        action.newValue,
        ...state.slice(action.index + 1),
      ];
    case "toggle": {
      const itemIndex = action.match
        ? state.findIndex(action.match)
        : state.indexOf(action.item);
      if (itemIndex === -1) {
        return listReducer(state, { type: "append", item: action.item });
      } else {
        return listReducer(state, { type: "remove", index: itemIndex });
      }
    }
    case "filter": {
      return state.filter(action.filter);
    }
    case "resize": {
      const resized = Array(action.size).fill(action.filler);
      state.forEach((item, index) => {
        resized[index] = item;
      });
      return resized;
    }
    case "fill": {
      return Array(state.length).fill(action.fillValue);
    }
  }
}

export interface ToggleResult {
  action: "added" | "removed";
  newLength: number;
}

export interface ListHook<T> {
  value: T[];
  set: (newList: T[]) => void;
  pushItem: (newItem: T) => void;
  removeItem: (itemIndex: number) => void;
  replaceItem: (index: number, newItem: T) => void;
  hasItems: boolean;
  toggleItem: (item: T, match?: (a: T) => boolean) => ToggleResult;
  filter: (filter: (a: T) => boolean) => void;
  resize: (size: number, filler: T) => void;
  fill: (value: T) => void;
}
export function useList<T>(initList: T[] | (() => T[])): ListHook<T> {
  const [value, set] = React.useState(initList);

  function pushItem(newItem: T): void {
    const newList = [...value, newItem];
    set(newList);
  }

  const removeItem = (index: number): void => {
    const newList = value.slice();
    newList.splice(index, 1);
    set(newList);
  };

  const replaceItem = (index: number, newItem: T): void => {
    set([...value.slice(0, index), newItem, ...value.slice(index + 1)]);
  };

  const hasItems = value.length > 0;

  const toggleItem = (item: T, match?: (a: T) => boolean): ToggleResult => {
    const prevLength = value.length;
    const newValue = listReducer(value, { type: "toggle", item, match });
    const newLength = newValue.length;
    set(newValue);
    return { action: newLength > prevLength ? "added" : "removed", newLength };
  };

  const filter = (filterFunction?: (a: T) => boolean): void => {
    set(listReducer(value, { type: "filter", filter: filterFunction }));
  };

  const resize = (size: number, filler: T): void => {
    set(listReducer(value, { type: "resize", size, filler }));
  };

  const fill = (fillValue: T): void => {
    set(listReducer(value, { type: "fill", fillValue }));
  };

  return {
    value,
    set,
    pushItem,
    removeItem,
    replaceItem,
    hasItems,
    toggleItem,
    filter,
    resize,
    fill,
  };
}
