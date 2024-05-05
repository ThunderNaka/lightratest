import type { ChangeEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { LegacySelect as Select } from "@lightit/ui";
import type { SelectProps } from "@lightit/ui";

import { Row } from "./common/Row";
import { useCsv } from "./common/useCsv";

type CustomSelectProps = SelectProps & { csvOptions: string };

const meta: Meta<CustomSelectProps> = {
  title: "Lightit ui/Select",
  component: Select,
  argTypes: {
    disabled: {
      options: [true, false],
      control: { type: "radio" },
    },
    label: {
      control: { type: "text" },
    },
    options: {
      table: { disable: true },
    },
    error: {
      table: { disable: true },
    },
    message: {
      table: { disable: true },
    },
  },
} as Meta<CustomSelectProps>;

export default meta;

type Story = StoryObj<CustomSelectProps>;

const ManySelects = ({
  csvOptions,
  onChange,
  value: controlledValue,
  ...props
}: CustomSelectProps) => {
  const { list, value, setValue } = useCsv(csvOptions, controlledValue);

  const commonProps = {
    ...props,
    options: list.map((t) => ({ value: t, label: t })),
    value,
    onChange: (e: ChangeEvent<HTMLSelectElement>) => {
      setValue(e.target.value);
      onChange?.(e);
    },
  };

  return (
    <div>
      <Row title="Default">
        <Select {...commonProps} />
      </Row>
      <Row title="Error">
        <Select {...commonProps} error="error message" />
      </Row>
      <Row title="Message">
        <Select {...commonProps} message="message" />
      </Row>
      <Row title="Long Message">
        <Select
          {...commonProps}
          message="really really really really ... like, really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really stupidly exhaustively extremely ironically inexplicably impossibly unbelievably long message"
        />
      </Row>
      <Row title="Err + Msg">
        <Select
          {...commonProps}
          error="error message overriding a message"
          message="this message should not appear because it's getting overridden by the error"
        />
      </Row>
      <Row title="Default disabled">
        <Select {...commonProps} disabled={true} />
      </Row>
    </div>
  );
};

export const Default: Story = {
  args: {
    label: "Label",
    csvOptions: "Option 1, Option 2, Option 3, Option 4",
  },
  render: (args) => <ManySelects {...args} />,
};
