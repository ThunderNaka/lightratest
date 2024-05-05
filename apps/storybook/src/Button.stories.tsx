import type { Meta, StoryObj } from "@storybook/react";

import { tw } from "@lightit/shared";
import { Button, buttonSizes } from "@lightit/ui";
import type { ButtonProps } from "@lightit/ui";

import { RandomIcon } from "./common/RandomIcon";
import { Row } from "./common/Row";

interface CustomButtonProps extends ButtonProps {
  backgroundColor?: string;
  textColor?: string;
}

const meta: Meta<CustomButtonProps> = {
  title: "Lightit ui/Button",
  component: Button,
  argTypes: {
    disabled: {
      options: [true, false],
      control: { type: "radio" },
    },
    left: {
      table: { disable: true },
    },
    right: {
      table: { disable: true },
    },
    backgroundColor: {
      table: { disable: true },
    },
    textColor: {
      table: { disable: true },
    },
  },
};

export default meta;

type Story = StoryObj<CustomButtonProps>;

const ManyButtons = ({
  backgroundColor,
  textColor,
  ...args
}: CustomButtonProps) => {
  return (
    <div
      className={tw(
        backgroundColor ?? "bg-transparent",
        textColor ?? "text-black",
        "p-4",
      )}
    >
      <Row title="Text only" className="flex flex-row items-center gap-4">
        {buttonSizes.map((size) => (
          <Button key={size} size={size} {...args}>
            Button
          </Button>
        ))}
      </Row>
      <Row title="Icon only" className="flex flex-row items-center gap-4">
        {buttonSizes.map((size) => (
          <Button key={size} size={size} {...args} left={<RandomIcon />} />
        ))}
      </Row>
      <Row
        title="Text and left icon"
        className="flex flex-row items-center gap-4"
      >
        {buttonSizes.map((size) => (
          <Button key={size} size={size} {...args} left={<RandomIcon />}>
            Button
          </Button>
        ))}
      </Row>
      <Row
        title="Text and right icon"
        className="flex flex-row items-center gap-4"
      >
        {buttonSizes.map((size) => (
          <Button key={size} size={size} {...args} right={<RandomIcon />}>
            Button
          </Button>
        ))}
      </Row>
      <Row
        title="Text and right icon disabled"
        className="flex flex-row items-center gap-4"
      >
        {buttonSizes.map((size) => (
          <Button
            key={size}
            size={size}
            {...args}
            right={<RandomIcon />}
            disabled={true}
          >
            Button
          </Button>
        ))}
      </Row>
    </div>
  );
};

const render = (args: CustomButtonProps) => <ManyButtons {...args} />;

export const Primary: Story = {
  args: {
    variant: "primary",
  },
  render,
};

export const Outline: Story = {
  args: {
    variant: "outline",
  },
  render,
};

export const OutlineWhite: Story = {
  args: {
    variant: "outline-white",
    backgroundColor: "bg-primary",
    textColor: "text-primary-white-100",
  },
  render,
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
  render,
};

export const White: Story = {
  args: {
    variant: "tertiary-link",
  },
  render,
};
