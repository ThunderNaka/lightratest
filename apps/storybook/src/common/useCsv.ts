import { useEffect, useMemo, useState } from "react";

// Very useful hook for handling sb controls in CSV text format
export function useCsv(csv: string, controlledValue?: string) {
  const list = useMemo(
    () =>
      csv
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    [csv],
  );
  const [value, setValue] = useState(controlledValue ?? "");

  useEffect(() => {
    if (list[0] && !list.includes(value)) {
      setValue(list[0]);
    }
  }, [list, value]);

  useEffect(() => {
    if (controlledValue) {
      setValue(controlledValue);
    }
  }, [controlledValue]);

  return { list, value, setValue };
}
