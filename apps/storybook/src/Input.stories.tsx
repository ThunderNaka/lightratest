import type { Meta, StoryObj } from "@storybook/react";

import { Input } from "@lightit/ui";
import type { InputProps } from "@lightit/ui";

import { RandomIcon } from "./common/RandomIcon";
import { Row } from "./common/Row";

const meta: Meta<InputProps> = {
  title: "Lightit ui/Input",
  component: Input,
  argTypes: {
    disabled: {
      options: [true, false],
      control: { type: "radio" },
    },
    label: {
      control: { type: "text" },
    },
    left: {
      table: { disable: true },
    },
    error: {
      table: { disable: true },
    },
    message: {
      table: { disable: true },
    },
    right: {
      table: { disable: true },
    },
  },
};

export default meta;

type Story = StoryObj<InputProps>;

const ManyInputs = (props: InputProps) => (
  <div>
    <Row title="Default">
      <Input {...props} />
    </Row>
    <Row title="Error">
      <Input {...props} error="error message" />
    </Row>
    <Row title="Message">
      <Input {...props} message="message" />
    </Row>
    <Row title="Long Message">
      <Input
        {...props}
        message="really really really really ... like, really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really stupidly exhaustively extremely ironically inexplicably impossibly unbelievably long message"
      />
    </Row>
    <Row title="Err + Msg">
      <Input
        {...props}
        error="error message overriding a message"
        message="this message should not appear because it's getting overridden by the error"
      />
    </Row>
    <Row title="Default disabled">
      <Input {...props} disabled={true} />
    </Row>
  </div>
);

const render = (args: InputProps) => <ManyInputs {...args} />;

export const Default: Story = {
  args: {
    label: "Label",
  },
  render,
};

export const LeftIcon: Story = {
  args: {
    label: "Label",
    left: <RandomIcon />,
  },
  render,
};

export const RightIcon: Story = {
  args: {
    label: "Label",
    right: <RandomIcon />,
  },
  render,
};

export const LeftRightIcons: Story = {
  args: {
    label: "Label",
    left: <RandomIcon />,
    right: <RandomIcon />,
  },
  render,
};
