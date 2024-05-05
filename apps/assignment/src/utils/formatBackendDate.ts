import { format } from "date-fns";

import { parseBackendDate } from "./parseBackendDate";

export const formatBackendDate = (dateString?: string) => {
  if (!dateString) {
    return "";
  }

  // ok so we've received a date with timezone information, let's just use the new Date api
  return format(parseBackendDate(dateString), "dd/MM/yy");
};

export const formatBackendDateToVerbose = (dateString?: string) => {
  if (!dateString) {
    return "";
  }

  return format(parseBackendDate(dateString), "MMM dd");
};

export const formatBackendDateFullYear = (dateString?: string) => {
  if (!dateString) {
    return "";
  }

  return format(parseBackendDate(dateString), "dd/MM/yyyy");
};
