import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { tw } from "@lightit/shared";
import { DropdownMenu, Label } from "@lightit/ui";
import type { DropdownMenuProps } from "@lightit/ui";

import { Row } from "./common/Row";

interface CustomDropdownMenuProps extends DropdownMenuProps {
  backgroundColor?: string;
  textColor?: string;
}

const meta: Meta<CustomDropdownMenuProps> = {
  title: "Lightit ui/DropdownMenu",
  component: DropdownMenu,
  argTypes: {
    options: {
      table: { disable: true },
    },
    className: {
      control: { type: "text" },
    },
    onSelect: {
      table: { disable: true },
    },
  },
};

export default meta;

type Story = StoryObj<CustomDropdownMenuProps>;

const ManyDropdowns = ({ ...args }: CustomDropdownMenuProps) => {
  const [labelClassName, setLabelClassName] = useState("");
  const [label, setLabel] = useState("DropdownMenu");
  const options = [
    {
      id: "changeFontSize" as string,
      label: "Change font size",
      className: "hover:font-semibold",
      onClick: () => {
        setLabelClassName("text-xl");
      },
    },
    {
      id: "changeFontWeight" as string,
      label: "Change font weight",
      className: "hover:font-semibold",
      onClick: () => {
        setLabelClassName("font-bold");
      },
    },
    {
      id: "changeBgColor" as string,
      label: "Change bg color",
      className: "hover:font-semibold",
      onClick: () => {
        setLabelClassName("text-red-500");
      },
    },
  ];
  const options2 = [
    {
      id: "New label" as string,
      label: "Change to new label",
      className: "hover:font-semibold",
    },
    {
      id: "Old label" as string,
      label: "Change to old label",
      className: "hover:font-semibold",
    },
  ];
  return (
    <div className={tw("flex flex-col gap-4 p-4")}>
      <Row
        title="Label dropdown - onClick action for every option"
        className="flex flex-row items-center gap-4"
      >
        <Label className={labelClassName} label="Dropdown menu" />
        <DropdownMenu {...args} options={options} />
      </Row>
      <Row
        title="Default dropdown without label - onClick action for every option"
        className="flex flex-row items-center gap-4"
      >
        <DropdownMenu {...args} options={options} />
      </Row>
      <Row
        title="Default dropdown wit label - same onSelect action for all options"
        className="flex flex-row items-center gap-4"
      >
        <Label className={labelClassName} label={label} />
        <DropdownMenu {...args} options={options2} onSelect={setLabel} />
      </Row>
    </div>
  );
};

const render = (args: CustomDropdownMenuProps) => <ManyDropdowns {...args} />;

export const Primary: Story = {
  args: {},
  render,
};
