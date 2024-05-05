import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Switch } from "@lightit/ui";
import type { SwitchProps } from "@lightit/ui";

const meta: Meta<SwitchProps> = {
  title: "Lightit ui/Switch",
  component: Switch,
  argTypes: {
    value: {
      table: { disable: true },
    },
    checked: {
      table: { disable: true },
    },
  },
};

export default meta;

type Story = StoryObj<SwitchProps>;

const Container = (props: SwitchProps) => {
  const [checked, setValue] = useState(false);
  return (
    <div>
      <Switch {...props} checked={checked} onCheckedChange={setValue} />
    </div>
  );
};

export const Default: Story = {
  args: {
    className: "",
  },
  render: (args) => <Container {...args} />,
};
