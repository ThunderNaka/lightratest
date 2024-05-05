import { isValid, parse } from "date-fns";

export const parseBackendDate = (dateString: string) => {
  const formattedDate = parse(dateString, "yyyy-MM-dd", new Date());

  if (isValid(formattedDate)) {
    return formattedDate;
  }

  // ok so we've received a date with timezone information, let's just use the new Date api
  return new Date(dateString);
};
