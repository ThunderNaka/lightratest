import type { Meta, StoryObj } from "@storybook/react";

import { Button, Tabs } from "@lightit/ui";
import type { TabsProps } from "@lightit/ui";

import { useCsv } from "./common/useCsv";

type CustomTabsProps = TabsProps<string, string> & { csvTabs: string };

const meta: Meta<CustomTabsProps> = {
  title: "Lightit ui/Tabs",
  component: Tabs,
  argTypes: {
    className: {
      control: { type: "text" },
    },
    csvTabs: {
      control: { type: "text" },
    },
    tabs: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

type Story = StoryObj<CustomTabsProps>;

const Container = ({
  onChange,
  value: controlledValue,
  csvTabs,
  renderTab,
  ...props
}: CustomTabsProps) => {
  const { list, value, setValue } = useCsv(csvTabs, controlledValue);

  return (
    <div>
      <Tabs
        {...props}
        tabs={list}
        value={value}
        onChange={(t) => {
          setValue(t);
          onChange(t);
        }}
        renderTab={renderTab}
      />
      The selected tab is <span className="font-bold">{value}</span>
    </div>
  );
};

const csvTabs = "Tab 1, Tab 2, Tab 3";
const render = (args: CustomTabsProps) => <Container {...args} />;

export const Default: Story = {
  args: {
    value: "Tab 1",
    csvTabs,
  },
  render,
};

export const CustomRender: Story = {
  args: {
    value: "Tab 1",
    csvTabs,
    className: "flex gap-2",
    renderTab: ({ tab, onClick, selected }) => (
      <Button variant={selected ? "primary" : "secondary"} onClick={onClick}>
        {tab}
      </Button>
    ),
  },
  render,
};
