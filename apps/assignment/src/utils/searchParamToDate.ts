import { isValid, parse } from "date-fns";

export const searchParamToDate = (dateString: string | null) => {
  if (!dateString) {
    return new Date();
  }

  const formattedDate = parse(dateString, "yyyy-MM-dd", new Date());

  return isValid(formattedDate) ? formattedDate : new Date();
};
