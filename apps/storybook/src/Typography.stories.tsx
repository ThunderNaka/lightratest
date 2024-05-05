import type { Meta, StoryObj } from "@storybook/react";

import { tw } from "@lightit/shared";
import { Typography, typographyFonts } from "@lightit/ui";
import type { TypographyProps } from "@lightit/ui";

const meta: Meta<TypographyProps> = {
  title: "Lightit ui/Typography",
  component: Typography,
  argTypes: {
    as: {
      table: { disable: true },
    },
    variant: {
      control: { type: "radio" },
    },
    font: {
      control: { type: "radio" },
    },
  },
};

export default meta;

type Story = StoryObj<TypographyProps>;

const ManyTypographies = ({ ...args }: TypographyProps) => {
  return (
    <div className={tw("flex flex-row items-center gap-4 p-4")}>
      {typographyFonts.map((font) => (
        <Typography key={font} font={font} {...args}>
          Typography
        </Typography>
      ))}
    </div>
  );
};

const render = (args: TypographyProps) => <ManyTypographies {...args} />;

export const Base: Story = {
  args: {
    variant: "base",
  },
  render,
};

export const Detail: Story = {
  args: {
    variant: "detail",
  },
  render,
};

export const Large: Story = {
  args: {
    variant: "large",
  },
  render,
};

export const Small: Story = {
  args: {
    variant: "small",
  },
  render,
};

export const Xlarge: Story = {
  args: {
    variant: "xlarge",
  },
  render,
};
