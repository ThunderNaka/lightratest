import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { QueryFunction, QueryKey } from "@tanstack/react-query";

export interface UseDebouncedQueryOptions {
  queryFn: QueryFunction<unknown, QueryKey>;
  queryKey: QueryKey;
  onError?: (error: unknown) => void;
  select?: (data: unknown) => unknown;
}

export const useDebouncedQuery = (
  params: UseDebouncedQueryOptions,
  debounce = 300,
) => {
  const [debouncedParams, setDebouncedParams] = useState(params);
  const [loading, setLoading] = useState(false);
  const stringify = (obj: unknown) => JSON.stringify(obj);

  const query = useQuery({
    ...debouncedParams,
  });

  useEffect(() => {
    setLoading(true);
    if (stringify(params) !== stringify(debouncedParams)) {
      const timerId = setTimeout(() => {
        setDebouncedParams(params);
        setLoading(false);
      }, debounce);
      return () => clearTimeout(timerId);
    } else {
      setLoading(false);
    }
  }, [params, debouncedParams, debounce]);

  // this 'manual' loading state will trigger from debounce til data is available
  // it is useful for showing a loading indicator while the query is debouncing
  return { ...query, isLoading: loading || query.isLoading };
};
