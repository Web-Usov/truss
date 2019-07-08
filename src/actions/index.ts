import { Action } from "redux";

export function isAction<A extends Action>(action: Action, type: string): action is A {
  return action.type === type;
}