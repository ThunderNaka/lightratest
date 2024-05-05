import { parse } from "date-fns";

export const parseFormDate = (dateString: string) => {
  return parse(dateString, "dd/MM/yy", new Date());
};
