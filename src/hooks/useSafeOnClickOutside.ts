// src/hooks/useSafeOnClickOutside.ts
import { type MutableRefObject } from 'react';
import rawHook from 'react-cool-onclickoutside';

export type SafeRef<T extends HTMLElement = HTMLElement> = MutableRefObject<T | null>;

// FIX: Ensure handler matches rawHook’s expected Event type
const useSafeOnClickOutside = <T extends HTMLElement = HTMLElement>(
  handler: (event: Event) => void
): SafeRef<T> => {
  return rawHook(handler) as unknown as SafeRef<T>;
};

export default useSafeOnClickOutside;
