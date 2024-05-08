import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import {
  Pricing,
  PricingDiscount,
  PricingTaxesAndFees,
  PricingTotal,
  PricingTotalWithTaxes,
} from "@lightit/ui/src/common/NewComponent";

export default {
  title: "Workshop/Princing",
  component: Pricing,
} as ComponentMeta<typeof Pricing>;

const Template: ComponentStory<typeof Pricing> = (args) => (
  <Pricing {...args} />
);

export const Complete = Template.bind({});
export const NoTaxes = Template.bind({});
export const NoDiscount = Template.bind({});
export const OnlyTotal = Template.bind({});

Complete.decorators = [
  () => (
    <Pricing>
      <PricingDiscount
        totalBeforeDiscount="$1,954.00"
        percentageToApply="15%"
      />
      <PricingTotal totalAmount="US$199.00" />
      <PricingTotalWithTaxes totalAmount="US$300.00" />
      <PricingTaxesAndFees />
    </Pricing>
  ),
];
NoTaxes.decorators = [
  () => (
    <Pricing>
      <PricingDiscount
        totalBeforeDiscount="$1,954.00"
        percentageToApply="15%"
      />
      <PricingTotal totalAmount="US$199.00" />
    </Pricing>
  ),
];
NoDiscount.decorators = [
  () => (
    <Pricing>
      <PricingTotal totalAmount="US$199.00" />
      <PricingTotalWithTaxes totalAmount="US$300.00" />
      <PricingTaxesAndFees />
    </Pricing>
  ),
];
OnlyTotal.decorators = [
  () => (
    <Pricing>
      <PricingTotal totalAmount="US$199.00" />
    </Pricing>
  ),
];
