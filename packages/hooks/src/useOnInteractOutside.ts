import { useEffect } from "react";
import type { RefObject } from "react";

export function useOnInteractOutside(
  handler: (event: MouseEvent | TouchEvent | FocusEvent) => void,
  ...refs: RefObject<HTMLDivElement>[]
) {
  useEffect(
    () => {
      const listener = (event: MouseEvent | TouchEvent | FocusEvent) => {
        // Do nothing if clicking ref's element or descendent elements
        if (
          !refs.some(
            (ref) => ref.current?.contains(event.target as Node | null),
          )
        ) {
          handler(event);
        }
      };

      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      document.addEventListener("focusin", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
        document.addEventListener("focusin", listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [refs, handler],
  );
}
