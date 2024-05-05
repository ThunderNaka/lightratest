import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { tw } from "@lightit/shared";
import { Button, PopupBox } from "@lightit/ui";
import type { PopupBoxProps } from "@lightit/ui";

import { Row } from "./common/Row";

interface CustomPopUpProps extends PopupBoxProps {
  backgroundColor?: string;
  textColor?: string;
}

const meta: Meta<CustomPopUpProps> = {
  title: "Lightit ui/PopUpBox",
  component: PopupBox,
  argTypes: {
    show: {
      table: { disable: true },
    },
    boxType: {
      table: { disable: true },
    },
    contentType: {
      control: { type: "radio" },
    },
    title: {
      control: { type: "text" },
    },
    message: {
      control: { type: "text" },
    },
    onClose: {
      table: { disable: true },
    },
    onConfirm: {
      table: { disable: true },
    },
    renderMessage: {
      table: { disable: true },
    },
    renderButtonGroup: {
      table: { disable: true },
    },
  },
};

export default meta;

type Story = StoryObj<CustomPopUpProps>;

const ManyDropdowns = ({ ...args }: CustomPopUpProps) => {
  const [showConfirmPopUp, setShowConfirmPopUp] = useState(false);
  const [showAlertPopUp, setShowAlertPopUp] = useState(false);
  const [showPromptPopUp, setShowPromptPopUp] = useState(false);
  return (
    <div className={tw("p-4")}>
      <Row title="Confirm pop up" className="flex flex-row items-center gap-4">
        <Button onClick={() => setShowConfirmPopUp(true)}>
          Open Pop Up Box
        </Button>
        <PopupBox
          {...args}
          show={showConfirmPopUp}
          boxType="confirm"
          onClose={() => setShowConfirmPopUp(false)}
          onConfirm={() => setShowConfirmPopUp(false)}
        />
      </Row>
      <Row title="Alert pop up" className="flex flex-row items-center gap-4">
        <Button onClick={() => setShowAlertPopUp(true)}>Open Pop Up Box</Button>
        <PopupBox
          {...args}
          show={showAlertPopUp}
          boxType="alert"
          onClose={() => setShowAlertPopUp(false)}
          onConfirm={() => setShowAlertPopUp(false)}
        />
      </Row>
      <Row title="Prompt pop up" className="flex flex-row items-center gap-4">
        <Button onClick={() => setShowPromptPopUp(true)}>
          Open Pop Up Box
        </Button>
        <PopupBox
          {...args}
          show={showPromptPopUp}
          boxType="prompt"
          onClose={() => setShowPromptPopUp(false)}
          onConfirm={() => setShowPromptPopUp(false)}
        />
      </Row>
    </div>
  );
};

const render = (args: CustomPopUpProps) => <ManyDropdowns {...args} />;

export const WarningRedPopUpBox: Story = {
  args: {
    contentType: "warningRed",
    title: "Delete project",
    message: "Project will be deleted forever.",
  },
  render,
};

export const WarningPopUpBox: Story = {
  args: {
    contentType: "warning",
    title: "Delete project",
    message: "Project will be deleted forever.",
  },
  render,
};

export const ErrorPopUpBox: Story = {
  args: {
    contentType: "error",
    title: "Sorry, something went wrong",
    message: "Please, try again later.",
  },
  render,
};

export const InformationPopUpBox: Story = {
  args: {
    contentType: "information",
    title: "This project cannot be deleted",
  },
  render,
};

export const SuccessPopUpBox: Story = {
  args: {
    contentType: "success",
    title: "Project deleted",
  },
  render,
};
