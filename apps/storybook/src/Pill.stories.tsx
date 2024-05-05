import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { tw } from "@lightit/shared";
import { Pill } from "@lightit/ui";
import type { PillProps } from "@lightit/ui";

const meta: Meta<PillProps> = {
  title: "Lightit ui/Pill",
  component: Pill,
  argTypes: {
    textClassName: {
      control: { type: "text" },
    },
    className: {
      control: { type: "text" },
    },
    disabled: {
      control: { type: "boolean" },
    },
    onClose: {
      table: { disable: true },
    },
  },
};

export default meta;

type Story = StoryObj<PillProps>;

const ManyPills = ({ ...args }: PillProps) => {
  const [showPill, setShowPill] = useState(true);
  const hidePill = () => {
    setShowPill(false);
    setTimeout(() => {
      setShowPill(true);
    }, 3000);
  };
  return (
    <div className={tw("flex flex-row items-center gap-4 p-4")}>
      {showPill && (
        <Pill
          className="bg-secondary-600 text-white"
          {...args}
          onClose={() => hidePill()}
        >
          Pill
        </Pill>
      )}
    </div>
  );
};

const render = (args: PillProps) => <ManyPills {...args} />;

export const Base: Story = {
  render,
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render,
};
