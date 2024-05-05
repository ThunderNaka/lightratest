import type { Meta, StoryObj } from "@storybook/react";

import { tw } from "@lightit/shared";
import { avatarSizes, CircularAvatar } from "@lightit/ui";
import type { AvatarProps } from "@lightit/ui";

const meta: Meta<AvatarProps> = {
  title: "Lightit ui/CircularAvatar",
  component: CircularAvatar,
  argTypes: {
    size: {
      control: { type: "radio" },
    },
    defaultToIcon: {
      control: { type: "boolean" },
    },
    image: {
      control: { type: "text" },
    },
    name: {
      control: { type: "text" },
    },
    className: {
      table: { disable: true },
    },
  },
};

export default meta;

type Story = StoryObj<AvatarProps>;

const ManyAvatars = ({ ...args }: AvatarProps) => {
  return (
    <div className={tw("flex flex-row items-center gap-4 p-4")}>
      {avatarSizes.map((size) => (
        <CircularAvatar key={size} name="John Doe" {...args} size={size} />
      ))}
    </div>
  );
};

const render = (args: AvatarProps) => <ManyAvatars {...args} />;

export const AvatarImage: Story = {
  args: {},
  render,
};

export const Initials: Story = {
  args: {
    defaultToIcon: false,
  },
  render,
};

export const CustomImage: Story = {
  args: {
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  },
  render,
};
