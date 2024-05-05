import type { Meta, StoryObj } from "@storybook/react";

import { tw } from "@lightit/shared";
import { Loading } from "@lightit/ui";
import type { LoadingProps } from "@lightit/ui";

const meta: Meta<LoadingProps> = {
  title: "Lightit ui/Loading",
  component: Loading,
  argTypes: {
    iconClassName: {
      table: { disable: true },
    },
    transparent: {
      table: { disable: true },
    },
    className: {
      control: { type: "text" },
    },
  },
};

export default meta;

type Story = StoryObj<LoadingProps>;

const ManyDropdowns = ({ ...args }: LoadingProps) => {
  return (
    <div className={tw("p-24")}>
      <Loading {...args} />
    </div>
  );
};

const render = (args: LoadingProps) => <ManyDropdowns {...args} />;

export const Primary: Story = {
  args: {},
  render,
};
