import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { z } from "zod";

import { useToastStore } from "@lightit/toast";

const axiosErrorSchema = z.object({
  response: z.object({
    data: z.object({
      status: z.number(),
      success: z.boolean(),
      error: z.object({
        code: z.string(),
        message: z.string(),
      }),
    }),
  }),
});

export const validateError = (data: unknown) => {
  const parsedError = axiosErrorSchema.safeParse(data);

  if (parsedError.success) return parsedError.data;

  return undefined;
};

const axiosErrorTimeOffSchema = z.object({
  response: z.object({
    data: z.object({
      status: z.number(),
      success: z.boolean(),
      error: z.object({
        code: z.string(),
        message: z.string(),
        fields: z.record(z.array(z.string())),
      }),
    }),
  }),
});

export const validateTimeOffError = (data: unknown) => {
  const parsedError = axiosErrorTimeOffSchema.safeParse(data);

  if (parsedError.success) return parsedError.data;

  return undefined;
};

const axiosErrorExceedingHoursSchema = z.object({
  response: z.object({
    data: z.object({
      status: z.number(),
      success: z.boolean(),
      error: z.object({
        code: z.string(),
        message: z.string(),
        data: z.object({
          assignments: z
            .array(
              z.object({
                id: z.number(),
                fromDate: z.string(),
                toDate: z.string(),
                hours: z.number(),
                assignable: z
                  .object({
                    id: z.number(),
                    name: z.string(),
                  })
                  .nullable(),
                employee: z.object({
                  id: z.number(),
                  name: z.string(),
                }),
              }),
            )
            .optional(),
        }),
      }),
    }),
  }),
});
export const validateExceedingHoursError = (data: unknown) => {
  const parsedError = axiosErrorExceedingHoursSchema.safeParse(data);

  if (parsedError.success) return parsedError.data;

  return undefined;
};

const axiosFormErrorSchema = z.object({
  response: z.object({
    data: z.object({
      status: z.number(),
      success: z.boolean(),
      error: z.object({
        code: z.string(),
        message: z.string(),
        fields: z.record(z.array(z.string())),
      }),
    }),
  }),
});

export const validateFormError = (data: unknown) => {
  const parsedError = axiosFormErrorSchema.safeParse(data);

  if (parsedError.success) return parsedError.data;

  return undefined;
};

export const errorToast = (error: unknown): void => {
  const pushToast = useToastStore.getState().pushToast;

  const validatedError = validateError(error);

  if (validatedError) {
    void pushToast({
      type: "error",
      title: "Validation Error",
      message: validatedError.response.data.error.message,
    });
  } else {
    console.error(error);
    void pushToast({
      type: "error",
      title: "Error",
      message: "Unknown error",
    });
  }
};

export const parseAxiosFormErrors = <T extends Record<string, unknown>>(
  apiError?: unknown,
): Partial<Record<keyof T, string[]>> => {
  const parsedError = axiosFormErrorSchema.safeParse(apiError);
  if (parsedError.success) {
    // TODO: find a way to avoid this casting
    return parsedError.data.response.data.error.fields as object;
  }

  return {};
};

export const handleAxiosFieldErrors = <T extends FieldValues>(
  err: unknown,
  setError: UseFormSetError<T>,
  hasDateRange?: boolean,
) => {
  const formErrors = parseAxiosFormErrors<T>(err);
  const entries = Object.entries(formErrors) as [Path<T>, string[]][];

  entries.forEach(([fieldName, errors]) => {
    const firstError = errors[0];

    if (firstError) {
      let errorKey = fieldName;
      if (
        hasDateRange &&
        (errorKey.endsWith("fromDate") || errorKey.endsWith("toDate"))
      ) {
        const errorKeyList = errorKey.split(".");
        errorKeyList[errorKeyList.length - 1] = `dateRange.${
          errorKeyList[errorKeyList.length - 1]
        }`;
        errorKey = errorKeyList.join(".") as Path<T>;
      }

      setError(
        errorKey,
        { type: "backend", message: firstError },
        { shouldFocus: true },
      );
    }
  });
};
