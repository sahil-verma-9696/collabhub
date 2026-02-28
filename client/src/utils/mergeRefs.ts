import * as React from "react";

/**
 * Merge mulitple refs
 * ----------------------
 * @description
 * Merges multiple refs into a single ref function.
 * mergeRefs(ref1, ref2, ref3) will call ref1(node), ref2(node), ref3(node)
 * **Key point**
 * - React sees only ONE ref
 * - That ref manually forwards the same element to multiple refs
 */
export function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T) => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === "function") {
        ref(node);
      } else {
        (ref as React.RefObject<T | null>).current = node;
      }
    });
  };
}
