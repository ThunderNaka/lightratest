import React from "react";

export interface IPricing extends React.PropsWithChildren<{}> {
  children: React.ReactElement | React.ReactElement[];
}

export interface IPricingDiscount {
  totalBeforeDiscount: string;
  percentageToApply: string;
}
export interface IPricingTotal {
  totalAmount: string;
}
