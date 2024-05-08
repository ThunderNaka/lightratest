import React from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";

import { IconWrapper } from "./Icons";
import Paragraph from "./Paragraph";
import { IPricing, IPricingDiscount, IPricingTotal } from "./PrincingTypes";
import { Tooltip } from "./Tooltip";

const Pricing = ({ children }: IPricing) => {
  return <div className=" flex flex-col items-end text-right ">{children}</div>;
};

Pricing.Discount = ({
  totalBeforeDiscount,
  percentageToApply,
}: IPricingDiscount) => {
  return (
    <div className="flex gap-1">
      <Paragraph textColor="text-primary-700" className="line-through">
        {totalBeforeDiscount}
      </Paragraph>
      <Paragraph textColor="text-green-900" fontWeight="semibold">
        {`${percentageToApply} Off`}
      </Paragraph>
    </div>
  );
};
Pricing.Total = ({ totalAmount }: IPricingTotal) => {
  return (
    <Paragraph size="medium" fontWeight="semibold">
      {totalAmount}
    </Paragraph>
  );
};
Pricing.TotalWithTaxes = ({ totalAmount }: IPricingTotal) => {
  return (
    <Paragraph size="xxsmall" fontWeight="semibold">
      {`Total ${totalAmount}`}
    </Paragraph>
  );
};
Pricing.TaxesAndFees = () => {
  return (
    <div className="flex items-center gap-1">
      <Paragraph size="xxsmall" textColor="text-primary-300">
        Includes Taxes and Fees
      </Paragraph>

      <Tooltip content="The taxes are tax recovery charges Simplenight pays to its vendors (e.g. hotels); for details, please see our Terms of Use. We retain our service fees as compensation in servicing your travel reservation.">
        <IconWrapper size={"sm"}>
          <QuestionMarkCircleIcon className="text-primary-300" />
        </IconWrapper>
      </Tooltip>
    </div>
  );
};

export default Pricing;
