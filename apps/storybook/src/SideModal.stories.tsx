import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Button, SideModal } from "@lightit/ui";
import type { SideModalProps } from "@lightit/ui";

const meta: Meta<SideModalProps> = {
  title: "Lightit ui/SideModal",
  component: SideModal,
  argTypes: {
    show: {
      type: { name: "boolean", required: true },
      description: "Show the side modal",
      control: {
        type: "boolean",
      },
      defaultValue: true,
    },
    children: {
      description: "Content of the side modal",
    },
  },
};

export default meta;

type Story = StoryObj<SideModalProps>;

const Container = (props: SideModalProps) => {
  const [show, setShow] = useState(!!props.show);

  return (
    <div>
      <Button onClick={() => setShow((s) => !s)}>Open Modal</Button>
      <SideModal {...props} show={show} onClose={() => setShow(false)} />
    </div>
  );
};

export const Default: Story = {
  args: {
    children: (
      <div>
        <h1>Content of modal </h1>
      </div>
    ),
    show: false,
    onClose: () => null,
  },
  render: (args) => <Container {...args} />,
};
