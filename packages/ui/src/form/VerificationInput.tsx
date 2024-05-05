import React, { useRef } from "react";
import type { UseFormRegister } from "react-hook-form";
import { z } from "zod";
import type { ZodString } from "zod";

import { tw } from "@lightit/shared";

import { Input } from "./Input";

export const getSchema = <TPrefix extends string>(
  n: number,
  prefix: TPrefix,
  message: string | ((i: number) => string) = "Field is Required",
) => {
  return z.object(
    Object.fromEntries(
      Array.from({ length: n }, (_, i) => [
        `${prefix}${i}`,
        z
          .string()
          .trim()
          .min(1, typeof message === "function" ? message(i) : message),
      ]),
    ) as Record<`${TPrefix}${number}`, ZodString>,
  );
};

export const VerificationInput = <TPrefix extends string>({
  prefix,
  count,
  register,
}: {
  prefix: TPrefix;
  count: number;
  register: UseFormRegister<Record<`${TPrefix}${number}`, string>>;
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const getInputEl = (index: number) => {
    if (!rowRef.current) {
      return null;
    }
    return rowRef.current.querySelector<HTMLInputElement>(
      `input#${prefix}${index}`,
    );
  };

  return (
    <div ref={rowRef} className={tw("flex flex-col md:flex-row md:gap-4")}>
      {Array.from({ length: count }, (_, index) => {
        const id = `${prefix}${index}`;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const inputProps = register(id as any); // TODO: find a fix for this

        return (
          <Input
            id={id}
            key={index}
            maxLength={1}
            {...inputProps}
            onChange={(e) => {
              void inputProps.onChange(e);
              if (e.target.value) {
                // focus next
                getInputEl(index + 1)?.focus();
              }
            }}
            onKeyDown={(e) => {
              const selStart = e.currentTarget.selectionStart;
              if (
                selStart === 0 &&
                (e.key === "Backspace" || e.key === "ArrowLeft")
              ) {
                // focus previous
                const prevEl = getInputEl(index - 1);
                if (prevEl) {
                  e.preventDefault();
                  prevEl.focus();
                  setTimeout(() => prevEl.setSelectionRange(1, 1), 0);
                }
              }

              if (
                e.key === "ArrowRight" &&
                (selStart === 0 || (selStart === 1 && e.currentTarget.value))
              ) {
                // focus next
                getInputEl(index + 1)?.focus();
              }
            }}
          />
        );
      })}
    </div>
  );
};
