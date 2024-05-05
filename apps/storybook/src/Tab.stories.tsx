import type { Meta, StoryObj } from "@storybook/react";

import { Tab } from "@lightit/ui";
import type { TabProps } from "@lightit/ui";

type CustomTabProps = TabProps;

const meta: Meta<CustomTabProps> = {
  title: "Lightit ui/Tab",
  component: Tab,
  argTypes: {
    value: {
      control: { type: "text" },
    },
    isSelected: {
      control: { type: "boolean" },
    },
    className: {
      control: { type: "text" },
    },
  },
};

export default meta;

type Story = StoryObj<CustomTabProps>;

const Container = ({ ...props }: CustomTabProps) => {
  return (
    <div>
      <Tab {...props} />
    </div>
  );
};

const render = (args: CustomTabProps) => <Container {...args} />;

export const Default: Story = {
  args: {
    value: "Tab 1",
    isSelected: true,
  },
  render,
};
