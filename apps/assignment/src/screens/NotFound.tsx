import React from "react";
import { useNavigate } from "react-router-dom";

import { Button, icons } from "@lightit/ui";

import { Cuchau404 } from "~/assets";
import { ROUTES } from "~/router";

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <section className="flex h-full items-center justify-center px-8 md:px-14">
      <main className="flex max-w-7xl flex-col justify-center gap-12 md:flex-row md:items-center md:gap-0">
        <div className="flex flex-col gap-6 border-l-4 border-l-tertiary-800 px-9 md:w-1/2 md:gap-7 lg:gap-9">
          <div className="flex flex-col gap-2.5">
            <h1 className="text-3xl font-medium md:text-4xl lg:text-5xl">
              Oops!
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl">
              {"We couldn't find what you're looking for."}
            </p>
          </div>
          <Button
            variant="primary"
            left={<icons.ArrowLeftIcon />}
            onClick={() => {
              navigate(ROUTES.base);
            }}
            className="w-fit"
          >
            Back to home
          </Button>
        </div>

        <div className="md:w-1/2">
          <img src={Cuchau404} alt="logo" />
        </div>
      </main>
    </section>
  );
};
