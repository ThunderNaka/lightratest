import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import autoAnimate from "@formkit/auto-animate";
import type {
  AnimationController,
  AutoAnimateOptions,
  AutoAnimationPlugin,
} from "@formkit/auto-animate";

export function useBetterAutoAnimate<T extends Element>(
  options?: Partial<AutoAnimateOptions> | AutoAnimationPlugin,
): [RefObject<T>, (enabled: boolean) => void] {
  const [controller, setController] = useState<
    AnimationController | undefined
  >();
  const parent = useRef(null);

  useEffect(() => {
    parent.current && setController(autoAnimate(parent.current, options ?? {}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parent.current]);

  return [
    parent,
    (enabled: boolean) => {
      if (controller) {
        enabled ? controller.enable() : controller.disable();
      }
    },
  ];
}
