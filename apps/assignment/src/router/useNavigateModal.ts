import { useLocation, useNavigate } from "react-router-dom";

import type { ModalRoute } from "~/shared.types";

type ValidModalUrl<T extends string> = T extends `${infer _}/${infer _}`
  ? never
  : ModalRoute | `${ModalRoute}/${T}` | `${ModalRoute}/${T}/${T}`;

export const useNavigateModal = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { previousLocation } = (location.state ?? {}) as {
    previousLocation?: Location;
  };

  // we make normal routing work as well as param routing, but make multiple params invalid
  return <T extends string>(url: ValidModalUrl<T>) => {
    navigate(url, {
      state: { previousLocation: previousLocation ?? location },
    });
  };
};
