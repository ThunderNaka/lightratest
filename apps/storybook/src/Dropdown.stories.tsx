import type { Meta, StoryObj } from "@storybook/react";

import { tw } from "@lightit/shared";
import { Dropdown } from "@lightit/ui";
import type { DropdownProps } from "@lightit/ui";

import { RandomIcon } from "./common/RandomIcon";
import { Row } from "./common/Row";

const options = [
  { value: "Delete", label: "Delete" },
  { value: "Edit", label: "Edit" },
];

interface CustomDropdownProps<TId extends string> extends DropdownProps<TId> {
  backgroundColor?: string;
  textColor?: string;
}

const meta: Meta<CustomDropdownProps<string>> = {
  title: "Lightit ui/Dropdown",
  component: Dropdown,
  argTypes: {
    options: {
      table: { disable: true },
    },
    label: {
      control: { type: "text" },
    },
    className: {
      control: { type: "text" },
    },
    containerClassName: {
      control: { type: "text" },
    },
    optionsContainerClassName: {
      control: { type: "text" },
    },
    optionClassName: {
      control: { type: "text" },
    },
    iconsSize: {
      table: { disable: true },
    },
    renderButton: {
      table: { disable: true },
    },
  },
};

export default meta;

type Story = StoryObj<CustomDropdownProps<string>>;

const ManyDropdowns = <TId extends string>({
  ...args
}: CustomDropdownProps<TId>) => {
  return (
    <div className={tw("p-4")}>
      <Row title="Label dropdown" className="flex flex-row items-center gap-4">
        <Dropdown label="Dropdown" {...args} options={options} />
      </Row>
      <Row title="Icon button" className="flex flex-row items-center gap-4">
        <Dropdown
          {...args}
          options={options}
          renderButton={({ open }) => (
            <RandomIcon
              className={tw(
                "h-6 w-6 cursor-pointer text-neutrals-dark",
                open && "text-secondary-500",
              )}
            />
          )}
        />
      </Row>
    </div>
  );
};

const render = (args: CustomDropdownProps<string>) => (
  <ManyDropdowns {...args} />
);

export const Primary: Story = {
  args: {},
  render,
};
