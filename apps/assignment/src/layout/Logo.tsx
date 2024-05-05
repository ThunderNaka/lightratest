import { useNavigate } from "react-router-dom";

import { LightitLogo } from "~/assets";
import { ROUTES } from "~/router";

export const Logo = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-shrink-0 items-center">
      <button onClick={() => navigate(ROUTES.projects.base)}>
        <img
          src={LightitLogo}
          alt="Light-it logo"
          className="h-[70px] w-[150px]"
        />
      </button>
    </div>
  );
};
