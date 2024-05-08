import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import Pricing from "@lightit/ui/src/common/NewComponent";

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
      <Pricing.Discount
        totalBeforeDiscount="$1,954.00"
        percentageToApply="15%"
      />
      <Pricing.Total totalAmount="US$199.00" />
      <Pricing.TotalWithTaxes totalAmount="US$300.00" />
      <Pricing.TaxesAndFees />
    </Pricing>
  ),
];
NoTaxes.decorators = [
  () => (
    <Pricing>
      <Pricing.Discount
        totalBeforeDiscount="$1,954.00"
        percentageToApply="15%"
      />
      <Pricing.Total totalAmount="US$199.00" />
    </Pricing>
  ),
];
NoDiscount.decorators = [
  () => (
    <Pricing>
      <Pricing.Total totalAmount="US$199.00" />
      <Pricing.TotalWithTaxes totalAmount="US$300.00" />
      <Pricing.TaxesAndFees />
    </Pricing>
  ),
];
OnlyTotal.decorators = [
  () => (
    <Pricing>
      <Pricing.Total totalAmount="US$199.00" />
    </Pricing>
  ),
];
