import { format, parse } from "date-fns";

export const formatFormDate = (formDate: string | Date) => {
  const formattedDate =
    formDate instanceof Date
      ? formDate
      : parse(formDate, "dd/MM/yy", new Date());

  return format(formattedDate, "yyyy-MM-dd");
};
