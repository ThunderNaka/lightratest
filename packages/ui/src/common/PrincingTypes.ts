import type { PropsWithChildren, ReactElement } from "react";

export interface IPricing extends PropsWithChildren<unknown> {
  children: ReactElement | ReactElement[];
}

export interface IPricingDiscount {
  totalBeforeDiscount: string;
  percentageToApply: string;
}
export interface IPricingTotal {
  totalAmount: string;
}
